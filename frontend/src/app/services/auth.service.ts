import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { USUARIOS_DEMONSTRACAO } from './usuarios.service';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  demonstracao?: boolean;
}

const CHAVE_SESSAO = 'sgr.usuario';

// Senha única dos usuários de demonstração (usada só quando o backend não responde).
export const SENHA_DEMONSTRACAO = 'sgr123';

// UC01 — Realizar Login. Autentica pelo POST /api/auth/login (US01).
// Se o backend estiver fora do ar, permite entrar com os usuários de
// demonstração (equipe do projeto), para a apresentação não depender da API.
// O usuário fica só na sessão do navegador; a autorização definitiva é do backend.
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly usuario = signal<UsuarioLogado | null>(this.lerSessao());
  readonly autenticado = computed(() => this.usuario() !== null);
  readonly administrador = computed(() => this.usuario()?.perfil?.toUpperCase() === 'ADMINISTRADOR');

  constructor(private http: HttpClient) {}

  entrar(email: string, senha: string): Observable<UsuarioLogado> {
    return this.http.post<UsuarioLogado>(`${environment.apiUrl}/auth/login`, { email, senha }).pipe(
      catchError((erro: HttpErrorResponse) =>
        // Status 0 = sem conexão; 5xx = backend fora do ar (o proxy do ng serve responde 500)
        erro.status === 0 || erro.status >= 500 ? this.entrarDemonstracao(email, senha) : throwError(() => erro),
      ),
      tap((usuario) => this.salvarSessao(usuario)),
    );
  }

  sair(): void {
    try {
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {
      // armazenamento indisponível (ex.: navegação privada) — nada a limpar
    }
    this.usuario.set(null);
  }

  // Mesmas regras do backend: credencial inválida -> 401, usuário inativo -> 403.
  private entrarDemonstracao(email: string, senha: string): Observable<UsuarioLogado> {
    const usuario = USUARIOS_DEMONSTRACAO.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!usuario || senha !== SENHA_DEMONSTRACAO) {
      return throwError(() => new HttpErrorResponse({ status: 401, error: 'Credenciais inválidas' }));
    }
    if (usuario.status !== 'ATIVO') {
      return throwError(() => new HttpErrorResponse({ status: 403, error: 'Usuário inativo' }));
    }
    const { id, nome, perfil } = usuario;
    return of({ id, nome, email: usuario.email, perfil, demonstracao: true });
  }

  private salvarSessao(usuario: UsuarioLogado): void {
    try {
      sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
    } catch {
      // segue apenas em memória
    }
    this.usuario.set(usuario);
  }

  private lerSessao(): UsuarioLogado | null {
    try {
      const salvo = sessionStorage.getItem(CHAVE_SESSAO);
      return salvo ? (JSON.parse(salvo) as UsuarioLogado) : null;
    } catch {
      return null;
    }
  }
}
