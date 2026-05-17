import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, catchError, of } from 'rxjs';
import { ProductService } from '../../../products/services/product';
import { Product } from '../../../products/models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-category-list',
  imports: [ProductCard, LoadingSpinner],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly categorySelected$ = new Subject<string>();

  categories = signal<string[]>([]);
  products = signal<Product[]>([]);
  selectedCategory = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.productService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.categories.set(data);
          if (data.length > 0) {
            this.selectCategory(data[0]);
          }
        },
        error: (err) => this.error.set(err.message),
      });

    // switchMap cancels the previous HTTP request if a new category is selected before it completes
    this.categorySelected$
      .pipe(
        switchMap((category) => {
          this.loading.set(true);
          this.error.set(null);
          return this.productService.getProductsByCategory(category).pipe(
            catchError((err) => {
              this.error.set(err.message);
              return of([]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((products) => {
        this.products.set(products);
        this.loading.set(false);
      });
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.categorySelected$.next(category);
  }
}
