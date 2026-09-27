import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Sem login, qualquer tela leva ao login (UC01); depois volta para onde o usuário ia.
export const autenticadoGuard: CanActivateFn = (_rota, estado) => {
  const auth = inject(AuthService);
  return auth.autenticado() ? true : inject(Router).createUrlTree(['/login'], { queryParams: { voltar: estado.url } });
};

// RF04 / TEL13: Usuários e Acessos é exclusivo do perfil Administrador.
export const administradorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.administrador() ? true : inject(Router).createUrlTree(['/acesso-negado']);
};
