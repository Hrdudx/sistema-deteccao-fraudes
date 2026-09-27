
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AlertaFraudeService,
  FiltrosAlertaFraude,
} from '../../services/alerta-fraude.service';
import { AlertaFraude } from '../../models/alerta-fraude.model';

@Component({
  selector: 'app-ocorrencias-fraude',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ocorrencias-fraude.html',
  styleUrl: './ocorrencias-fraude.css',
})
export class OcorrenciasFraude implements OnInit {
  alertas: AlertaFraude[] = [];

  carregando = false;
  erro = '';

  filtros: FiltrosAlertaFraude = {
    status: '',
    severidade: '',
    tipoFraude: '',
    dataInicial: '',
    dataFinal: '',
    busca: '',
  };

  constructor(private alertaFraudeService: AlertaFraudeService) {}

  ngOnInit(): void {
    this.buscarAlertas();
  }

  buscarAlertas(): void {
    this.carregando = true;
    this.erro = '';

    const filtrosApi = this.prepararFiltros();

    this.alertaFraudeService.filtrar(filtrosApi).subscribe({
      next: (dados) => {
        this.alertas = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar alertas de fraude:', erro);
        this.erro = 'Não foi possível carregar os alertas. Verifique se o backend está em execução.';
        this.alertas = [];
        this.carregando = false;
      },
    });
  }

  limparFiltros(): void {
    this.filtros = {
      status: '',
      severidade: '',
      tipoFraude: '',
      dataInicial: '',
      dataFinal: '',
      busca: '',
    };

    this.buscarAlertas();
  }

  private prepararFiltros(): FiltrosAlertaFraude {
    const filtros: FiltrosAlertaFraude = {};

    if (this.filtros.status?.trim()) {
      filtros.status = this.filtros.status.trim();
    }

    if (this.filtros.severidade?.trim()) {
      filtros.severidade = this.filtros.severidade.trim();
    }

    if (this.filtros.tipoFraude?.trim()) {
      filtros.tipoFraude = this.filtros.tipoFraude.trim();
    }

    if (this.filtros.busca?.trim()) {
      filtros.busca = this.filtros.busca.trim();
    }

    if (this.filtros.dataInicial) {
      filtros.dataInicial = `${this.filtros.dataInicial}T00:00:00`;
    }

    if (this.filtros.dataFinal) {
      filtros.dataFinal = `${this.filtros.dataFinal}T23:59:59`;
    }

    return filtros;
  }

  formatarData(data: string): string {
    if (!data) return '-';

    return new Date(data).toLocaleString('pt-BR');
  }

  formatarMoeda(valor: number | null | undefined): string {
    return (valor ?? 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}