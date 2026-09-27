import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Tela de acesso ao SGR, integrada ao POST /api/auth/login (US01).
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  senha = '';
  mostrarSenha = false;
  enviando = false;
  erro: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // Chegar na tela de login pelo "Sair" encerra a sessão atual.
    this.auth.sair();
  }

  entrar(): void {
    this.erro = null;
    if (!this.email.trim() || !this.senha) {
      this.erro = 'Informe e-mail (ou usuário) e senha para continuar.';
      return;
    }

    this.enviando = true;
    this.auth.entrar(this.email.trim(), this.senha).subscribe({
      next: () => this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('voltar') || '/home'),
      error: (erro: HttpErrorResponse) => {
        this.enviando = false;
        this.erro = this.mensagemErro(erro);
      },
    });
  }

  // Fluxos alternativos do UC01: A1 credenciais inválidas (401), A2 usuário inativo (403).
  // A mensagem não revela qual das credenciais está errada (DRE TEL01).
  private mensagemErro(erro: HttpErrorResponse): string {
    if (erro.status === 401) return 'E-mail ou senha incorretos.';
    if (erro.status === 403) return 'Usuário sem acesso ativo. Procure o administrador do sistema.';
    if (erro.status === 400) return 'Informe um e-mail válido e a senha.';
    return 'Não foi possível entrar agora. Tente novamente em instantes.';
  }
}
