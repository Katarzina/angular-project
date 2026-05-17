import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, LoadingSpinner],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  private destroyRef = inject(DestroyRef);

  error = signal<string | null>(null);
  product = signal<Product | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService
      .getProduct(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.product.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
