import { Component, Input } from '@angular/core';

// Cabeçalho padrão das telas: título, subtítulo e área de ações à direita
// (ex.: botão "Atualizar"). Mantém o mesmo espaçamento e hierarquia em todas as páginas.
@Component({
  selector: 'app-cabecalho-pagina',
  standalone: true,
  template: `
    <header class="cabecalho">
      <div>
        @if (contexto) {
          <span class="contexto">{{ contexto }}</span>
        }
        <h1>{{ titulo }}</h1>
        @if (subtitulo) {
          <p class="texto-suave">{{ subtitulo }}</p>
        }
      </div>
      <div class="acoes-cabecalho">
        <ng-content></ng-content>
      </div>
    </header>
  `,
  styles: `
    .cabecalho {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .contexto {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--cor-texto-fraco);
      margin-bottom: 4px;
    }
    p {
      margin: 4px 0 0;
    }
    .acoes-cabecalho {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  `,
})
export class CabecalhoPaginaComponent {
  @Input({ required: true }) titulo = '';
  @Input() subtitulo = '';
  @Input() contexto = '';
}
