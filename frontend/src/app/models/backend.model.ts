// Formato (resumido) das entidades devolvidas pela API Spring Boot.
// Espelha os campos das classes em src/main/java/.../model — apenas o que as
// telas utilizam. Datas chegam como string ISO (LocalDate / LocalDateTime).

export interface ClienteApi {
  idCliente: string;
  tipoPessoa: string;
  nomeRazaoSocial: string;
  documentoFicticio: string;
  dataNascimentoAbertura?: string | null;
  cidade?: string | null;
  uf?: string | null;
  dataCadastro?: string | null;
  statusCliente?: string | null;
  segmento?: string | null;
  rendaFaturamentoMensal?: number | null;
  profissaoAtividade?: string | null;
  origemCadastro?: string | null;
}

export interface ContaApi {
  idConta: string;
  tipoConta?: string | null;
  dataAbertura?: string | null;
  statusConta?: string | null;
  limiteTransacionalDiario?: number | null;
  saldoMedio30d?: number | null;
}

export interface TransacaoApi {
  idTransacao: string;
  dataHoraTransacao?: string | null;
  tipoTransacao?: string | null;
  valor?: number | null;
  canal?: string | null;
  nomeContraparte?: string | null;
  scoreTransacao?: number | null;
  statusTransacao?: string | null;
}

// Campo ainda inexistente no backend; previsto para o cálculo de SLA (RN14).
interface ComPrazoSla {
  prazoSla?: string | null;
}

export interface TransacaoRefApi {
  idTransacao: string;
}

export interface AlertaFraudeApi extends ComPrazoSla {
  idAlertaFraude: string;
  transacao?: TransacaoRefApi | null;
  dataAlerta: string;
  clienteOrigem?: ClienteApi | null;
  tipoFraude?: string | null;
  scoreFraude?: number | null;
  severidade?: string | null;
  statusAnalise?: string | null;
  resultado?: string | null;
  valorExposto?: number | null;
  analistaResponsavel?: string | null;
  dataEncerramento?: string | null;
  observacao?: string | null;
}

export interface AlertaPldApi extends ComPrazoSla {
  idAlertaPld: string;
  transacaoReferencia?: TransacaoRefApi | null;
  dataAlerta: string;
  clienteAnalisado?: ClienteApi | null;
  tipoAlerta?: string | null;
  valorRelacionado?: number | null;
  scorePld?: number | null;
  severidade?: string | null;
  statusAnalise?: string | null;
  resultado?: string | null;
  analistaResponsavel?: string | null;
  dataEncerramento?: string | null;
  observacao?: string | null;
}

export interface ChargebackApi extends ComPrazoSla {
  idChargeback: string;
  transacao?: TransacaoRefApi | null;
  modalidade?: string | null;
  cliente?: ClienteApi | null;
  dataContestacao?: string | null;
  valorContestado?: number | null;
  motivoChargeback?: string | null;
  statusChargeback?: string | null;
  fraudeDeclarada?: boolean | null;
  resultadoInvestigacao?: string | null;
  dataResolucao?: string | null;
}

export interface KycApi extends ComPrazoSla {
  idKyc: string;
  cliente?: ClienteApi | null;
  dataAnalise?: string | null;
  scoreKyc?: number | null;
  nivelRiscoKyc?: string | null;
  statusKyc?: string | null;
  motivoDecisao?: string | null;
}

export interface RiscoClienteApi {
  scoreRiscoGeral?: number | null;
  nivelRisco?: string | null;
  qtdAlertasFraude?: number | null;
  qtdAlertasPld?: number | null;
  qtdChargebacks?: number | null;
  qtdFraudesConfirmadas?: number | null;
  valorPerdas?: number | null;
  dataUltimaAvaliacao?: string | null;
}

// GET /api/clientes/{id}/historico (ClienteHistoricoDTO)
export interface ClienteHistoricoApi {
  cliente: ClienteApi;
  contas?: ContaApi[] | null;
  transacoes?: TransacaoApi[] | null;
  kycs?: KycApi[] | null;
  alertasFraude?: AlertaFraudeApi[] | null;
  alertasPld?: AlertaPldApi[] | null;
  chargebacks?: ChargebackApi[] | null;
  riscoCliente?: RiscoClienteApi | null;
}
