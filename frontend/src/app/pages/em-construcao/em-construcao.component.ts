import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoPaginaComponent } from '../../components/cabecalho-pagina/cabecalho-pagina.component';

// Página exibida nas áreas do menu que ainda não têm tela pronta (ex.: Relatórios,
// Usuários). Evita a tela em branco e orienta o usuário para onde seguir.
// O título vem do "data" da rota (withComponentInputBinding).
@Component({
  selector: 'app-em-construcao',
  standalone: true,
  imports: [RouterLink, CabecalhoPaginaComponent],
  template: `
    <app-cabecalho-pagina [titulo]="titulo" [subtitulo]="descricao"></app-cabecalho-pagina>
    <section class="card vazio">
      <h2>Tela em desenvolvimento</h2>
      <p class="texto-suave">
        Esta área faz parte do escopo do SGR e será disponibilizada em uma próxima entrega.
        Enquanto isso, você pode acompanhar a operação pelas telas abaixo.
      </p>
      <div class="acoes">
        <a class="botao botao-secundario" routerLink="/home">Ir para a Home</a>
        <a class="botao" routerLink="/ocorrencias">Ver ocorrências</a>
      </div>
    </section>
  `,
  styles: `
    .vazio {
      text-align: center;
      padding: 48px 24px;
    }
    .vazio p {
      max-width: 520px;
      margin: 8px auto 24px;
    }
    .acoes {
      justify-content: center;
    }
  `,
})
export class EmConstrucaoComponent {
  @Input() titulo = 'Em construção';
  @Input() descricao = '';
}
