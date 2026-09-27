// Contrato da Home (TEL02 do DRE). Formato proposto para o endpoint
// GET /api/home/indicadores?periodo=... do backend (HomeService, conforme o DMS).
// Enquanto o endpoint agregado não existir, o frontend monta este objeto a partir
// das listas de ocorrências e clientes da API (ver HomeService).

import { CategoriaOcorrencia } from './ocorrencia.model';

export type PeriodoHome = 'mes' | '30' | '90' | 'todos';

export interface ContagemSla {
  dentroPrazo: number;
  atencao: number;
  vencidas: number;
}

export interface SlaPorTipo extends ContagemSla {
  tipo: CategoriaOcorrencia;
  total: number;
}

export interface IndicadoresHome {
  // Cards do topo
  clientesCadastrados: number | null;
  ocorrenciasAbertas: number;
  tratativasEmAndamento: number;
  tratativasConcluidasPeriodo: number;
  riscosIdentificadosPeriodo: number;

  // Gráficos (ocorrências registradas no período)
  ocorrenciasPorTipo: Record<CategoriaOcorrencia, number>;
  ocorrenciasPorStatus: { pendente: number; emTratativa: number; concluida: number };
  ocorrenciasPorPrioridade: { critica: number; alta: number; media: number; baixa: number; semClassificacao: number };

  // SLA (RF10/RF11). null = a base ainda não informa prazos de SLA.
  sla: ContagemSla | null;
  slaPorTipo: SlaPorTipo[] | null;

  // Resumo do dia (RF13) — null quando a informação não existe na base
  resumoDoDia: {
    novasOcorrencias: number;
    tratativasIniciadas: number | null;
    tratativasConcluidas: number;
    slaVencendoHoje: number | null;
    slaVencidos: number | null;
  };
}
