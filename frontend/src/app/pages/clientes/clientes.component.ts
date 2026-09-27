import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteApi } from '../../models/backend.model';
import { ClientesService } from '../../services/clientes.service';
import { CabecalhoPaginaComponent } from '../../components/cabecalho-pagina/cabecalho-pagina.component';
import { EstadoListaComponent } from '../../components/estado-lista/estado-lista.component';
import { formatarRotulo, semAcento } from '../../utils/formatacao';

const ITENS_POR_PAGINA = 15;

// Consulta de clientes (história de usuário: "Como analista de riscos, quero
// consultar um cliente para visualizar seu histórico"). Lista com busca e filtros;
// ao escolher um cliente, abre a tela de histórico.
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, CabecalhoPaginaComponent, EstadoListaComponent],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: ClienteApi[] = [];
  carregando = true;
  erro: string | null = null;
  demonstracao = false;

  busca = '';
  tipoPessoa = '';
  status = '';
  pagina = 1;

  constructor(
    private service: ClientesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = null;
    this.service.listar().subscribe({
      next: (resultado) => {
        this.clientes = resultado.dados;
        this.demonstracao = resultado.demonstracao;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os clientes.';
        this.carregando = false;
      },
    });
  }

  // Valores distintos de status existentes na base, para o filtro.
  get opcoesStatus(): string[] {
    return [...new Set(this.clientes.map((c) => c.statusCliente).filter((s): s is string => !!s))].sort();
  }

  // Pesquisa por ID ou nome/razão social (RF20). Cada campo é comparado
  // separadamente, para um número não "emendar" com o de outro campo.
  private corresponde(c: ClienteApi, termo: string): boolean {
    if (!termo) return true;
    const id = c.idCliente.toLowerCase();
    const nome = semAcento(c.nomeRazaoSocial).toLowerCase();
    const digitos = termo.replace(/\D/g, '');
    return (
      id.includes(termo) ||
      nome.includes(termo) ||
      // "1", "0001" ou "cli 1" também encontram CLI0001
      (digitos.length > 0 && /^[a-z\s-]*\d+$/.test(termo) && Number(id.replace(/\D/g, '')) === Number(digitos))
    );
  }

  get filtrados(): ClienteApi[] {
    const termo = semAcento(this.busca.trim()).toLowerCase();
    return this.clientes
      .filter((c) => !this.tipoPessoa || c.tipoPessoa === this.tipoPessoa)
      .filter((c) => !this.status || c.statusCliente === this.status)
      .filter((c) => this.corresponde(c, termo))
      .sort((a, b) => a.nomeRazaoSocial.localeCompare(b.nomeRazaoSocial, 'pt-BR'));
  }

  // Até 8 sugestões para a lista que aparece enquanto o usuário digita.
  get sugestoes(): ClienteApi[] {
    const termo = semAcento(this.busca.trim()).toLowerCase();
    return termo.length < 1 ? [] : this.clientes.filter((c) => this.corresponde(c, termo)).slice(0, 8);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.filtrados.length / ITENS_POR_PAGINA));
  }

  get paginaAtual(): ClienteApi[] {
    const inicio = (Math.min(this.pagina, this.totalPaginas) - 1) * ITENS_POR_PAGINA;
    return this.filtrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }

  get filtrosAtivos(): boolean {
    return !!this.busca || !!this.tipoPessoa || !!this.status;
  }

  limparFiltros(): void {
    this.busca = '';
    this.tipoPessoa = '';
    this.status = '';
    this.pagina = 1;
  }

  abrir(cliente: ClienteApi): void {
    this.router.navigate(['/clientes', cliente.idCliente]);
  }

  rotulo(valor: string | null | undefined): string {
    return formatarRotulo(valor);
  }

  tipo(c: ClienteApi): string {
    return c.tipoPessoa === 'PJ' ? 'Pessoa Jurídica' : c.tipoPessoa === 'PF' ? 'Pessoa Física' : c.tipoPessoa;
  }
}
