import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { IconeComponent } from '../icone/icone.component';
import { AuthService } from '../../services/auth.service';

// Estrutura do menu conforme o Documento de Modelagem do Sistema (seção 9.1):
// "O menu lateral previsto para o projeto é composto por Home, Clientes,
// Ocorrências, Relatórios e Usuários. Configurações não faz parte do menu atual."
//
// Categorias de Ocorrências (DRE RN07/RN08 e DMS 9.4): somente PLD, Chargeback,
// KYC e Fraude. Movimentações e Transacional NÃO são categorias de Ocorrência
// (Transações são contexto financeiro de análise, não ocorrência em si).
interface ItemMenu {
  rotulo: string;
  rota: string;
  icone: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconeComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  // Em telas pequenas o menu vira uma gaveta, aberta pelo botão da barra superior.
  @Input() aberto = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() sair = new EventEmitter<void>();

  itensPrincipais: ItemMenu[] = [
    { rotulo: 'Home', rota: '/home', icone: 'home' },
    { rotulo: 'Clientes', rota: '/clientes', icone: 'clientes' },
  ];

  categoriasOcorrencias: ItemMenu[] = [
    { rotulo: 'PLD', rota: '/ocorrencias/pld', icone: 'documento' },
    { rotulo: 'Chargeback', rota: '/ocorrencias/chargeback', icone: 'documento' },
    { rotulo: 'KYC', rota: '/ocorrencias/kyc', icone: 'documento' },
    { rotulo: 'Fraude', rota: '/ocorrencias/fraude', icone: 'fraude' },
  ];

  itensFinais: ItemMenu[] = [
    { rotulo: 'Relatórios', rota: '/relatorios', icone: 'relatorios' },
    { rotulo: 'Usuários', rota: '/usuarios', icone: 'usuarios' },
  ];

  ocorrenciasAbertas = true;

  // Usuários só aparece no menu para o perfil Administrador (RF04).
  get itensFinaisVisiveis(): ItemMenu[] {
    return this.itensFinais.filter((i) => i.rota !== '/usuarios' || this.auth.administrador());
  }
  emOcorrencias = false;

  constructor(
    private router: Router,
    private auth: AuthService,
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
