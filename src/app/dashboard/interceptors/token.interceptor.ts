import type { HttpInterceptorFn } from '@angular/common/http';

import { ENV } from '../../env';

const PUBLIC_USERS_ROUTES = [
  '/users/register',
  '/users/login',
  '/users/send-verification-email',
  '/users/verify-email',
  '/users/forgot-password',
  '/users/reset-password'
];

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isPublicUsersRoute = req.url.startsWith(ENV.API_URL) && PUBLIC_USERS_ROUTES.some(
    route => req.url.includes(route)
  );

  if (!token || isPublicUsersRoute) return next(req);

  const cloneReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(cloneReq);
};
