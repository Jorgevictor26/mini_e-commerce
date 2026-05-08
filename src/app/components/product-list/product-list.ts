import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product, products } from '../../data/products';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  @Input() title = 'Mais Vendidos';
  @Input() showHeaderLink = true;
  @Input() products: Product[] = products.filter((product) => product.isBestSeller);

  constructor(
    private cart: CartService,
    private router: Router,
    private auth: AuthService
  ) {}

  addToCart(product: Product) {
    this.cart.add(product);
  }

  buyNow(product: Product) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/conta'], { queryParams: { redirect: '/checkout' } });
      return;
    }

    this.cart.add(product);
    this.router.navigate(['/checkout']);
  }
}
