import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TransacaoApi } from '../../../models/backend.model';
import { SCORE_TRANSACAO_SUSPEITA, TransacoesService, sinaisDeRisco, transacaoSuspeita } from '../../../services/transacoes.service';
import { EstadoListaComponent } from '../../../components/estado-lista/estado-lista.component';
import { formatarRotulo, paraData, semAcento } from '../../../utils/formatacao';

export type VisaoTransacoes = 'movimentacoes' | 'transacional';

const ITENS_POR_PAGINA = 15;

// Visões "Movimentações" e "Transacional" da tela de Ocorrências.
//  - Movimentações: todas as transações (fato_transacao).
//  - Transacional: somente as que têm sinal de risco (score alto, fora do perfil,
//    em análise ou negada), ordenadas pelo score.
@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EstadoListaComponent],
  templateUrl: './transacoes.component.html',
  styleUrl: './transacoes.component.css',
})
export class TransacoesComponent implements OnInit, OnChanges {
  @Input({ required: true }) visao: VisaoTransacoes = 'movimentacoes';

  readonly limiteScore = SCORE_TRANSACAO_SUSPEITA;
  readonly tipos = ['PIX', 'TED', 'BOLETO', 'TRANSFERENCIA_INTERNA'];
  readonly statusPossiveis = ['APROVADA', 'EM_ANALISE', 'NEGADA'];

  todas: TransacaoApi[] = [];
  carregando = true;
  erro: string | null = null;
  demonstracao = false;

  busca = '';
  tipo = '';
  status = '';
  periodo: 'hoje' | '7' | '30' | 'todos' = 'todos';
  pagina = 1;
  selecionada: TransacaoApi | null = null;

  constructor(private service: TransacoesService) {}

  ngOnInit(): void {
    this.carregar();
  }

  ngOnChanges(): void {
    this.pagina = 1;
    this.selecionada = null;
  }

  carregar(): void {
    this.carregando = true;
    this.erro = null;
    this.service.listar().subscribe({
      next: (r) => {
        this.todas = r.dados;
        this.demonstracao = r.demonstracao;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as transações.';
        this.carregando = false;
      },
    });
  }

  get filtradas(): TransacaoApi[] {
    const termo = semAcento(this.busca.trim()).toLowerCase();
    const limite = this.inicioPeriodo();
    const lista = this.todas
      .filter((t) => this.visao === 'movimentacoes' || transacaoSuspeita(t))
      .filter((t) => !this.tipo || t.tipoTransacao === this.tipo)
      .filter((t) => !this.status || t.statusTransacao === this.status)
      .filter((t) => !limite || (!!t.dataHoraTransacao && paraData(t.dataHoraTransacao) >= limite))
      .filter(
        (t) =>
          !termo ||
          semAcento(
            [t.idTransacao, t.clienteOrigem?.nomeRazaoSocial ?? '', t.clienteOrigem?.documentoFicticio ?? '', t.nomeContraparte ?? ''].join(' '),
          )
            .toLowerCase()
            .includes(termo),
      );
    return this.visao === 'transacional'
      ? lista.sort((a, b) => (b.scoreTransacao ?? 0) - (a.scoreTransacao ?? 0) || (b.dataHoraTransacao ?? '').localeCompare(a.dataHoraTransacao ?? ''))
      : lista.sort((a, b) => (b.dataHoraTransacao ?? '').localeCompare(a.dataHoraTransacao ?? ''));
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.filtradas.length / ITENS_POR_PAGINA));
  }

  get paginaAtual(): TransacaoApi[] {
    const inicio = (Math.min(this.pagina, this.totalPaginas) - 1) * ITENS_POR_PAGINA;
    return this.filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);
  }

  get volumeFiltrado(): number {
    return this.filtradas.reduce((soma, t) => soma + (t.valor ?? 0), 0);
  }

  get filtrosAtivos(): boolean {
    return !!this.busca || !!this.tipo || !!this.status || this.periodo !== 'todos';
  }

  aoFiltrar(): void {
    this.pagina = 1;
    this.selecionada = null;
  }

  limparFiltros(): void {
    this.busca = '';
    this.tipo = '';
    this.status = '';
    this.periodo = 'todos';
    this.aoFiltrar();
  }

  selecionar(t: TransacaoApi): void {
    this.selecionada = this.selecionada?.idTransacao === t.idTransacao ? null : t;
  }

  sinais(t: TransacaoApi): string[] {
    return sinaisDeRisco(t);
  }

  rotulo(valor: string | null | undefined): string {
    return formatarRotulo(valor);
  }

  classeScore(score: number | null | undefined): string {
    const s = score ?? 0;
    return s >= 80 ? 'badge-critico' : s >= SCORE_TRANSACAO_SUSPEITA ? 'badge-alto' : s >= 40 ? 'badge-medio' : 'badge-baixo';
  }

  classeStatus(status: string | null | undefined): string {
    const s = (status ?? '').toUpperCase();
    return s === 'NEGADA' ? 'badge-critico' : s === 'EM_ANALISE' ? 'badge-medio' : 'badge-baixo';
  }

  private inicioPeriodo(): Date | null {
    if (this.periodo === 'todos') return null;
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    if (this.periodo !== 'hoje') inicio.setDate(inicio.getDate() - Number(this.periodo));
    return inicio;
  }
}
