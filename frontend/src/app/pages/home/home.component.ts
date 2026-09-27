import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { IndicadoresHome, ResumoOcorrencia } from '../../models/indicadores-home.model';
import { CabecalhoPaginaComponent } from '../../components/cabecalho-pagina/cabecalho-pagina.component';
import { BadgeRiscoComponent } from '../../components/badge-risco/badge-risco.component';
import { EstadoListaComponent } from '../../components/estado-lista/estado-lista.component';
import { formatarRotulo } from '../../utils/formatacao';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CabecalhoPaginaComponent, BadgeRiscoComponent, EstadoListaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
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

    this.homeService.obterIndicadores().subscribe({
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

  // Ajuda o template a iterar sobre "ocorrenciasPorTipo" sem lógica extra no HTML.
  // Inclui o percentual para desenhar a barra proporcional de cada tipo.
  get tiposDeOcorrencia(): { tipo: string; total: number; percentual: number; rota: string }[] {
    if (!this.indicadores) return [];
    const tipos = Object.entries(this.indicadores.ocorrenciasPorTipo);
    const maior = Math.max(1, ...tipos.map(([, total]) => total));
    return tipos.map(([tipo, total]) => ({
      tipo,
      total,
      percentual: Math.round((total / maior) * 100),
      rota: `/ocorrencias/${tipo.toLowerCase()}`,
    }));
  }

  rotuloPrioridade(item: ResumoOcorrencia): string {
    return formatarRotulo(item.prioridade);
  }

  rotaOcorrencia(item: ResumoOcorrencia): string {
    return `/ocorrencias/${item.ocorrencia.toLowerCase()}`;
  }
}
