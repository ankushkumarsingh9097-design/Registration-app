import { Route } from '@angular/router';
import { guestGuard } from './guards/auth.guard';

export const authRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
  {
    path: 'signin',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./components/signin/signin').then((m) => m.Signin),
    title: 'Sign In — Registration App',
    data: { description: 'Sign in to your Registration App account.' },
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./components/signup/signup').then((m) => m.Signup),
    title: 'Create Account — Registration App',
    data: { description: 'Create a new Registration App account.' },
  },
];
