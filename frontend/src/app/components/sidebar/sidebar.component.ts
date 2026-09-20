import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  itensPrincipais: ItemMenu[] = [
    { rotulo: 'Home', rota: '/home' },
    { rotulo: 'Clientes', rota: '/clientes' },
  ];

  categoriasOcorrencias: ItemMenu[] = [
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
}
