import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContagemSla, IndicadoresHome, PeriodoHome, SlaPorTipo } from '../models/indicadores-home.model';
import { CATEGORIAS_OCORRENCIA, Ocorrencia } from '../models/ocorrencia.model';
import { ResultadoConsulta } from '../models/resultado-consulta.model';
import { normalizarRisco, paraData, situacaoDoStatus } from '../utils/formatacao';
import { ClientesService } from './clientes.service';
import { OcorrenciasService } from './ocorrencias.service';

// Serviço Angular equivalente à camada de "Controle" do backend.
// O Angular NUNCA acessa o Databricks diretamente, só o backend (regra do DMS, seção 3.2).
//
// Ordem de busca dos indicadores (Sprint 4 — integração):
//   1. GET /api/home/indicadores?periodo=... (endpoint agregado previsto no DRE);
//   2. senão, monta os indicadores a partir das listas reais de ocorrências e clientes;
//   3. se a API estiver fora do ar, usa a base de demonstração (mesmo cálculo).
@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly baseUrl = `${environment.apiUrl}/home`;

  constructor(
    private http: HttpClient,
    private ocorrenciasService: OcorrenciasService,
    private clientesService: ClientesService,
  ) {}

  obterIndicadores(periodo: PeriodoHome): Observable<ResultadoConsulta<IndicadoresHome>> {
    return this.http.get<IndicadoresHome>(`${this.baseUrl}/indicadores`, { params: { periodo } }).pipe(
      map((dados) => ({ dados, demonstracao: false })),
      catchError(() =>
        forkJoin([this.ocorrenciasService.listar(), this.clientesService.listar()]).pipe(
          map(([ocorrencias, clientes]) => ({
            dados: calcularIndicadores(ocorrencias.dados, clientes.dados.length, periodo),
            demonstracao: ocorrencias.demonstracao,
          })),
        ),
      ),
    );
  }
}

export function inicioDoPeriodo(periodo: PeriodoHome, agora = new Date()): Date | null {
  if (periodo === 'todos') return null;
  const inicio = new Date(agora);
  inicio.setHours(0, 0, 0, 0);
  if (periodo === 'mes') inicio.setDate(1);
  else inicio.setDate(inicio.getDate() - Number(periodo));
  return inicio;
}

// Faixa "atenção" do SLA: ocorrência em aberto a menos de 24h do prazo.
const HORAS_ATENCAO = 24;

function situacaoSla(o: Ocorrencia, agora: Date): keyof ContagemSla | null {
  if (!o.prazoSla) return null;
  const prazo = paraData(o.prazoSla).getTime();
  if (situacaoDoStatus(o.status) === 'concluida') {
    const fim = o.dataEncerramento ? paraData(o.dataEncerramento).getTime() : prazo;
    // Encerramento só tem a data (sem hora): compara com o fim do dia do prazo
    const fimDoDiaPrazo = paraData(o.prazoSla);
    fimDoDiaPrazo.setHours(23, 59, 59, 999);
    return fim <= fimDoDiaPrazo.getTime() ? 'dentroPrazo' : 'vencidas';
  }
  const restante = prazo - agora.getTime();
  if (restante < 0) return 'vencidas';
  return restante <= HORAS_ATENCAO * 3600000 ? 'atencao' : 'dentroPrazo';
}

function contarSla(lista: Ocorrencia[], agora: Date): ContagemSla {
  const contagem: ContagemSla = { dentroPrazo: 0, atencao: 0, vencidas: 0 };
  for (const o of lista) {
    const s = situacaoSla(o, agora);
    if (s) contagem[s]++;
  }
  return contagem;
}

export function calcularIndicadores(
  ocorrencias: Ocorrencia[],
  clientesCadastrados: number | null,
  periodo: PeriodoHome = 'mes',
  agora = new Date(),
): IndicadoresHome {
  const inicio = inicioDoPeriodo(periodo, agora);
  const noPeriodo = (iso: string | null) => !inicio || (!!iso && paraData(iso) >= inicio);
  const hojeInicio = new Date(agora);
  hojeInicio.setHours(0, 0, 0, 0);
  const ehHoje = (iso: string | null) => !!iso && paraData(iso) >= hojeInicio && paraData(iso) <= agora;

  const situacao = (o: Ocorrencia) => situacaoDoStatus(o.status);
  const doPeriodo = ocorrencias.filter((o) => noPeriodo(o.data));
  const abertas = ocorrencias.filter((o) => situacao(o) !== 'concluida');
  const concluidas = ocorrencias.filter((o) => situacao(o) === 'concluida');

  const porTipo = Object.fromEntries(
    CATEGORIAS_OCORRENCIA.map((c) => [c, doPeriodo.filter((o) => o.categoria === c).length]),
  ) as IndicadoresHome['ocorrenciasPorTipo'];

  const prioridade = { critica: 0, alta: 0, media: 0, baixa: 0, semClassificacao: 0 };
  for (const o of doPeriodo) {
    const n = normalizarRisco(o.risco);
    if (n === 'critico') prioridade.critica++;
    else if (n === 'alto') prioridade.alta++;
    else if (n === 'medio') prioridade.media++;
    else if (n === 'baixo') prioridade.baixa++;
    else prioridade.semClassificacao++;
  }

  // SLA só é exibido quando a base informa prazos (campo prazoSla).
  const comPrazo = doPeriodo.filter((o) => !!o.prazoSla);
  const temSla = comPrazo.length > 0;
  const slaPorTipo: SlaPorTipo[] = CATEGORIAS_OCORRENCIA.map((tipo) => {
    const lista = comPrazo.filter((o) => o.categoria === tipo);
    return { tipo, total: lista.length, ...contarSla(lista, agora) };
  });
  const abertasComPrazo = abertas.filter((o) => !!o.prazoSla);

  return {
    clientesCadastrados,
    ocorrenciasAbertas: abertas.length,
    tratativasEmAndamento: abertas.filter((o) => situacao(o) === 'emTratativa').length,
    tratativasConcluidasPeriodo: concluidas.filter((o) => noPeriodo(o.dataEncerramento ?? o.data)).length,
    riscosIdentificadosPeriodo: doPeriodo.filter((o) => {
      const n = normalizarRisco(o.risco);
      return n === 'critico' || n === 'alto';
    }).length,
    ocorrenciasPorTipo: porTipo,
    ocorrenciasPorStatus: {
      pendente: doPeriodo.filter((o) => situacao(o) === 'pendente').length,
      emTratativa: doPeriodo.filter((o) => situacao(o) === 'emTratativa').length,
      concluida: doPeriodo.filter((o) => situacao(o) === 'concluida').length,
    },
    ocorrenciasPorPrioridade: prioridade,
    sla: temSla ? contarSla(comPrazo, agora) : null,
    slaPorTipo: temSla ? slaPorTipo : null,
    resumoDoDia: {
      novasOcorrencias: ocorrencias.filter((o) => ehHoje(o.data)).length,
      // Ainda não há registro de início de tratativa (fato_tratativa_ocorrencia) na API.
      tratativasIniciadas: null,
      tratativasConcluidas: concluidas.filter((o) => ehHoje(o.dataEncerramento)).length,
      slaVencendoHoje: abertasComPrazo.length
        ? abertasComPrazo.filter((o) => {
            const prazo = paraData(o.prazoSla!);
            return prazo >= agora && prazo.toDateString() === agora.toDateString();
          }).length
        : null,
      slaVencidos: abertasComPrazo.length ? abertasComPrazo.filter((o) => paraData(o.prazoSla!) < agora).length : null,
    },
  };
}
