// Visão única de "ocorrência" usada pelas telas. O backend expõe uma entidade por
// categoria (alertas PLD, alertas de fraude, chargebacks e análises KYC); o
// OcorrenciasService converte cada uma para este formato comum, o que permite
// montar a fila central de ocorrências (MVP do projeto) com filtros únicos.

// Categorias oficiais (DMS, seções 5 e 9.4). Movimentações/Transacional NÃO entram aqui.
export type CategoriaOcorrencia = 'PLD' | 'Chargeback' | 'KYC' | 'Fraude';

export const CATEGORIAS_OCORRENCIA: CategoriaOcorrencia[] = ['PLD', 'Chargeback', 'KYC', 'Fraude'];

export interface Ocorrencia {
  id: string;
  categoria: CategoriaOcorrencia;
  clienteId: string | null;
  cliente: string;
  documento: string | null;
  tipo: string;
  valor: number | null;
  // Texto como veio do backend (ex.: "ALTA", "Médio"); a tela normaliza para exibir.
  risco: string | null;
  status: string;
  data: string | null;
  dataEncerramento: string | null;
  score: number | null;
  analista: string | null;
  resultado: string | null;
  observacao: string | null;
}
