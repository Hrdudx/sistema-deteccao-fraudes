import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'sistema-riscos-frontend';
  menuAberto = false;
  // A tela de login ocupa a página inteira, sem o menu lateral.
  telaCheia = false;

  constructor(router: Router) {
    router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.telaCheia = e.urlAfterRedirects.startsWith('/login');
    });
  }
}
