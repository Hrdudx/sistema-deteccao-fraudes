import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { IndicadoresHome, PeriodoHome, SlaPorTipo } from '../../models/indicadores-home.model';
import { CATEGORIAS_OCORRENCIA, CategoriaOcorrencia } from '../../models/ocorrencia.model';
import { CabecalhoPaginaComponent } from '../../components/cabecalho-pagina/cabecalho-pagina.component';
import { EstadoListaComponent } from '../../components/estado-lista/estado-lista.component';
import { FatiaGrafico, GraficoRoscaComponent } from '../../components/grafico-rosca/grafico-rosca.component';
import { MedidorSlaComponent } from '../../components/medidor-sla/medidor-sla.component';
import { IconeComponent } from '../../components/icone/icone.component';

// Cores por entidade (validadas para daltonismo). A cor acompanha a categoria em
// todos os gráficos e na tabela de SLA — nunca a posição no ranking.
export const COR_CATEGORIA: Record<CategoriaOcorrencia, string> = {
  PLD: 'var(--serie-pld)',
  Chargeback: 'var(--serie-chargeback)',
  KYC: 'var(--serie-kyc)',
  Fraude: 'var(--serie-fraude)',
};

const ICONE_CATEGORIA: Record<CategoriaOcorrencia, string> = {
  PLD: 'documento',
  Chargeback: 'documento',
  KYC: 'documento',
  Fraude: 'fraude',
};

const ROTULO_PERIODO: Record<PeriodoHome, string> = {
  mes: 'Este mês',
  '30': 'Últimos 30 dias',
  '90': 'Últimos 90 dias',
  todos: 'Todo o período',
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CabecalhoPaginaComponent,
    EstadoListaComponent,
    GraficoRoscaComponent,
    MedidorSlaComponent,
    IconeComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  readonly periodos = Object.entries(ROTULO_PERIODO) as [PeriodoHome, string][];
  readonly corCategoria = COR_CATEGORIA;

  periodo: PeriodoHome = 'mes';
  indicadores: IndicadoresHome | null = null;
  demonstracao = false;
  carregando = true;
  erro: string | null = null;
  atualizadoEm: Date | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.carregarIndicadores();
  }

  carregarIndicadores(): void {
    this.carregando = true;
    this.erro = null;

    this.homeService.obterIndicadores(this.periodo).subscribe({
      next: (resultado) => {
        this.indicadores = resultado.dados;
        this.demonstracao = resultado.demonstracao;
        this.atualizadoEm = new Date();
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Não foi possível carregar os indicadores da operação.';
        this.carregando = false;
        console.error(err);
      },
    });
  }

  get rotuloPeriodo(): string {
    return this.periodo === 'mes' ? 'mês' : ROTULO_PERIODO[this.periodo].toLowerCase();
  }

  get tituloResumo(): string {
    return this.periodo === 'mes' ? 'Resumo do mês' : `Resumo do período — ${ROTULO_PERIODO[this.periodo].toLowerCase()}`;
  }

  fatiasTipo(d: IndicadoresHome): FatiaGrafico[] {
    return CATEGORIAS_OCORRENCIA.map((tipo) => ({ rotulo: tipo, valor: d.ocorrenciasPorTipo[tipo], cor: COR_CATEGORIA[tipo] }));
  }

  fatiasStatus(d: IndicadoresHome): FatiaGrafico[] {
    return [
      { rotulo: 'Pendentes', valor: d.ocorrenciasPorStatus.pendente, cor: 'var(--situacao-pendente)' },
      { rotulo: 'Em tratativa', valor: d.ocorrenciasPorStatus.emTratativa, cor: 'var(--situacao-tratativa)' },
      { rotulo: 'Concluídas', valor: d.ocorrenciasPorStatus.concluida, cor: 'var(--situacao-concluida)' },
    ];
  }

  fatiasPrioridade(d: IndicadoresHome): FatiaGrafico[] {
    const p = d.ocorrenciasPorPrioridade;
    const fatias: FatiaGrafico[] = [
      { rotulo: 'Crítica', valor: p.critica, cor: 'var(--prioridade-critica)' },
      { rotulo: 'Alta', valor: p.alta, cor: 'var(--prioridade-alta)' },
      { rotulo: 'Média', valor: p.media, cor: 'var(--prioridade-media)' },
      { rotulo: 'Baixa', valor: p.baixa, cor: 'var(--prioridade-baixa)' },
    ];
    // Chargeback não tem severidade no dicionário de dados: aparece à parte.
    if (p.semClassificacao) fatias.push({ rotulo: 'Sem classificação', valor: p.semClassificacao, cor: 'var(--cor-borda)' });
    return fatias;
  }

  // Linhas da tabela "SLA por tipo de ocorrência"
  linhasSla(d: IndicadoresHome): { tipo: CategoriaOcorrencia; cor: string; icone: string; total: number; sla: SlaPorTipo | null }[] {
    return CATEGORIAS_OCORRENCIA.map((tipo) => ({
      tipo,
      cor: COR_CATEGORIA[tipo],
      icone: ICONE_CATEGORIA[tipo],
      total: d.ocorrenciasPorTipo[tipo],
      sla: d.slaPorTipo?.find((s) => s.tipo === tipo) ?? null,
    }));
  }

  percentual(parte: number, total: number): number {
    return total ? Math.round((parte / total) * 100) : 0;
  }

  rotaCategoria(tipo: CategoriaOcorrencia): string {
    return `/ocorrencias/${tipo.toLowerCase()}`;
  }
}
