import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../features/products/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, TruncatePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();
  private cartService = inject(CartService);

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
