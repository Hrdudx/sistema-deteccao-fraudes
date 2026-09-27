import { calcularIndicadores } from './home.service';
import { Ocorrencia } from '../models/ocorrencia.model';

const ocorrencia = (parcial: Partial<Ocorrencia>): Ocorrencia => ({
  id: 'X',
  categoria: 'PLD',
  clienteId: null,
  cliente: 'Cliente',
  documento: null,
  tipo: 'Tipo',
  valor: 100,
  risco: 'Alto',
  status: 'Aguardando tratativa',
  data: null,
  dataEncerramento: null,
  score: null,
  analista: null,
  resultado: null,
  observacao: null,
  ...parcial,
});

describe('calcularIndicadores', () => {
  const agora = new Date(2026, 8, 27, 15, 0);
  const hoje = new Date(2026, 8, 27, 9, 0).toISOString();
  const inicioDoMes = new Date(2026, 8, 3, 9, 0).toISOString();

  it('conta as ocorrências abertas por risco e por tipo', () => {
    const r = calcularIndicadores(
      [
        ocorrencia({ id: '1', risco: 'CRITICA', categoria: 'Fraude', data: hoje }),
        ocorrencia({ id: '2', risco: 'ALTA', categoria: 'PLD', data: inicioDoMes }),
        ocorrencia({ id: '3', risco: 'Baixa', categoria: 'KYC', data: hoje }),
        ocorrencia({ id: '4', status: 'Concluída', dataEncerramento: hoje }),
      ],
      agora,
    );

    expect(r.ocorrenciasAbertas).toBe(3);
    expect(r.ocorrenciasCriticas).toBe(1);
    expect(r.ocorrenciasAltas).toBe(1);
    expect(r.tratativasConcluidasHoje).toBe(1);
    expect(r.ocorrenciasPorTipo).toEqual({ PLD: 1, Chargeback: 0, KYC: 1, Fraude: 1 });
    expect(r.slaPercentualDentroPrazo).toBeNull();
  });

  it('ordena os resumos pela prioridade e separa mês e dia', () => {
    const r = calcularIndicadores(
      [
        ocorrencia({ id: 'baixo', risco: 'Baixo', data: hoje }),
        ocorrencia({ id: 'critico', risco: 'Crítico', data: hoje }),
        ocorrencia({ id: 'mes', risco: 'Médio', data: inicioDoMes }),
      ],
      agora,
    );

    expect(r.resumoDoDia.map((i) => i.id)).toEqual(['critico', 'baixo']);
    expect(r.resumoDoMes.map((i) => i.id)).toEqual(['critico', 'mes', 'baixo']);
    expect(r.resumoDoDia[0].prioridade).toBe('Critica');
  });
});
