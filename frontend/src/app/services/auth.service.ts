import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

const CHAVE_SESSAO = 'sgr.usuario';

// Integra a tela de login com o endpoint POST /api/auth/login (US01).
// Guarda o usuário apenas na sessão do navegador para exibir nome/perfil no menu;
// o controle de permissões por perfil fica a cargo do backend.
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly usuario = signal<UsuarioLogado | null>(this.lerSessao());

  constructor(private http: HttpClient) {}

  entrar(email: string, senha: string): Observable<UsuarioLogado> {
    return this.http
      .post<UsuarioLogado>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(tap((usuario) => this.salvarSessao(usuario)));
  }

  sair(): void {
    try {
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {
      // armazenamento indisponível (ex.: navegação privada) — nada a limpar
    }
    this.usuario.set(null);
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
