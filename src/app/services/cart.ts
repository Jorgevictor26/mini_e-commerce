import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../data/products';
import { ApiCart, ApiCartItem, ApiService, CheckoutQuote } from './api';

export interface CartItem extends Product {
  cartItemId?: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly quote = signal<CheckoutQuote | null>(null);

  readonly items = this.cartItems.asReadonly();
  readonly totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0)
  );
  readonly discount = computed(() => this.quote()?.discount_total ?? 0);
  readonly shipping = computed(() => this.quote()?.shipping_total ?? 0);
  readonly tax = computed(() => this.quote()?.tax_total ?? 0);
  readonly total = computed(() => this.quote()?.grand_total ?? this.subtotal() + this.shipping() + this.tax() - this.discount());

  constructor(private api: ApiService) {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.api.getCart().subscribe({
      next: (cart) => {
        this.applyCart(cart);
        this.refreshQuote();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar o carrinho.');
        this.loading.set(false);
      },
    });
  }

  add(product: Product, quantity = 1) {
    const safeQuantity = Math.max(1, quantity);
    const existingItem = this.cartItems().find((item) => item.id === product.id);
    const nextQuantity = (existingItem?.quantity ?? 0) + safeQuantity;

    this.api.addCartItem(product.id, nextQuantity).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Não foi possível adicionar o produto ao carrinho.'),
    });
  }

  increase(productId: number) {
    const item = this.cartItems().find((cartItem) => cartItem.id === productId);

    if (!item) {
      return;
    }

    this.api.addCartItem(item.id, item.quantity + 1).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Stock insuficiente ou produto indisponível.'),
    });
  }

  decrease(productId: number) {
    const item = this.cartItems().find((cartItem) => cartItem.id === productId);

    if (!item) {
      return;
    }

    if (item.quantity <= 1 && item.cartItemId) {
      this.remove(productId);
      return;
    }

    this.api.addCartItem(item.id, item.quantity - 1).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Não foi possível atualizar a quantidade.'),
    });
  }

  remove(productId: number) {
    const item = this.cartItems().find((cartItem) => cartItem.id === productId);

    if (!item?.cartItemId) {
      return;
    }

    this.api.removeCartItem(item.cartItemId).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Não foi possível remover o produto.'),
    });
  }

  refreshQuote(couponCode?: string, shippingAddress: Record<string, unknown> = {}) {
    this.api.quoteCheckout({
      coupon_code: couponCode || undefined,
      shipping_address: shippingAddress,
    }).subscribe({
      next: (quote) => this.quote.set(quote),
      error: () => this.quote.set(null),
    });
  }

  clearLocal() {
    this.cartItems.set([]);
    this.quote.set(null);
  }

  private applyCart(cart: ApiCart) {
    this.cartItems.set(cart.items.map((item) => this.mapCartItem(item)));
  }

  private mapCartItem(item: ApiCartItem): CartItem {
    const product = this.api.mapProduct(item.product);

    return {
      ...product,
      cartItemId: item.id,
      quantity: item.quantity,
      price: Number(item.unit_price),
    };
  }
}
