import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// RF04: funcionalidade não autorizada ao perfil do usuário logado.
@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="card pagina">
      <span class="codigo">403</span>
      <h1>Acesso restrito</h1>
      <p class="texto-suave">
        Esta área é exclusiva do perfil <strong>Administrador</strong>.
        @if (auth.usuario(); as u) {
          Você entrou como {{ u.nome }}.
        }
      </p>
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
      margin: 8px auto 24px;
      max-width: 460px;
    }
  `,
})
export class AcessoNegadoComponent {
  constructor(readonly auth: AuthService) {}
}
