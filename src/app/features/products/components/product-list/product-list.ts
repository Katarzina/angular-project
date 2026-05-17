import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { SearchInput } from '../../../../shared/components/search-input/search-input';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, SearchInput, LoadingSpinner],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  allProducts = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.productService.getProducts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.products.set(data);
        this.filteredProducts.set(data);
        this.allProducts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  onSearch(query: string): void {
    const q = query.toLowerCase();
    this.filteredProducts.set(this.allProducts().filter((p) => p.title.toLowerCase().includes(q)));
  }
}
