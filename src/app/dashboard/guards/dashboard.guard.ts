import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const dashboardGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (!localStorage.getItem('token')) {
    return router.createUrlTree(['/auth']);
  } else {
    return true;
  }
};
