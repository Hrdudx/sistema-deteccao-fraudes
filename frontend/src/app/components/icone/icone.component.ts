import { Component, Input } from '@angular/core';

// Ícones de traço (24x24) desenhados em SVG, sem dependência externa.
// Herdam a cor do texto (currentColor); são decorativos (aria-hidden).
const ICONES: Record<string, string> = {
  escudo: 'M12 3l7 3v5c0 4.5-3 8.3-7 9.9C8 19.3 5 15.5 5 11V6l7-3z',
  home: 'M3 10.5L12 3l9 7.5M5.5 9v11h13V9M10 20v-6h4v6',
  clientes:
    'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.3a3.5 3.5 0 010 6.4M18 14.8c1.9.7 3.2 2.5 3.5 5.2',
  ocorrencias: 'M9 4h6v3H9zM9 5.5H6.5A1.5 1.5 0 005 7v12.5A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V7a1.5 1.5 0 00-1.5-1.5H15M8.5 12h7M8.5 16h5',
  documento: 'M14 3H7a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 007 21h10a1.5 1.5 0 001.5-1.5V7.5L14 3zM14 3v4.5h4.5M9 13h6M9 17h4',
  fraude: 'M12 3l7 3v5c0 4.5-3 8.3-7 9.9C8 19.3 5 15.5 5 11V6l7-3zM12 8v4.5M12 15.5v.5',
  relatorios: 'M4 20h16M6.5 16v-5M11 16V6M15.5 16v-7M20 16v-3',
  usuarios: 'M10 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3.5 20c.6-3.4 3.3-5.5 6.5-5.5 1.3 0 2.5.3 3.5.9M17.5 14.5v6M14.5 17.5h6',
  sair: 'M10 4H6a1.5 1.5 0 00-1.5 1.5v13A1.5 1.5 0 006 20h4M15 8l4 4-4 4M19 12H9.5',
  menu: 'M4 6.5h16M4 12h16M4 17.5h16',
  usuario: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 12.5a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM6.3 18.3c1.2-2 3.3-3.1 5.7-3.1s4.5 1.1 5.7 3.1',
  seta: 'M6 9l6 6 6-6',
  direita: 'M9 6l6 6-6 6',
  prancheta: 'M9 4h6v3H9zM9 5.5H6.5A1.5 1.5 0 005 7v12.5A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V7a1.5 1.5 0 00-1.5-1.5H15M8.5 13l2 2 4-4',
  andamento: 'M9 4h6v3H9zM9 5.5H6.5A1.5 1.5 0 005 7v12.5A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V7a1.5 1.5 0 00-1.5-1.5H15M8.5 11.5h7M8.5 15h4.5',
  concluido: 'M12 21a9 9 0 100-18 9 9 0 000 18zM8 12.3l2.7 2.7L16 9.7',
  alerta: 'M12 4L2.8 19.5h18.4L12 4zM12 10v4.5M12 17v.5',
  relogio: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2',
  novo: 'M14 3H7a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 007 21h10a1.5 1.5 0 001.5-1.5V7.5L14 3zM14 3v4.5h4.5M12 11v6M9 14h6',
  calendario: 'M5 5.5h14A1.5 1.5 0 0120.5 7v12A1.5 1.5 0 0119 20.5H5A1.5 1.5 0 013.5 19V7A1.5 1.5 0 015 5.5zM3.5 10h17M8 3.5v4M16 3.5v4M9 15l2 2 4-4',
  atualizar: 'M20 11.5A8 8 0 006.3 6.3L4 8.5M4 4v4.5h4.5M4 12.5a8 8 0 0013.7 5.2L20 15.5M20 20v-4.5h-4.5',
};

@Component({
  selector: 'app-icone',
  standalone: true,
  template: `<svg
    [attr.width]="tamanho"
    [attr.height]="tamanho"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path [attr.d]="caminho" />
  </svg>`,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }
  `,
})
export class IconeComponent {
  @Input({ required: true }) nome = '';
  @Input() tamanho = 20;

  get caminho(): string {
    return ICONES[this.nome] ?? '';
  }
}
