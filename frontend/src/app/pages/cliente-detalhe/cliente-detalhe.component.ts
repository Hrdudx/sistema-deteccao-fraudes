import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClienteHistoricoApi } from '../../models/backend.model';
import { Ocorrencia } from '../../models/ocorrencia.model';
import { ClientesService } from '../../services/clientes.service';
import {
  chargebackParaOcorrencia,
  fraudeParaOcorrencia,
  kycParaOcorrencia,
  pldParaOcorrencia,
} from '../../services/ocorrencias.service';
import { CabecalhoPaginaComponent } from '../../components/cabecalho-pagina/cabecalho-pagina.component';
import { BadgeRiscoComponent } from '../../components/badge-risco/badge-risco.component';
import { EstadoListaComponent } from '../../components/estado-lista/estado-lista.component';
import { formatarRotulo } from '../../utils/formatacao';

type Aba = 'ocorrencias' | 'transacoes' | 'contas';

// Histórico do cliente: dados cadastrais, risco consolidado e as abas de
// ocorrências (PLD, Fraude, Chargeback, KYC), transações e contas.
// Consome GET /api/clientes/{id}/historico.
@Component({
  selector: 'app-cliente-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink, CabecalhoPaginaComponent, BadgeRiscoComponent, EstadoListaComponent],
  templateUrl: './cliente-detalhe.component.html',
  styleUrl: './cliente-detalhe.component.css',
})
export class ClienteDetalheComponent implements OnChanges {
  // Preenchido pela rota /clientes/:id (withComponentInputBinding)
  @Input() id = '';

  historico: ClienteHistoricoApi | null = null;
  ocorrencias: Ocorrencia[] = [];
  carregando = true;
  erro: string | null = null;
  naoEncontrado = false;
  demonstracao = false;
  aba: Aba = 'ocorrencias';

  constructor(private service: ClientesService) {}

  ngOnChanges(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = null;
    this.naoEncontrado = false;
    this.service.historico(this.id).subscribe({
      next: (resultado) => {
        this.historico = resultado.dados;
        this.demonstracao = resultado.demonstracao;
        this.naoEncontrado = !resultado.dados;
        this.ocorrencias = resultado.dados ? this.montarOcorrencias(resultado.dados) : [];
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o histórico do cliente.';
        this.carregando = false;
      },
    });
  }

  rotulo(valor: string | null | undefined): string {
    return formatarRotulo(valor);
  }

  tipoPessoa(tipo: string | null | undefined): string {
    return tipo === 'PJ' ? 'Pessoa Jurídica' : tipo === 'PF' ? 'Pessoa Física' : (tipo ?? '—');
  }

  private montarOcorrencias(h: ClienteHistoricoApi): Ocorrencia[] {
    return [
      ...(h.alertasPld ?? []).map(pldParaOcorrencia),
      ...(h.alertasFraude ?? []).map(fraudeParaOcorrencia),
      ...(h.chargebacks ?? []).map(chargebackParaOcorrencia),
      ...(h.kycs ?? []).map(kycParaOcorrencia),
    ].sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''));
  }
}
