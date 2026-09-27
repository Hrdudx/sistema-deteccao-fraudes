import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CATEGORIAS_OCORRENCIA, CategoriaOcorrencia, Ocorrencia } from '../../models/ocorrencia.model';
import { OcorrenciasService } from '../../services/ocorrencias.service';
import { CabecalhoPaginaComponent } from '../../components/cabecalho-pagina/cabecalho-pagina.component';
import { BadgeRiscoComponent } from '../../components/badge-risco/badge-risco.component';
import { EstadoListaComponent } from '../../components/estado-lista/estado-lista.component';
import {
  NivelRisco,
  PESO_RISCO,
  ROTULOS_SITUACAO,
  Situacao,
  formatarRotulo,
  normalizarRisco,
  paraData,
  semAcento,
  situacaoDoStatus,
} from '../../utils/formatacao';

// Estados do DRE (RF18/RN10) + atalhos "Em aberto" (pendente + em tratativa) e "Todas".
type FiltroSituacao = 'abertas' | Situacao | 'todas';
type FiltroPeriodo = 'hoje' | '7' | '30' | 'todos';

const ITENS_POR_PAGINA = 15;

// Tela central de consulta (MVP do projeto — Scrum, seção 8.3): fila única com as
// ocorrências de todas as categorias, com busca, filtros, paginação e detalhe.
// As rotas /ocorrencias/pld, /chargeback e /kyc abrem esta mesma tela já filtrada.
@Component({
  selector: 'app-ocorrencias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    CabecalhoPaginaComponent,
    BadgeRiscoComponent,
    EstadoListaComponent,
  ],
  templateUrl: './ocorrencias.component.html',
  styleUrl: './ocorrencias.component.css',
})
export class OcorrenciasComponent implements OnInit {
  readonly categorias = CATEGORIAS_OCORRENCIA;
  readonly niveis: NivelRisco[] = ['critico', 'alto', 'medio', 'baixo'];
  readonly rotulosNivel: Record<NivelRisco, string> = { critico: 'Crítico', alto: 'Alto', medio: 'Médio', baixo: 'Baixo' };
  readonly situacoes = Object.entries(ROTULOS_SITUACAO) as [Situacao, string][];

  categoria: CategoriaOcorrencia | null = null;

  todas: Ocorrencia[] = [];
  carregando = true;
  erro: string | null = null;
  demonstracao = false;

  // Filtros
  busca = '';
  risco: NivelRisco | 'altoOuCritico' | '' = '';
  situacao: FiltroSituacao = 'abertas';
  periodo: FiltroPeriodo = 'todos';

  pagina = 1;
  selecionada: Ocorrencia | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: OcorrenciasService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((dados) => {
      this.categoria = (dados['categoria'] as CategoriaOcorrencia | undefined) ?? null;
      this.selecionada = null;
      this.pagina = 1;
    });
    // Filtros vindos dos cards da Home (ex.: ?situacao=emTratativa, ?risco=alto)
    this.route.queryParamMap.subscribe((params) => {
      const situacao = params.get('situacao') as FiltroSituacao | null;
      if (situacao && ['abertas', 'pendente', 'emTratativa', 'concluida', 'todas'].includes(situacao)) this.situacao = situacao;
      const risco = params.get('risco');
      if (risco === 'altoOuCritico' || this.niveis.includes(risco as NivelRisco)) this.risco = risco as NivelRisco | 'altoOuCritico';
    });
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = null;
    this.service.listar().subscribe({
      next: (resultado) => {
        this.todas = resultado.dados;
        this.demonstracao = resultado.demonstracao;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as ocorrências.';
        this.carregando = false;
      },
    });
  }

  get titulo(): string {
    return this.categoria ? `Ocorrências ${this.categoria}` : 'Ocorrências';
  }

  get subtitulo(): string {
    return this.categoria
      ? `Fila de alertas de ${this.categoria} aguardando análise`
      : 'Fila de alertas e ocorrências aguardando análise';
  }

  // Totais em aberto por categoria, exibidos nas abas.
  totalAbertas(categoria: CategoriaOcorrencia | null): number {
    return this.todas.filter((o) => (!categoria || o.categoria === categoria) && situacaoDoStatus(o.status) !== 'concluida')
      .length;
  }

  get filtradas(): Ocorrencia[] {
    const termo = semAcento(this.busca.trim()).toLowerCase();
    const limite = this.inicioPeriodo();

    return this.todas
      .filter((o) => !this.categoria || o.categoria === this.categoria)
      .filter((o) => {
        if (this.situacao === 'todas') return true;
        const situacao = situacaoDoStatus(o.status);
        return this.situacao === 'abertas' ? situacao !== 'concluida' : situacao === this.situacao;
      })
      .filter((o) => {
        if (!this.risco) return true;
        const nivel = normalizarRisco(o.risco);
        // "Alto ou crítico" = atalho "Riscos identificados" da Home
        return this.risco === 'altoOuCritico' ? nivel === 'alto' || nivel === 'critico' : nivel === this.risco;
      })
      .filter((o) => !limite || (!!o.data && paraData(o.data) >= limite))
      .filter((o) => {
        if (!termo) return true;
        const alvo = semAcento([o.id, o.cliente, o.documento ?? '', o.tipo].join(' ')).toLowerCase();
        // Busca por documento também sem pontuação (ex.: digitar só os números do CPF)
        const digitos = termo.replace(/\D/g, '');
        return alvo.includes(termo) || (digitos.length >= 3 && alvo.replace(/\D/g, '').includes(digitos));
      })
      .sort((a, b) => this.peso(b) - this.peso(a) || (b.data ?? '').localeCompare(a.data ?? ''));
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.filtradas.length / ITENS_POR_PAGINA));
  }

  get paginaAtual(): Ocorrencia[] {
    const inicio = (Math.min(this.pagina, this.totalPaginas) - 1) * ITENS_POR_PAGINA;
    return this.filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);
  }

  get filtrosAtivos(): boolean {
    return !!this.busca || !!this.risco || this.situacao !== 'abertas' || this.periodo !== 'todos';
  }

  aoFiltrar(): void {
    this.pagina = 1;
    this.selecionada = null;
  }

  limparFiltros(): void {
    this.busca = '';
    this.risco = '';
    this.situacao = 'abertas';
    this.periodo = 'todos';
    this.aoFiltrar();
  }

  irParaPagina(pagina: number): void {
    this.pagina = Math.min(Math.max(1, pagina), this.totalPaginas);
    this.selecionada = null;
  }

  selecionar(ocorrencia: Ocorrencia): void {
    this.selecionada = this.selecionada?.id === ocorrencia.id ? null : ocorrencia;
  }

  rotulo(valor: string | null): string {
    return formatarRotulo(valor);
  }

  rotaCategoria(categoria: CategoriaOcorrencia): string {
    return `/ocorrencias/${categoria.toLowerCase()}`;
  }

  encerrada(o: Ocorrencia): boolean {
    return situacaoDoStatus(o.status) === 'concluida';
  }

  situacaoDe(o: Ocorrencia): string {
    return ROTULOS_SITUACAO[situacaoDoStatus(o.status)];
  }

  private peso(o: Ocorrencia): number {
    const n = normalizarRisco(o.risco);
    return n ? PESO_RISCO[n] : 0;
  }

  private inicioPeriodo(): Date | null {
    if (this.periodo === 'todos') return null;
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    if (this.periodo !== 'hoje') inicio.setDate(inicio.getDate() - Number(this.periodo));
    return inicio;
  }
}
