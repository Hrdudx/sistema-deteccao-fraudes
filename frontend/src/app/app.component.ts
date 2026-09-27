import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { IconeComponent } from './components/icone/icone.component';
import { AuthService } from './services/auth.service';
import { formatarRotulo } from './utils/formatacao';
import { PERFIS_USUARIO } from './services/usuarios.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarComponent, IconeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'sistema-riscos-frontend';
  // Celular: gaveta aberta/fechada. Desktop: menu lateral recolhido ou não.
  menuAberto = false;
  menuRecolhido = false;
  menuUsuarioAberto = false;
  // A tela de login ocupa a página inteira, sem o menu lateral.
  telaCheia = false;

  constructor(
    private router: Router,
    readonly auth: AuthService,
  ) {
    router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.telaCheia = e.urlAfterRedirects.startsWith('/login');
      this.menuUsuarioAberto = false;
    });
  }

  get perfil(): string {
    const usuario = this.auth.usuario();
    if (!usuario) return 'Visitante';
    return PERFIS_USUARIO.find((p) => p.valor === usuario.perfil?.toUpperCase())?.rotulo ?? formatarRotulo(usuario.perfil);
  }

  alternarMenu(): void {
    if (window.matchMedia('(max-width: 900px)').matches) this.menuAberto = !this.menuAberto;
    else this.menuRecolhido = !this.menuRecolhido;
  }

  sair(): void {
    this.auth.sair();
    this.router.navigate(['/login']);
  }

  // Fecha o menu do usuário ao clicar fora dele
  @HostListener('document:click', ['$event'])
  cliqueFora(evento: MouseEvent): void {
    if (this.menuUsuarioAberto && !(evento.target as HTMLElement).closest('.usuario')) {
      this.menuUsuarioAberto = false;
    }
  }

  @HostListener('document:keydown.escape')
  fecharMenus(): void {
    this.menuAberto = false;
    this.menuUsuarioAberto = false;
  }
}
