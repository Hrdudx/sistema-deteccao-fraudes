import { calcularIndicadores } from './home.service';
import { Ocorrencia } from '../models/ocorrencia.model';

const ocorrencia = (parcial: Partial<Ocorrencia>): Ocorrencia => ({
  id: 'X',
  categoria: 'PLD',
  clienteId: null,
  cliente: 'Cliente',
  documento: null,
  tipo: 'MOVIMENTACAO_ATIPICA',
  valor: 100,
  risco: 'ALTA',
  status: 'ABERTO',
  data: null,
  dataEncerramento: null,
  score: null,
  analista: null,
  resultado: null,
  observacao: null,
  ...parcial,
});

describe('calcularIndicadores', () => {
  const agora = new Date(2026, 8, 28, 15, 0);
  const hoje = '2026-09-28T09:00:00';
  const inicioDoMes = '2026-09-03T09:00:00';
  const mesPassado = '2026-08-20T09:00:00';

  it('monta os cards e gráficos com os status do dicionário de dados', () => {
    const r = calcularIndicadores(
      [
        ocorrencia({ id: '1', risco: 'CRITICA', categoria: 'Fraude', data: hoje }),
        ocorrencia({ id: '2', risco: 'ALTA', status: 'EM_ANALISE', data: inicioDoMes }),
        ocorrencia({ id: '3', risco: 'BAIXO', categoria: 'KYC', status: 'PENDENTE', data: hoje }),
        ocorrencia({ id: '4', categoria: 'Chargeback', risco: null, status: 'ENCERRADO', data: inicioDoMes, dataEncerramento: '2026-09-28' }),
        ocorrencia({ id: '5', status: 'FECHADO', data: mesPassado, dataEncerramento: '2026-08-25' }),
      ],
      120,
      'mes',
      agora,
    );

    expect(r.clientesCadastrados).toBe(120);
    expect(r.ocorrenciasAbertas).toBe(3);
    expect(r.tratativasEmAndamento).toBe(1);
    expect(r.tratativasConcluidasPeriodo).toBe(1);
    expect(r.riscosIdentificadosPeriodo).toBe(2);
    expect(r.ocorrenciasPorTipo).toEqual({ PLD: 1, Chargeback: 1, KYC: 1, Fraude: 1 });
    expect(r.ocorrenciasPorStatus).toEqual({ pendente: 2, emTratativa: 1, concluida: 1 });
    expect(r.ocorrenciasPorPrioridade).toEqual({ critica: 1, alta: 1, media: 0, baixa: 1, semClassificacao: 1 });
    expect(r.resumoDoDia.novasOcorrencias).toBe(2);
    expect(r.resumoDoDia.tratativasConcluidas).toBe(1);
  });

  it('não inventa SLA quando a base não informa prazos', () => {
    const r = calcularIndicadores([ocorrencia({ data: hoje })], 1, 'mes', agora);
    expect(r.sla).toBeNull();
    expect(r.slaPorTipo).toBeNull();
    expect(r.resumoDoDia.slaVencidos).toBeNull();
  });

  it('classifica o SLA em dentro do prazo, atenção e vencido', () => {
    const r = calcularIndicadores(
      [
        ocorrencia({ id: 'ok', data: hoje, prazoSla: '2026-10-05T09:00:00' }),
        ocorrencia({ id: 'atencao', data: hoje, prazoSla: '2026-09-28T20:00:00' }),
        ocorrencia({ id: 'vencida', data: inicioDoMes, prazoSla: '2026-09-10T09:00:00' }),
        ocorrencia({ id: 'fechada-no-prazo', status: 'FECHADO', data: inicioDoMes, prazoSla: '2026-09-06T09:00:00', dataEncerramento: '2026-09-05' }),
      ],
      1,
      'mes',
      agora,
    );
    expect(r.sla).toEqual({ dentroPrazo: 2, atencao: 1, vencidas: 1 });
    expect(r.resumoDoDia.slaVencendoHoje).toBe(1);
    expect(r.resumoDoDia.slaVencidos).toBe(1);
  });
});
