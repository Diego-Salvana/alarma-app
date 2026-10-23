import { Routes } from '@angular/router';
import { dashboardGuard } from './dashboard/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(c => c.AuthComponent),
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes),
    canActivateChild: [dashboardGuard]
  },
  { path: '**', redirectTo: 'auth' }
];
