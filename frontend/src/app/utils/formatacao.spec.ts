import { formatarRotulo, normalizarRisco, paraData, rotuloRisco, situacaoDoStatus, statusEncerrado } from './formatacao';

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

  it('converte os status de cada domínio para Pendente / Em tratativa / Concluída', () => {
    expect(situacaoDoStatus('ABERTO')).toBe('pendente');
    expect(situacaoDoStatus('PENDENTE')).toBe('pendente');
    expect(situacaoDoStatus('Aguardando tratativa')).toBe('pendente');
    expect(situacaoDoStatus('EM_ANALISE')).toBe('emTratativa');
    expect(situacaoDoStatus('FECHADO')).toBe('concluida');
    expect(situacaoDoStatus('ENCERRADO')).toBe('concluida');
    expect(situacaoDoStatus('APROVADO')).toBe('concluida');
  });

  it('lê datas sem hora como dia local (sem voltar um dia no fuso do Brasil)', () => {
    const d = paraData('2026-09-28');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 8, 28, 0]);
  });

  it('formata tipologias do dicionário de dados', () => {
    expect(formatarRotulo('MOVIMENTACAO_ATIPICA')).toBe('Movimentação atípica');
    expect(formatarRotulo('MED_PIX')).toBe('MED PIX');
    expect(formatarRotulo('Verificação cadastral (KYC)')).toBe('Verificação cadastral (KYC)');
  });

  it('identifica status de ocorrência encerrada', () => {
    expect(statusEncerrado('Concluída')).toBeTrue();
    expect(statusEncerrado('ENCERRADO')).toBeTrue();
    expect(statusEncerrado('Aguardando tratativa')).toBeFalse();
    expect(statusEncerrado('EM_ANALISE')).toBeFalse();
  });
});
