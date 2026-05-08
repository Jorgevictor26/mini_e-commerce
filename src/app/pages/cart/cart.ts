import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  constructor(public cart: CartService) {}

  increase(productId: number) {
    this.cart.increase(productId);
  }

  decrease(productId: number) {
    this.cart.decrease(productId);
  }

  remove(productId: number) {
    this.cart.remove(productId);
  }
}
