import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
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
    for (const item of ['Home', 'Clientes', 'Ocorrências', 'PLD', 'Chargeback', 'KYC', 'Fraude', 'Relatórios', 'Usuários']) {
      expect(menu).toContain(item);
    }
  });
});
