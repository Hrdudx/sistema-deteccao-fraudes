import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService, SENHA_DEMONSTRACAO } from './auth.service';

describe('AuthService (UC01 — Realizar Login)', () => {
  let auth: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const backendFora = () =>
    http.expectOne('/api/auth/login').flush('erro', { status: 504, statusText: 'Gateway Timeout' });

  it('usa o backend quando ele responde', () => {
    let nome = '';
    auth.entrar('teste@email.com', '123456').subscribe((u) => (nome = u.nome));
    http.expectOne('/api/auth/login').flush({ id: 1, nome: 'Usuario Teste', email: 'teste@email.com', perfil: 'GESTOR' });
    expect(nome).toBe('Usuario Teste');
    expect(auth.autenticado()).toBeTrue();
  });

  it('não cai na demonstração quando o backend recusa um usuário real (401)', () => {
    let status = 0;
    auth.entrar('usuario.real@empresa.com', SENHA_DEMONSTRACAO).subscribe({ error: (e) => (status = e.status) });
    http.expectOne('/api/auth/login').flush('Credenciais inválidas', { status: 401, statusText: 'Unauthorized' });
    expect(status).toBe(401);
    expect(auth.autenticado()).toBeFalse();
  });

  it('com o backend fora do ar, entra com um usuário da equipe', () => {
    auth.entrar('diigopereira.15@gmail.com', SENHA_DEMONSTRACAO).subscribe();
    backendFora();
    expect(auth.usuario()?.nome).toBe('Diogo Pereira da Silva');
    expect(auth.administrador()).toBeTrue();
  });

  it('com o backend fora do ar, recusa senha errada', () => {
    let status = 0;
    auth.entrar('diigopereira.15@gmail.com', 'errada').subscribe({ error: (e) => (status = e.status) });
    backendFora();
    expect(status).toBe(401);
    expect(auth.autenticado()).toBeFalse();
  });

  it('conta da equipe entra na demonstração mesmo se outro backend responder 401', () => {
    auth.entrar('hayyraroc@gmail.com', SENHA_DEMONSTRACAO).subscribe();
    http.expectOne('/api/auth/login').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(auth.usuario()?.nome).toBe('Hayyra Eduarda Rocha Honorio');
  });

  it('adm@sgr.com entra como Administrador', () => {
    auth.entrar('adm@sgr.com', SENHA_DEMONSTRACAO).subscribe();
    backendFora();
    expect(auth.usuario()?.nome).toBe('Administrador do Sistema');
    expect(auth.administrador()).toBeTrue();
  });

  it('sair encerra a sessão', () => {
    auth.entrar('hayyraroc@gmail.com', SENHA_DEMONSTRACAO).subscribe();
    backendFora();
    auth.sair();
    expect(auth.autenticado()).toBeFalse();
  });
});
