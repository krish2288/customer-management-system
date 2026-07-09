import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/customer-management/customer-management').then(
        (component) => component.CustomerManagementComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
