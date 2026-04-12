import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { adminGuard } from './core/guard/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component')
        .then(m => m.HomeComponent)
  },
  {
    path: 'catalogue',
    loadComponent: () =>
      import('./features/catalogue/catalogue.component')
        .then(m => m.CatalogueComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cart/cart.component')
        .then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component')
        .then(m => m.CheckoutComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes')
        .then(m => m.adminRoutes)
  },
  { path: '**', redirectTo: '' }
];