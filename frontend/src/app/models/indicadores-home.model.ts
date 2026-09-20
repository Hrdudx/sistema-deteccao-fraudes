// Formato esperado do endpoint que o backend (HomeService, conforme o DMS) deve expor.
// Combine este contrato com o Diogo antes de implementar — é só uma proposta inicial.

export interface IndicadoresHome {
  ocorrenciasAbertas: number;
  ocorrenciasCriticas: number;
  ocorrenciasAltas: number;
  tratativasConcluidasHoje: number;
  slaPercentualDentroPrazo: number;
  slaVencidas: number;
  ocorrenciasPorTipo: {
    PLD: number;
    Chargeback: number;
    KYC: number;
    Fraude: number;
  };
  // Bloco principal, conforme a seção 9.2 do DMS ("Resumo do mês" é o bloco principal)
  resumoDoMes: ResumoOcorrencia[];
  // Bloco secundário, posicionado abaixo do resumo do mês
  resumoDoDia: ResumoOcorrencia[];
}

export interface ResumoOcorrencia {
  prioridade: 'Alta' | 'Media' | 'Baixa';
  ocorrencia: string;
  cliente: string;
  valor: number;
  slaRestante: string;
}
