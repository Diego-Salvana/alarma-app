import { Routes } from '@angular/router';
import { authGuard } from './auth/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(c => c.AuthComponent),
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
    canActivateChild: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  },
  {
    path: 'verification',
    loadComponent: () => import('./shared/pages/verification/verification.component').then(c => c.VerificationComponent)
  },
  { path: '**', redirectTo: 'auth' }
];
