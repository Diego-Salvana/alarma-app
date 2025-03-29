import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent) },

  // TODO: ruta para la página de recuperación de contraseña

  { path: '**', redirectTo: 'login' }
];
