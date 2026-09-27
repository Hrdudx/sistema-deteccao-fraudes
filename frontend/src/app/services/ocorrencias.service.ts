import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlertaFraudeApi, AlertaPldApi, ChargebackApi, KycApi } from '../models/backend.model';
import { CategoriaOcorrencia, Ocorrencia } from '../models/ocorrencia.model';
import { ResultadoConsulta } from '../models/resultado-consulta.model';

// Conversores de cada entidade do backend para o formato comum de Ocorrência.
// Exportados porque a tela de Clientes reutiliza para montar o histórico.
export function pldParaOcorrencia(a: AlertaPldApi): Ocorrencia {
  return {
    id: a.idAlertaPld,
    categoria: 'PLD',
    clienteId: a.clienteAnalisado?.idCliente ?? null,
    cliente: a.clienteAnalisado?.nomeRazaoSocial ?? '—',
    documento: a.clienteAnalisado?.documentoFicticio ?? null,
    tipo: a.tipoAlerta ?? 'Alerta PLD',
    valor: a.valorRelacionado ?? null,
    risco: a.severidade ?? null,
    status: a.statusAnalise ?? '—',
    data: a.dataAlerta ?? null,
    dataEncerramento: a.dataEncerramento ?? null,
    score: a.scorePld ?? null,
    analista: a.analistaResponsavel ?? null,
    resultado: a.resultado ?? null,
    observacao: a.observacao ?? null,
  };
}

export function fraudeParaOcorrencia(a: AlertaFraudeApi): Ocorrencia {
  return {
    id: a.idAlertaFraude,
    categoria: 'Fraude',
    clienteId: a.clienteOrigem?.idCliente ?? null,
    cliente: a.clienteOrigem?.nomeRazaoSocial ?? '—',
    documento: a.clienteOrigem?.documentoFicticio ?? null,
    tipo: a.tipoFraude ?? 'Alerta de fraude',
    valor: a.valorExposto ?? null,
    risco: a.severidade ?? null,
    status: a.statusAnalise ?? '—',
    data: a.dataAlerta ?? null,
    dataEncerramento: a.dataEncerramento ?? null,
    score: a.scoreFraude ?? null,
    analista: a.analistaResponsavel ?? null,
    resultado: a.resultado ?? null,
    observacao: a.observacao ?? null,
  };
}

export function chargebackParaOcorrencia(c: ChargebackApi): Ocorrencia {
  return {
    id: c.idChargeback,
    categoria: 'Chargeback',
    clienteId: c.cliente?.idCliente ?? null,
    cliente: c.cliente?.nomeRazaoSocial ?? '—',
    documento: c.cliente?.documentoFicticio ?? null,
    tipo: c.motivoChargeback ?? 'Chargeback',
    valor: c.valorContestado ?? null,
    // O chargeback não possui campo de severidade no modelo de dados.
    risco: null,
    status: c.statusChargeback ?? '—',
    data: c.dataContestacao ?? null,
    dataEncerramento: c.dataResolucao ?? null,
    score: null,
    analista: null,
    resultado: c.resultadoInvestigacao ?? null,
    observacao: c.fraudeDeclarada ? 'Cliente declarou fraude na contestação.' : null,
  };
}

export function kycParaOcorrencia(k: KycApi): Ocorrencia {
  return {
    id: k.idKyc,
    categoria: 'KYC',
    clienteId: k.cliente?.idCliente ?? null,
    cliente: k.cliente?.nomeRazaoSocial ?? '—',
    documento: k.cliente?.documentoFicticio ?? null,
    tipo: 'Verificação cadastral (KYC)',
    valor: null,
    risco: k.nivelRiscoKyc ?? null,
    status: k.statusKyc ?? '—',
    data: k.dataAnalise ?? null,
    dataEncerramento: null,
    score: k.scoreKyc ?? null,
    analista: null,
    resultado: null,
    observacao: k.motivoDecisao ?? null,
  };
}

// Serviço da fila central de ocorrências (MVP): consulta os endpoints de cada
// categoria em paralelo e entrega uma lista única para a tela.
@Injectable({ providedIn: 'root' })
export class OcorrenciasService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<ResultadoConsulta<Ocorrencia[]>> {
    // Cada categoria falha de forma independente: se um endpoint cair, as demais
    // continuam aparecendo. Só usamos a demonstração quando nenhum responder.
    const buscar = <T>(url: string, conversor: (item: T) => Ocorrencia) =>
      this.http.get<T[]>(url).pipe(
        map((itens) => (itens ?? []).map(conversor)),
        catchError(() => of(null)),
      );

