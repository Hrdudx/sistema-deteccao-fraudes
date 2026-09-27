import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';

// Estrutura do menu conforme o Documento de Modelagem do Sistema (seção 9.1):
// "O menu lateral previsto para o projeto é composto por Home, Clientes,
// Ocorrências, Relatórios e Usuários. Configurações não faz parte do menu atual."
//
// Categorias de Ocorrências (seção 5 / 9.4 do DMS): somente PLD, Chargeback,
// KYC e Fraude. Movimentações e Transacional NÃO são categorias de Ocorrência
// (Transações são contexto financeiro de análise, não ocorrência em si).
interface ItemMenu {
  rotulo: string;
  rota: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  // Em telas pequenas o menu vira uma gaveta, aberta pelo botão da barra superior.
  @Input() aberto = false;
  @Output() fechar = new EventEmitter<void>();

  itensPrincipais: ItemMenu[] = [
    { rotulo: 'Home', rota: '/home' },
    { rotulo: 'Clientes', rota: '/clientes' },
  ];

  categoriasOcorrencias: ItemMenu[] = [
    { rotulo: 'Todas', rota: '/ocorrencias' },
    { rotulo: 'PLD', rota: '/ocorrencias/pld' },
    { rotulo: 'Chargeback', rota: '/ocorrencias/chargeback' },
    { rotulo: 'KYC', rota: '/ocorrencias/kyc' },
    { rotulo: 'Fraude', rota: '/ocorrencias/fraude' },
  ];

  itensFinais: ItemMenu[] = [
    { rotulo: 'Relatórios', rota: '/relatorios' },
    { rotulo: 'Usuários', rota: '/usuarios' },
  ];

  ocorrenciasAbertas = true;
  emOcorrencias = false;

  constructor(
    private router: Router,
    readonly auth: AuthService,
  ) {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      // Destaca "Ocorrências" quando qualquer categoria estiver aberta e garante
      // que o submenu apareça ao navegar para ela por outro caminho (ex.: Home).
      this.emOcorrencias = e.urlAfterRedirects.startsWith('/ocorrencias');
      if (this.emOcorrencias) this.ocorrenciasAbertas = true;
      this.fechar.emit();
    });
  }
}
