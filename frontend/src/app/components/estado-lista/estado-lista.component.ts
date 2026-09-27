import { Component, EventEmitter, Input, Output } from '@angular/core';

// Mensagens padronizadas para os três estados que toda listagem precisa tratar:
// carregando, erro (com opção de tentar novamente) e lista vazia.
@Component({
  selector: 'app-estado-lista',
  standalone: true,
  template: `
    @if (carregando) {
      <div class="estado" role="status" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        {{ mensagemCarregando }}
      </div>
    } @else if (erro) {
      <div class="estado erro" role="alert">
        <span>{{ erro }}</span>
        <button type="button" class="botao botao-secundario" (click)="tentarNovamente.emit()">
          Tentar novamente
        </button>
      </div>
    } @else if (vazio) {
      <div class="estado" role="status">{{ mensagemVazio }}</div>
    }
  `,
  styles: `
    .estado {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 32px 16px;
      text-align: center;
      color: var(--cor-texto-suave);
      background: var(--cor-neutro-fundo);
      border-radius: 8px;
    }
    .erro {
      color: var(--cor-critico);
      background: var(--cor-critico-fundo);
    }
    .spinner {
      width: 22px;
      height: 22px;
      border: 3px solid var(--cor-borda);
      border-top-color: var(--cor-primaria);
      border-radius: 50%;
      animation: girar 0.8s linear infinite;
    }
    @keyframes girar {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class EstadoListaComponent {
  @Input() carregando = false;
  @Input() erro: string | null = null;
  @Input() vazio = false;
  @Input() mensagemCarregando = 'Carregando...';
  @Input() mensagemVazio = 'Nenhum registro encontrado.';
  @Output() tentarNovamente = new EventEmitter<void>();
}
