import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlertaFraudeApi, AlertaPldApi, ChargebackApi, KycApi } from '../models/backend.model';
import { CategoriaOcorrencia, Ocorrencia } from '../models/ocorrencia.model';
import { ResultadoConsulta } from '../models/resultado-consulta.model';
import {
  ALERTAS_FRAUDE_DEMONSTRACAO,
  ALERTAS_PLD_DEMONSTRACAO,
  CHARGEBACKS_DEMONSTRACAO,
  KYCS_DEMONSTRACAO,
} from './dados-demonstracao';

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
    prazoSla: a.prazoSla ?? null,
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
    prazoSla: a.prazoSla ?? null,
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
    // O chargeback não possui campo de severidade no dicionário de dados.
    risco: null,
    status: c.statusChargeback ?? '—',
    data: c.dataContestacao ?? null,
    dataEncerramento: c.dataResolucao ?? null,
    prazoSla: c.prazoSla ?? null,
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
    // KYC não tem data de encerramento: a data da análise marca a decisão.
    dataEncerramento: k.statusKyc && /APROVAD|REPROVAD/i.test(k.statusKyc) ? (k.dataAnalise ?? null) : null,
    prazoSla: k.prazoSla ?? null,
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

// Ocorrências de demonstração, convertidas pelos mesmos conversores usados com a API real.
export const OCORRENCIAS_DEMONSTRACAO: Ocorrencia[] = [
  ...ALERTAS_PLD_DEMONSTRACAO.map(pldParaOcorrencia),
  ...CHARGEBACKS_DEMONSTRACAO.map(chargebackParaOcorrencia),
  ...KYCS_DEMONSTRACAO.map(kycParaOcorrencia),
  ...ALERTAS_FRAUDE_DEMONSTRACAO.map(fraudeParaOcorrencia),
];
