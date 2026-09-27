// Funções de apoio para exibir, de forma padronizada, os textos que chegam do
// backend/Databricks em formatos variados ("ALTA", "alto", "EM_ANALISE"...).
// Valores de referência: dicionário de dados do projeto (camada Gold).

export type NivelRisco = 'critico' | 'alto' | 'medio' | 'baixo';

// Estados operacionais mínimos do DRE (RN10): Pendente, Em Tratativa e Concluída.
export type Situacao = 'pendente' | 'emTratativa' | 'concluida';

export const ROTULOS_SITUACAO: Record<Situacao, string> = {
  pendente: 'Pendente',
  emTratativa: 'Em tratativa',
  concluida: 'Concluída',
};

const ROTULOS_RISCO: Record<NivelRisco, string> = {
  critico: 'Crítico',
  alto: 'Alto',
  medio: 'Médio',
  baixo: 'Baixo',
};

// Ordem usada para ordenar a fila (mais grave primeiro).
export const PESO_RISCO: Record<NivelRisco, number> = {
  critico: 4,
  alto: 3,
  medio: 2,
  baixo: 1,
};

export function semAcento(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// severidade (MEDIA | ALTA | CRITICA), nivel_risco_kyc (BAIXO | MEDIO | ALTO)
// e nivel_risco (BAIXO | MEDIO | ALTO | CRITICO) caem no mesmo conjunto.
export function normalizarRisco(valor: string | null | undefined): NivelRisco | null {
  if (!valor) return null;
  const v = semAcento(valor).toLowerCase();
  if (v.startsWith('crit') || v.includes('muito alt')) return 'critico';
  if (v.startsWith('alt')) return 'alto';
  if (v.startsWith('med') || v.startsWith('moder')) return 'medio';
  if (v.startsWith('baix')) return 'baixo';
  return null;
}

export function rotuloRisco(valor: string | null | undefined): string {
  const nivel = normalizarRisco(valor);
  return nivel ? ROTULOS_RISCO[nivel] : valor || '—';
}

// "EM_ANALISE" -> "Em análise"; "MOVIMENTACAO_ATIPICA" -> "Movimentação atípica"
const ACENTOS: Record<string, string> = {
  analise: 'análise',
  concluida: 'concluída',
  concluido: 'concluído',
  pendencia: 'pendência',
  aprovacao: 'aprovação',
  revisao: 'revisão',
  nao: 'não',
  medio: 'médio',
  media: 'média',
  critica: 'crítica',
  critico: 'crítico',
  movimentacao: 'movimentação',
  atipica: 'atípica',
  atipico: 'atípico',
  saida: 'saída',
  rapida: 'rápida',
  indicio: 'indício',
  devolucao: 'devolução',
  contestacao: 'contestação',
  transferencia: 'transferência',
  pix: 'PIX',
  med: 'MED',
  ted: 'TED',
  app: 'App',
  web: 'Web',
  pf: 'PF',
  pj: 'PJ',
  kyc: 'KYC',
  pld: 'PLD',
};

export function formatarRotulo(valor: string | null | undefined): string {
  if (!valor) return '—';
  // Valor todo em CAIXA ALTA = constante do banco (ex.: EM_ANALISE)
  const constante = valor === valor.toUpperCase();
  const texto = valor
    .replace(/_/g, ' ')
    .trim()
    .split(/\s+/)
    .map((palavra) => {
      const conhecida = ACENTOS[palavra.toLowerCase()];
      if (conhecida) return conhecida;
      return constante ? palavra.toLowerCase() : palavra;
    })
    .join(' ');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Converte os status de cada domínio para os três estados operacionais:
//   PLD/Fraude: ABERTO | EM_ANALISE | FECHADO
//   Chargeback: EM_ANALISE | ENCERRADO
//   KYC:        PENDENTE | APROVADO | REPROVADO
export function situacaoDoStatus(status: string | null | undefined): Situacao {
  const v = semAcento(status ?? '').toLowerCase();
  if (['conclu', 'encerr', 'finaliz', 'fechad', 'resolvid', 'arquivad', 'aprovad', 'reprovad'].some((t) => v.includes(t))) {
    return 'concluida';
  }
  if (v.includes('aguard') || v.includes('pend') || v.includes('abert') || v.includes('novo')) {
    return 'pendente';
  }
  if (v.includes('analise') || v.includes('tratativa') || v.includes('andamento')) {
    return 'emTratativa';
  }
  return 'pendente';
}

export function statusEncerrado(status: string | null | undefined): boolean {
  return situacaoDoStatus(status) === 'concluida';
}

// Converte datas vindas da API. "2026-09-28" (LocalDate) seria lida pelo
// navegador como meia-noite UTC — no Brasil viraria o dia anterior. Aqui a
// data sem hora é tratada como meia-noite local; LocalDateTime já vem sem fuso.
export function paraData(iso: string): Date {
  const soData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return soData ? new Date(Number(soData[1]), Number(soData[2]) - 1, Number(soData[3])) : new Date(iso);
}
