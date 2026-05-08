import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product, products } from '../../data/products';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail {
  product?: Product;
  relatedProducts: Product[] = [];
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,
    private auth: AuthService
  ) {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.product = products.find((item) => item.slug === slug);
      this.relatedProducts = products
        .filter((item) => item.slug !== slug && item.category === this.product?.category)
        .slice(0, 4);
    });
  }

  increaseQuantity() {
    this.quantity += 1;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  addToCart() {
    if (!this.product) {
      return;
    }

    this.cart.add(this.product, this.quantity);
    this.router.navigate(['/carrinho']);
  }

  buyNow() {
    if (!this.product) {
      return;
    }

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/conta'], { queryParams: { redirect: '/checkout' } });
      return;
    }

    this.cart.add(this.product, this.quantity);
    this.router.navigate(['/checkout']);
  }

  get discountPercent() {
    if (!this.product) {
      return 0;
    }

    return Math.round(((this.product.oldPrice - this.product.price) / this.product.oldPrice) * 100);
  }
}
