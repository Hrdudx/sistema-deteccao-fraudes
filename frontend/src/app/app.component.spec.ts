import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('deve criar a aplicação', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`deve ter o título 'sistema-riscos-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toEqual('sistema-riscos-frontend');
  });

  it('deve exibir o menu lateral com as áreas do DMS', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const menu = (fixture.nativeElement as HTMLElement).querySelector('app-sidebar')?.textContent ?? '';
    for (const item of ['Home', 'Clientes', 'Ocorrências', 'PLD', 'Chargeback', 'KYC', 'Fraude', 'Relatórios']) {
      expect(menu).toContain(item);
    }
  });

  it('deve mostrar "Usuários" no menu somente para o perfil Administrador (RF04)', () => {
    const auth = TestBed.inject(AuthService);
    const fixture = TestBed.createComponent(AppComponent);
    const menu = () => (fixture.nativeElement as HTMLElement).querySelector('app-sidebar')?.textContent ?? '';

    auth.usuario.set({ id: 5, nome: 'Analista', email: 'a@sgr', perfil: 'ANALISTA_RISCOS' });
    fixture.detectChanges();
    expect(menu()).not.toContain('Usuários');

    auth.usuario.set({ id: 2, nome: 'Admin', email: 'b@sgr', perfil: 'ADMINISTRADOR' });
    fixture.detectChanges();
    expect(menu()).toContain('Usuários');
  });
});
