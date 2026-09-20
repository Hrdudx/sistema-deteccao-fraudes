import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/HomeService';
import { IndicadoresHome } from '../../models/indicadores-home.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  indicadores: IndicadoresHome | null = null;
  carregando = true;
  erro: string | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.carregarIndicadores();
  }

  carregarIndicadores(): void {
    this.carregando = true;
    this.erro = null;

    this.homeService.obterIndicadores().subscribe({
      next: (dados) => {
        this.indicadores = dados;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Não foi possível carregar os indicadores da operação.';
        this.carregando = false;
        console.error(err);
      },
    });
  }

  // Ajuda o template a iterar sobre "ocorrenciasPorTipo" sem lógica extra no HTML
  get tiposDeOcorrencia(): { tipo: string; total: number }[] {
    if (!this.indicadores) return [];
    return Object.entries(this.indicadores.ocorrenciasPorTipo).map(([tipo, total]) => ({
      tipo,
      total,
    }));
  }
}
