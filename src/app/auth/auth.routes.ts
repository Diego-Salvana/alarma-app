import { Routes } from '@angular/router';
import { authGuard } from './guards';

export const authRoutes: Routes = [
  {
    path: 'register',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  // Sin guard: se accede desde el link del correo aunque exista sesión previa.
  {
    path: 'verify-email/:token',
    loadComponent: () => import('./pages/verify-email/verify-email.component')
      .then(c => c.VerifyEmailComponent)
  },
  {
    path: 'forgot-password',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/forgot-password/forgot-password.component')
      .then(c => c.ForgotPasswordComponent)
  },
  // Sin guard: se accede desde el link del correo aunque exista sesión previa.
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./pages/reset-password/reset-password.component')
      .then(c => c.ResetPasswordComponent)
  },
  {
    path: 'send-verification-email',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/send-verification-email/send-verification-email.component')
      .then(c => c.SendVerificationEmailComponent)
  },
  { path: '**', redirectTo: 'login' }
];
