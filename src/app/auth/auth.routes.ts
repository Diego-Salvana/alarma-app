import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'verify-email/:token',
    loadComponent: () => import('./pages/verify-email/verify-email.component')
      .then(c => c.VerifyEmailComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component')
      .then(c => c.ForgotPasswordComponent)
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./pages/reset-password/reset-password.component')
      .then(c => c.ResetPasswordComponent)
  },
  {
    path: 'send-verification-email',
    loadComponent: () => import('./pages/send-verification-email/send-verification-email.component')
      .then(c => c.SendVerificationEmailComponent)
  },
  { path: '**', redirectTo: 'login' }
];
