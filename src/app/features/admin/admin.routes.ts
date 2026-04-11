import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/admin-products.component')
        .then(m => m.AdminProductsComponent)
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/admin-orders.component')
        .then(m => m.AdminOrdersComponent)
  }
];