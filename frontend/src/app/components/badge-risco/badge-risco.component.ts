import { Component, Input } from '@angular/core';
import { normalizarRisco, rotuloRisco } from '../../utils/formatacao';

// Selo colorido de nível de risco/prioridade. Aceita os formatos variados que
// chegam do backend ("ALTA", "alto", "Média"...) e sempre exibe o rótulo padrão.
// A cor nunca é a única pista: o texto do nível aparece junto (acessibilidade).
@Component({
  selector: 'app-badge-risco',
  standalone: true,
  template: `<span [class]="'badge badge-' + (nivel ?? 'neutro')">{{ rotulo }}</span>`,
})
export class BadgeRiscoComponent {
  @Input() valor: string | null | undefined = null;
  // Texto opcional para exibir no lugar do rótulo padrão (ex.: prioridade "Alta").
  @Input() texto: string | null = null;

  get nivel() {
    return normalizarRisco(this.valor);
  }

  get rotulo() {
    return this.texto ?? rotuloRisco(this.valor);
  }
}
