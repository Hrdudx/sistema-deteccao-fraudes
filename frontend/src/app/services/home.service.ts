import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IndicadoresHome, ResumoOcorrencia } from '../models/indicadores-home.model';
import { Ocorrencia } from '../models/ocorrencia.model';
import { ResultadoConsulta } from '../models/resultado-consulta.model';
import { NivelRisco, PESO_RISCO, normalizarRisco, statusEncerrado } from '../utils/formatacao';
import { OcorrenciasService } from './ocorrencias.service';

// Serviço Angular equivalente à camada de "Controle" do backend.
// O Angular NUNCA acessa o Databricks diretamente, só o backend (regra do DMS, seção 3.2).
//
// Ordem de busca dos indicadores (Sprint 4 — integração):
//   1. GET /api/home/indicadores (endpoint agregado, quando o backend expuser);
//   2. senão, calcula a partir das ocorrências reais (PLD, Chargeback, KYC, Fraude);
//   3. se a API estiver fora do ar, usa os dados de demonstração do protótipo.
@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly baseUrl = `${environment.apiUrl}/home`;

  constructor(
    private http: HttpClient,
    private ocorrenciasService: OcorrenciasService,
  ) {}

  obterIndicadores(): Observable<ResultadoConsulta<IndicadoresHome>> {
    return this.http.get<IndicadoresHome>(`${this.baseUrl}/indicadores`).pipe(
      map((dados) => ({ dados, demonstracao: false })),
      catchError(() =>
        this.ocorrenciasService.listar().pipe(
          map((resultado) =>
            resultado.demonstracao
              ? { dados: INDICADORES_DEMONSTRACAO, demonstracao: true }
              : { dados: calcularIndicadores(resultado.dados), demonstracao: false },
          ),
        ),
      ),
    );
  }
}

const PRIORIDADE: Record<NivelRisco, ResumoOcorrencia['prioridade']> = {
  critico: 'Critica',
  alto: 'Alta',
  medio: 'Media',
  baixo: 'Baixa',
};

export function calcularIndicadores(ocorrencias: Ocorrencia[], agora = new Date()): IndicadoresHome {
  const abertas = ocorrencias.filter((o) => !statusEncerrado(o.status));
  const mesmoDia = (iso: string | null) => !!iso && new Date(iso).toDateString() === agora.toDateString();
  const mesmoMes = (iso: string | null) => {
    if (!iso) return false;
    const d = new Date(iso);
    return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
  };
  const peso = (o: Ocorrencia) => {
    const n = normalizarRisco(o.risco);
    return n ? PESO_RISCO[n] : 0;
  };
  const paraResumo = (o: Ocorrencia): ResumoOcorrencia => {
    const n = normalizarRisco(o.risco);
    return {
      id: o.id,
      prioridade: n ? PRIORIDADE[n] : 'Baixa',
      ocorrencia: o.categoria,
      cliente: o.cliente,
      valor: o.valor,
      slaRestante: null,
    };
  };
  const ordenar = (lista: Ocorrencia[]) => [...lista].sort((a, b) => peso(b) - peso(a));
  const contar = (categoria: Ocorrencia['categoria']) => abertas.filter((o) => o.categoria === categoria).length;

  return {
    ocorrenciasAbertas: abertas.length,
    ocorrenciasCriticas: abertas.filter((o) => normalizarRisco(o.risco) === 'critico').length,
    ocorrenciasAltas: abertas.filter((o) => normalizarRisco(o.risco) === 'alto').length,
    tratativasConcluidasHoje: ocorrencias.filter((o) => statusEncerrado(o.status) && mesmoDia(o.dataEncerramento))
      .length,
    slaPercentualDentroPrazo: null,
    slaVencidas: null,
    ocorrenciasPorTipo: {
      PLD: contar('PLD'),
      Chargeback: contar('Chargeback'),
      KYC: contar('KYC'),
      Fraude: contar('Fraude'),
    },
    resumoDoMes: ordenar(abertas.filter((o) => mesmoMes(o.data))).slice(0, 5).map(paraResumo),
    resumoDoDia: ordenar(abertas.filter((o) => mesmoDia(o.data))).slice(0, 5).map(paraResumo),
  };
}

// Dados de demonstração, iguais ao protótipo da Home.
const INDICADORES_DEMONSTRACAO: IndicadoresHome = {
  ocorrenciasAbertas: 128,
  ocorrenciasCriticas: 12,
  ocorrenciasAltas: 37,
  tratativasConcluidasHoje: 94,
  slaPercentualDentroPrazo: 87,
  slaVencidas: 17,
  ocorrenciasPorTipo: {
    PLD: 52,
    Chargeback: 31,
    KYC: 24,
    Fraude: 21,
  },
  resumoDoMes: [
    { id: 'FR-0770', prioridade: 'Critica', ocorrencia: 'Fraude', cliente: 'Camila Rocha', valor: 12980, slaRestante: '00h 34m' },
    { id: 'PLD-1028', prioridade: 'Alta', ocorrencia: 'PLD', cliente: 'Mariana Alves', valor: 48900, slaRestante: '01h 12m' },
    { id: 'FR-0765', prioridade: 'Alta', ocorrencia: 'Fraude', cliente: 'Comercial Alfa Ltda.', valor: 92500, slaRestante: '06h 10m' },
    { id: 'CB-0892', prioridade: 'Media', ocorrencia: 'Chargeback', cliente: 'Empresa Delta Ltda.', valor: 7450, slaRestante: '03h 40m' },
    { id: 'KYC-0441', prioridade: 'Media', ocorrencia: 'KYC', cliente: 'João Martins', valor: null, slaRestante: '05h 18m' },
  ],
  resumoDoDia: [
    { id: 'FR-0770', prioridade: 'Critica', ocorrencia: 'Fraude', cliente: 'Camila Rocha', valor: 12980, slaRestante: '00h 34m' },
    { id: 'PLD-1028', prioridade: 'Alta', ocorrencia: 'PLD', cliente: 'Mariana Alves', valor: 48900, slaRestante: '01h 12m' },
    { id: 'CB-0892', prioridade: 'Media', ocorrencia: 'Chargeback', cliente: 'Empresa Delta Ltda.', valor: 7450, slaRestante: '03h 40m' },
  ],
};