    return forkJoin([
      buscar<AlertaPldApi>(`${this.api}/alertas-pld`, pldParaOcorrencia),
      buscar<ChargebackApi>(`${this.api}/chargebacks`, chargebackParaOcorrencia),
      buscar<KycApi>(`${this.api}/kycs`, kycParaOcorrencia),
      buscar<AlertaFraudeApi>(`${this.api}/alertas-fraude`, fraudeParaOcorrencia),
    ]).pipe(
      map((listas) => {
        if (listas.every((l) => l === null)) {
          return { dados: OCORRENCIAS_DEMONSTRACAO, demonstracao: true };
        }
        return { dados: listas.flatMap((l) => l ?? []), demonstracao: false };
      }),
    );
  }
}

// Dados de demonstração (mesmos exemplos do protótipo de telas), usados quando o
// backend não está rodando — a apresentação da sprint não depende da API no ar.
const hoje = new Date();
const diasAtras = (dias: number, hora = 10) => {
  const d = new Date(hoje);
  d.setDate(d.getDate() - dias);
  d.setHours(hora, 14, 0, 0);
  return d.toISOString();
};

const base = { dataEncerramento: null, documento: null, score: null, analista: null, resultado: null, observacao: null };

export const OCORRENCIAS_DEMONSTRACAO: Ocorrencia[] = [
  { ...base, id: 'PLD-1028', categoria: 'PLD', clienteId: 'CLI-0001', cliente: 'Mariana Alves de Souza', documento: '***.***.***-42', tipo: 'Movimentação atípica', valor: 48900, risco: 'Alto', status: 'Aguardando tratativa', data: diasAtras(0, 9), score: 82, observacao: 'Valor acima do padrão recente do cliente.' },
  { ...base, id: 'PLD-1027', categoria: 'PLD', clienteId: 'CLI-0002', cliente: 'Rafael Nunes', tipo: 'Perfil incompatível', valor: 31200, risco: 'Médio', status: 'Em análise', data: diasAtras(0, 8), score: 64, analista: 'Equipe de Riscos' },
  { ...base, id: 'CB-0892', categoria: 'Chargeback', clienteId: 'CLI-0003', cliente: 'Empresa Delta Ltda.', tipo: 'Compra não reconhecida', valor: 7450, risco: null, status: 'Aguardando tratativa', data: diasAtras(1) },
  { ...base, id: 'KYC-0441', categoria: 'KYC', clienteId: 'CLI-0004', cliente: 'João Martins', tipo: 'Verificação cadastral (KYC)', valor: null, risco: 'Médio', status: 'Pendente', data: diasAtras(2), score: 55, observacao: 'Comprovante de endereço divergente.' },
  { ...base, id: 'FR-0770', categoria: 'Fraude', clienteId: 'CLI-0005', cliente: 'Camila Rocha', tipo: 'Conta laranja', valor: 12980, risco: 'Crítico', status: 'Aguardando tratativa', data: diasAtras(0, 11), score: 95 },
  { ...base, id: 'PLD-1019', categoria: 'PLD', clienteId: 'CLI-0006', cliente: 'Lucas Ferreira', tipo: 'Perfil incompatível', valor: 26700, risco: 'Alto', status: 'Concluída', data: diasAtras(9), resultado: 'Procedente', analista: 'Equipe de Riscos', observacao: 'Movimentação incompatível com o perfil recente e sem justificativa suficiente.' },
  { ...base, id: 'PLD-1015', categoria: 'PLD', clienteId: 'CLI-0007', cliente: 'Ana Ribeiro', tipo: 'Movimentação atípica', valor: 14300, risco: 'Médio', status: 'Concluída', data: diasAtras(9), resultado: 'Improcedente' },
  { ...base, id: 'FR-0765', categoria: 'Fraude', clienteId: 'CLI-0008', cliente: 'Comercial Alfa Ltda.', tipo: 'Engenharia social', valor: 92500, risco: 'Alto', status: 'Em análise', data: diasAtras(4), score: 88 },
  { ...base, id: 'CB-0887', categoria: 'Chargeback', clienteId: 'CLI-0009', cliente: 'Bruno Costa', tipo: 'Produto não entregue', valor: 8900, risco: null, status: 'Resolvido', data: diasAtras(20), resultado: 'Estornado' },
  { ...base, id: 'KYC-0438', categoria: 'KYC', clienteId: 'CLI-0010', cliente: 'Patrícia Gomes', tipo: 'Verificação cadastral (KYC)', valor: null, risco: 'Baixo', status: 'Aprovado', data: diasAtras(12), score: 18 },
];
