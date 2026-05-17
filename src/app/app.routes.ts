import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/components/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/components/product-detail/product-detail').then(
        (m) => m.ProductDetail,
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/components/category-list/category-list').then(
        (m) => m.CategoryList,
      ),
  },
];
