import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent) },
  { path: 'hub', loadComponent: () => import('./pages/hub/hub.component').then(c => c.HubComponent) },
  { path: 'hub/sensor/:sensorNumber', loadComponent: () => import('./pages/sensor/sensor.component').then(c => c.SensorComponent) },
  { path: 'history', loadComponent: () => import('./pages/central-history/central-history.component').then(c => c.CentralHistoryComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent) },
  { path: 'profile/house/:id', loadComponent: () => import('./pages/house-info/house-info.component').then(c => c.HouseInfoComponent) },
  { path: '**', redirectTo: 'home' }
];
