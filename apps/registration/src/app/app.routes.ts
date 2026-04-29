import { Route } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const appRoutes: Route[] = [
  /* ── Default redirect ── */
  {
    path: '',
    redirectTo: 'auth/signin',
    pathMatch: 'full',
  },

  /* ── Auth module (lazy) ── */
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
  },

  /* ── Protected routes ── */
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.DashboardComponent),
    title: 'Dashboard — Registration App',
  },

  /* ── 404 fallback ── */
  {
    path: '**',
    redirectTo: 'auth/signin',
  },
];
