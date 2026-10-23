import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isTokenValid } from '../../shared/utils';

/** Bloquea el acceso al dashboard sin un JWT de sesión vigente. */
export const dashboardGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (isTokenValid(localStorage.getItem('token'))) {
    return true;
  } else {
    localStorage.removeItem('token');
    return router.createUrlTree(['/auth']);
  }
};
