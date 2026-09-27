// Formato esperado do endpoint GET /api/home/indicadores (HomeService do backend, conforme o DMS).
// Enquanto o endpoint agregado não existir, o frontend calcula estes números a partir
// das ocorrências reais da API (ver HomeService) — por isso os campos de SLA aceitam
// null: o modelo de dados atual ainda não tem prazo/SLA por ocorrência.

export interface IndicadoresHome {
  ocorrenciasAbertas: number;
  ocorrenciasCriticas: number;
  ocorrenciasAltas: number;
  tratativasConcluidasHoje: number;
  slaPercentualDentroPrazo: number | null;
  slaVencidas: number | null;
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
  id?: string;
  prioridade: 'Critica' | 'Alta' | 'Media' | 'Baixa';
  ocorrencia: string;
  cliente: string;
  valor: number | null;
  slaRestante: string | null;
}
