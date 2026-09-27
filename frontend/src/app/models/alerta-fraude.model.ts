export interface AlertaFraude {
  idAlertaFraude: string;
  dataAlerta: string;
  tipoFraude: string;
  scoreFraude: number;
  severidade: string;
  statusAnalise: string;
  resultado: string;
  valorExposto: number;
  valorPerda: number;
  analistaResponsavel: string;
  dataEncerramento?: string | null;
  observacao?: string | null;

  clienteOrigem?: ClienteAlerta | null;
  clienteDestino?: ClienteAlerta | null;
  clienteVitima?: ClienteAlerta | null;
  clienteSuspeito?: ClienteAlerta | null;
}

export interface ClienteAlerta {
  nomeRazaoSocial?: string;
  documentoFicticio?: string;
}