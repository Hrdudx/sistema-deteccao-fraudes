import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CATEGORIAS_OCORRENCIA, CategoriaOcorrencia, Ocorrencia } from '../../models/ocorrencia.model';
import { TransacaoApi } from '../../models/backend.model';
import { PeriodoHome } from '../../models/indicadores-home.model';
import { OcorrenciasService } from '../../services/ocorrencias.service';
import { TransacoesService, transacaoSuspeita } from '../../services/transacoes.service';
import { inicioDoPeriodo } from '../../services/home.service';
import { CabecalhoPaginaComponent } from '../../components/cabecalho-pagina/cabecalho-pagina.component';
import { EstadoListaComponent } from '../../components/estado-lista/estado-lista.component';
import { formatarRotulo, normalizarRisco, paraData, situacaoDoStatus } from '../../utils/formatacao';

interface LinhaTipo {
  tipo: CategoriaOcorrencia;
  registradas: number;
  pendentes: number;
  emTratativa: number;
  concluidas: number;
  altoCritico: number;
  valor: number;
  tempoMedioDias: number | null;
}

interface LinhaResultado {
  tipo: CategoriaOcorrencia;
  resultado: string;
  quantidade: number;
  percentual: number;
}

interface LinhaAnalista {
  analista: string;
  emTratativa: number;
  concluidas: number;
  total: number;
}

interface LinhaCliente {
  clienteId: string | null;
  cliente: string;
  ocorrencias: number;
  altoCritico: number;
  valor: number;
}

const ROTULO_PERIODO: Record<PeriodoHome, string> = {
  mes: 'Este mês',
  '30': 'Últimos 30 dias',
  '90': 'Últimos 90 dias',
  todos: 'Todo o período',
};

// Relatórios gerenciais (DMS 9.1 — item Relatórios do menu). Sem virar um módulo
// de BI (fora do escopo no DRE 2.4): são as consultas consolidadas que o gestor
// precisa acompanhar, com exportação em CSV e impressão.
@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CabecalhoPaginaComponent, EstadoListaComponent],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css',
})
export class RelatoriosComponent implements OnInit {
  readonly periodos = Object.entries(ROTULO_PERIODO) as [PeriodoHome, string][];

  periodo: PeriodoHome = 'mes';
  ocorrencias: Ocorrencia[] = [];
  transacoes: TransacaoApi[] = [];
  carregando = true;
  erro: string | null = null;
  demonstracao = false;
  geradoEm = new Date();

  // Resultados montados a cada mudança de período
  porTipo: LinhaTipo[] = [];
  resultados: LinhaResultado[] = [];
  analistas: LinhaAnalista[] = [];
  clientes: LinhaCliente[] = [];
  movimentacoes = { total: 0, volume: 0, suspeitas: 0, negadas: 0, emAnalise: 0 };

  constructor(
    private ocorrenciasService: OcorrenciasService,
    private transacoesService: TransacoesService,
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = null;
    forkJoin([this.ocorrenciasService.listar(), this.transacoesService.listar()]).subscribe({
      next: ([o, t]) => {
        this.ocorrencias = o.dados;
        this.transacoes = t.dados;
        this.demonstracao = o.demonstracao || t.demonstracao;
        this.montar();
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível gerar os relatórios.';
        this.carregando = false;
      },
    });
  }

  get rotuloPeriodo(): string {
    return ROTULO_PERIODO[this.periodo];
  }

  get totais(): LinhaTipo {
    const soma = (campo: keyof LinhaTipo) => this.porTipo.reduce((s, l) => s + ((l[campo] as number) ?? 0), 0);
    const tempos = this.porTipo.filter((l) => l.tempoMedioDias !== null);
    return {
      tipo: 'PLD',
      registradas: soma('registradas'),
      pendentes: soma('pendentes'),
      emTratativa: soma('emTratativa'),
      concluidas: soma('concluidas'),
      altoCritico: soma('altoCritico'),
      valor: soma('valor'),
      tempoMedioDias: tempos.length ? tempos.reduce((s, l) => s + (l.tempoMedioDias ?? 0), 0) / tempos.length : null,
    };
  }

