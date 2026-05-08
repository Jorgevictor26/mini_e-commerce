import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>([]);

  readonly items = this.cartItems.asReadonly();
  readonly totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0)
  );
  readonly discount = computed(() => (this.subtotal() > 0 ? 25 : 0));
  readonly shipping = computed(() => 0);
  readonly total = computed(() => this.subtotal() + this.shipping() - this.discount());

  add(product: Product, quantity = 1) {
    const safeQuantity = Math.max(1, quantity);

    this.cartItems.update((items) => {
      const existingItem = items.find((item) => item.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        );
      }

      return [...items, { ...product, quantity: safeQuantity }];
    });
  }

  increase(productId: number) {
    this.cartItems.update((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  decrease(productId: number) {
    this.cartItems.update((items) =>
      items
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  remove(productId: number) {
    this.cartItems.update((items) => items.filter((item) => item.id !== productId));
  }
}
