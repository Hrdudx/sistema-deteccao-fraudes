import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResultadoConsulta } from '../models/resultado-consulta.model';

// Usuário como a tela exibe — a senha nunca trafega de volta (DRE TEL13).
export interface UsuarioSistema {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  status: string; // ATIVO | INATIVO
}

export interface NovoUsuario {
  nome: string;
  email: string;
  senha: string;
  perfil: string;
}

// Perfis de acesso definidos no DRE (seção 3 — atores e perfis).
export const PERFIS_USUARIO = [
  { valor: 'ANALISTA_RISCOS', rotulo: 'Analista de Riscos' },
  { valor: 'ANALISTA_COMPLIANCE', rotulo: 'Analista de Compliance' },
  { valor: 'GESTOR', rotulo: 'Gestor' },
  { valor: 'ADMINISTRADOR', rotulo: 'Administrador' },
];

// Contrato do DRE (seção 10.2):
//   GET /api/usuarios · POST /api/usuarios · PUT /api/usuarios/{id} · PATCH /api/usuarios/{id}/status
// Hoje o backend implementa apenas o POST (cadastro). Os demais caem no modo
// demonstração, e a tela avisa o usuário de que a alteração não foi gravada.
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ResultadoConsulta<UsuarioSistema[]>> {
    return this.http.get<UsuarioSistema[]>(this.baseUrl).pipe(
      map((dados) => ({ dados: dados ?? [], demonstracao: false })),
      catchError(() => of({ dados: USUARIOS_DEMONSTRACAO.map((u) => ({ ...u })), demonstracao: true })),
    );
  }

  // Cadastro real (POST já existe no backend). Erros de validação (400) e
  // e-mail duplicado (409) são repassados para a tela mostrar a mensagem.
  cadastrar(novo: NovoUsuario): Observable<UsuarioSistema> {
    return this.http
      .post<Omit<UsuarioSistema, 'status'>>(this.baseUrl, novo)
      .pipe(map((u) => ({ ...u, status: 'ATIVO' })));
  }

  atualizar(id: number, dados: Pick<UsuarioSistema, 'nome' | 'email' | 'perfil'>): Observable<UsuarioSistema> {
    return this.http.put<UsuarioSistema>(`${this.baseUrl}/${id}`, dados);
  }

  alterarStatus(id: number, status: string): Observable<UsuarioSistema> {
    return this.http.patch<UsuarioSistema>(`${this.baseUrl}/${id}/status`, { status });
  }
}

// Backend fora do ar ou endpoint ainda não criado (404/405/501).
export function endpointIndisponivel(erro: HttpErrorResponse): boolean {
  return erro.status === 0 || erro.status === 404 || erro.status === 405 || erro.status === 501 || erro.status >= 502;
}

// Mensagem legível a partir das respostas de erro do backend.
export function mensagemDeErro(erro: HttpErrorResponse): string {
  if (erro.status === 409) return typeof erro.error === 'string' && erro.error ? erro.error : 'E-mail já cadastrado.';
  if (erro.status === 400 && erro.error && typeof erro.error === 'object') {
    const mensagens = Object.values(erro.error as Record<string, string>).filter((m) => typeof m === 'string');
    if (mensagens.length) return mensagens.join(' ');
  }
  if (erro.status === 403) return 'Você não tem permissão para esta ação.';
  return 'Não foi possível concluir a operação. Tente novamente.';
}

const USUARIOS_DEMONSTRACAO: UsuarioSistema[] = [
  { id: 1, nome: 'Airon Francelino', email: 'airon.francelino@sgr.local', perfil: 'GESTOR', status: 'ATIVO' },
  { id: 2, nome: 'Ana Silva', email: 'ana.silva@sgr.local', perfil: 'ANALISTA_RISCOS', status: 'ATIVO' },
  { id: 3, nome: 'Bruno Lima', email: 'bruno.lima@sgr.local', perfil: 'ANALISTA_RISCOS', status: 'ATIVO' },
  { id: 4, nome: 'Carla Dias', email: 'carla.dias@sgr.local', perfil: 'ANALISTA_COMPLIANCE', status: 'ATIVO' },
  { id: 5, nome: 'Diego Rocha', email: 'diego.rocha@sgr.local', perfil: 'ANALISTA_COMPLIANCE', status: 'INATIVO' },
  { id: 6, nome: 'Administrador do Sistema', email: 'admin@sgr.local', perfil: 'ADMINISTRADOR', status: 'ATIVO' },
];
