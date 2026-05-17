import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { Product } from '../../features/products/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartSubject = new BehaviorSubject<Product[]>([]);

  readonly cart$ = this.cartSubject.asObservable();

  readonly cartCount$ = this.cart$.pipe(map((items) => items.length));

  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    this.cartSubject.next([...currentCart, product]);
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }

  removeFromCart(productId: string | number): void {
    const currentCart = this.cartSubject.value;

    this.cartSubject.next(currentCart.filter((item: any) => item.id !== productId));
  }
}
