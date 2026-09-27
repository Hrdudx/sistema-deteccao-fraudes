import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
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
  ) {
    // Chegar na tela de login pelo "Sair" encerra a sessão atual.
    this.auth.sair();
  }

  entrar(): void {
    this.erro = null;
    if (!this.email.trim() || !this.senha) {
      this.erro = 'Informe e-mail e senha para continuar.';
      return;
    }

    this.enviando = true;
    this.auth.entrar(this.email.trim(), this.senha).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (erro: HttpErrorResponse) => {
        this.enviando = false;
        this.erro = this.mensagemErro(erro);
      },
    });
  }

  private mensagemErro(erro: HttpErrorResponse): string {
    if (erro.status === 0 || erro.status >= 500) {
      return 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.';
    }
    // O backend devolve { mensagem } ou { erro } conforme o handler de exceções
    const corpo = erro.error as { mensagem?: string; message?: string; erro?: string } | null;
    return corpo?.mensagem ?? corpo?.message ?? corpo?.erro ?? 'E-mail ou senha inválidos.';
  }
}
