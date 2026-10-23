import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isTokenValid } from '../../shared/utils';

/** Permite el acceso solo a usuarios sin sesión válida (login, register, etc). */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (isTokenValid(localStorage.getItem('token'))) {
    return router.createUrlTree(['/dashboard']);
  } else {
    return true;
  }
};
