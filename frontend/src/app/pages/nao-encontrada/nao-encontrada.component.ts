import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Rota coringa (**): endereço digitado errado ou link antigo.
@Component({
  selector: 'app-nao-encontrada',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="card pagina">
      <span class="codigo">404</span>
      <h1>Página não encontrada</h1>
      <p class="texto-suave">O endereço acessado não existe ou foi alterado.</p>
      <a class="botao" routerLink="/home">Voltar para a Home</a>
    </section>
  `,
  styles: `
    .pagina {
      text-align: center;
      padding: 56px 24px;
    }
    .codigo {
      font-size: 3rem;
      font-weight: 700;
      color: var(--cor-borda);
    }
    p {
      margin: 8px 0 24px;
    }
  `,
})
export class NaoEncontradaComponent {}