  montar(): void {
    this.geradoEm = new Date();
    const inicio = inicioDoPeriodo(this.periodo);
    const noPeriodo = (iso: string | null | undefined) => !inicio || (!!iso && paraData(iso) >= inicio);
    const lista = this.ocorrencias.filter((o) => noPeriodo(o.data));
    const altoOuCritico = (o: Ocorrencia) => ['alto', 'critico'].includes(normalizarRisco(o.risco) ?? '');

    this.porTipo = CATEGORIAS_OCORRENCIA.map((tipo) => {
      const doTipo = lista.filter((o) => o.categoria === tipo);
      const concluidas = doTipo.filter((o) => situacaoDoStatus(o.status) === 'concluida');
      const tempos = concluidas
        .filter((o) => o.data && o.dataEncerramento)
        .map((o) => (paraData(o.dataEncerramento!).getTime() - paraData(o.data!).getTime()) / 86400000)
        .filter((d) => d >= 0);
      return {
        tipo,
        registradas: doTipo.length,
        pendentes: doTipo.filter((o) => situacaoDoStatus(o.status) === 'pendente').length,
        emTratativa: doTipo.filter((o) => situacaoDoStatus(o.status) === 'emTratativa').length,
        concluidas: concluidas.length,
        altoCritico: doTipo.filter(altoOuCritico).length,
        valor: doTipo.reduce((s, o) => s + (o.valor ?? 0), 0),
        // KYC não tem data de encerramento própria (a decisão é a data da análise).
        tempoMedioDias: tipo !== 'KYC' && tempos.length ? tempos.reduce((s, d) => s + d, 0) / tempos.length : null,
      };
    });

    // Resultado das análises concluídas (valores do dicionário de dados).
    // KYC não tem campo "resultado": a decisão é o próprio status (APROVADO/REPROVADO).
    this.resultados = CATEGORIAS_OCORRENCIA.flatMap((tipo) => {
      const concluidas = lista.filter((o) => o.categoria === tipo && situacaoDoStatus(o.status) === 'concluida');
      const contagem = new Map<string, number>();
      for (const o of concluidas) {
        const chave = formatarRotulo(tipo === 'KYC' ? o.status : o.resultado ?? 'Sem resultado');
        contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
      }
      return [...contagem.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([resultado, quantidade]) => ({
          tipo,
          resultado,
          quantidade,
          percentual: Math.round((quantidade / concluidas.length) * 100),
        }));
    });

    const porAnalista = new Map<string, LinhaAnalista>();
    for (const o of lista) {
      if (!o.analista) continue;
      const linha = porAnalista.get(o.analista) ?? { analista: o.analista, emTratativa: 0, concluidas: 0, total: 0 };
      const situacao = situacaoDoStatus(o.status);
      if (situacao === 'emTratativa') linha.emTratativa++;
      if (situacao === 'concluida') linha.concluidas++;
      linha.total++;
      porAnalista.set(o.analista, linha);
    }
    this.analistas = [...porAnalista.values()].sort((a, b) => b.total - a.total);

    const porCliente = new Map<string, LinhaCliente>();
    for (const o of lista) {
      const chave = o.clienteId ?? o.cliente;
      const linha = porCliente.get(chave) ?? { clienteId: o.clienteId, cliente: o.cliente, ocorrencias: 0, altoCritico: 0, valor: 0 };
      linha.ocorrencias++;
      if (altoOuCritico(o)) linha.altoCritico++;
      linha.valor += o.valor ?? 0;
      porCliente.set(chave, linha);
    }
    this.clientes = [...porCliente.values()]
      .sort((a, b) => b.ocorrencias - a.ocorrencias || b.altoCritico - a.altoCritico || b.valor - a.valor)
      .slice(0, 10);

    const trx = this.transacoes.filter((t) => noPeriodo(t.dataHoraTransacao));
    this.movimentacoes = {
      total: trx.length,
      volume: trx.reduce((s, t) => s + (t.valor ?? 0), 0),
      suspeitas: trx.filter(transacaoSuspeita).length,
      negadas: trx.filter((t) => (t.statusTransacao ?? '').toUpperCase() === 'NEGADA').length,
      emAnalise: trx.filter((t) => (t.statusTransacao ?? '').toUpperCase() === 'EM_ANALISE').length,
    };
  }

  percentual(parte: number, total: number): number {
    return total ? Math.round((parte / total) * 100) : 0;
  }

  imprimir(): void {
    window.print();
  }

  // CSV com ";" e BOM para abrir corretamente no Excel em português.
  exportarCsv(): void {
    const moeda = (v: number) => v.toFixed(2).replace('.', ',');
    const linhas: (string | number)[][] = [
      ['Relatório — Sistema de Detecção de Fraudes', this.rotuloPeriodo, `Gerado em ${this.geradoEm.toLocaleString('pt-BR')}`],
      [],
      ['Resumo por tipo de ocorrência'],
      ['Tipo', 'Registradas', 'Pendentes', 'Em tratativa', 'Concluídas', 'Risco alto/crítico', 'Valor envolvido (R$)', 'Tempo médio de conclusão (dias)'],
      ...this.porTipo.map((l) => [
        l.tipo,
        l.registradas,
        l.pendentes,
        l.emTratativa,
        l.concluidas,
        l.altoCritico,
        moeda(l.valor),
        l.tempoMedioDias === null ? '' : l.tempoMedioDias.toFixed(1).replace('.', ','),
      ]),
      [],
      ['Resultado das análises concluídas'],
      ['Tipo', 'Resultado', 'Quantidade', '%'],
      ...this.resultados.map((r) => [r.tipo, r.resultado, r.quantidade, r.percentual]),
      [],
      ['Ocorrências por responsável'],
      ['Responsável', 'Em tratativa', 'Concluídas', 'Total'],
      ...this.analistas.map((a) => [a.analista, a.emTratativa, a.concluidas, a.total]),
      [],
      ['Clientes com mais ocorrências'],
      ['Cliente', 'Ocorrências', 'Risco alto/crítico', 'Valor envolvido (R$)'],
      ...this.clientes.map((c) => [c.cliente, c.ocorrencias, c.altoCritico, moeda(c.valor)]),
      [],
      ['Movimentações'],
      ['Transações', 'Volume (R$)', 'Com sinal de risco', 'Em análise', 'Negadas'],
      [this.movimentacoes.total, moeda(this.movimentacoes.volume), this.movimentacoes.suspeitas, this.movimentacoes.emAnalise, this.movimentacoes.negadas],
    ];
    const csv = linhas
      .map((l) => l.map((c) => (/[;"\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : String(c))).join(';'))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-deteccao-fraudes-${this.periodo}-${this.geradoEm.toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
