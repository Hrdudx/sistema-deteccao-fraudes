import { formatarRotulo, normalizarRisco, rotuloRisco, statusEncerrado } from './formatacao';

describe('formatacao', () => {
  it('normaliza os formatos de risco vindos do backend', () => {
    expect(normalizarRisco('ALTA')).toBe('alto');
    expect(normalizarRisco('Médio')).toBe('medio');
    expect(normalizarRisco('media')).toBe('medio');
    expect(normalizarRisco('CRITICA')).toBe('critico');
    expect(normalizarRisco('baixo')).toBe('baixo');
    expect(normalizarRisco(null)).toBeNull();
  });

  it('exibe rótulos padronizados e com acento', () => {
    expect(rotuloRisco('ALTA')).toBe('Alto');
    expect(rotuloRisco(null)).toBe('—');
    expect(formatarRotulo('EM_ANALISE')).toBe('Em análise');
    expect(formatarRotulo('Media')).toBe('Média');
    expect(formatarRotulo('Critica')).toBe('Crítica');
  });

  it('identifica status de ocorrência encerrada', () => {
    expect(statusEncerrado('Concluída')).toBeTrue();
    expect(statusEncerrado('ENCERRADO')).toBeTrue();
    expect(statusEncerrado('Aguardando tratativa')).toBeFalse();
    expect(statusEncerrado('EM_ANALISE')).toBeFalse();
  });
});
