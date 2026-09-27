// Funções de apoio para exibir, de forma padronizada, os textos que chegam do
// backend/Databricks em formatos variados ("ALTA", "alto", "EM_ANALISE"...).

export type NivelRisco = 'critico' | 'alto' | 'medio' | 'baixo';

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

// "EM_ANALISE" -> "Em análise"; "aguardando tratativa" -> "Aguardando tratativa"
const ACENTOS: Record<string, string> = {
  analise: 'análise',
  concluida: 'concluída',
  concluido: 'concluído',
  improcedente: 'improcedente',
  pendencia: 'pendência',
  aprovacao: 'aprovação',
  revisao: 'revisão',
  nao: 'não',
  medio: 'médio',
  critica: 'crítica',
  critico: 'crítico',
  media: 'média',
};

export function formatarRotulo(valor: string | null | undefined): string {
  if (!valor) return '—';
  const palavras = valor.replace(/_/g, ' ').trim().toLowerCase().split(/\s+/);
  const texto = palavras.map((p) => ACENTOS[p] ?? p).join(' ');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Considera encerrada qualquer ocorrência com status de finalização.
export function statusEncerrado(status: string | null | undefined): boolean {
  if (!status) return false;
  const v = semAcento(status).toLowerCase();
  return ['conclu', 'encerr', 'finaliz', 'fechad', 'resolvid', 'arquivad', 'aprovad', 'reprovad'].some((t) =>
    v.includes(t),
  );
}
