import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../data/products';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { ProductsApiService } from '../../services/products-api';

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
  loading = true;
  apiUnavailable = false;
  private requestVersion = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,
    private auth: AuthService,
    private productsApi: ProductsApiService
  ) {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (!slug) {
        return;
      }

      const version = ++this.requestVersion;
      this.loading = true;
      this.product = undefined;
      this.relatedProducts = [];
      this.apiUnavailable = false;
      this.productsApi.findBySlug(slug, (product, apiUnavailable = false) => {
        if (version !== this.requestVersion) {
          return;
        }

        this.product = product;
        this.loading = false;
        this.apiUnavailable = apiUnavailable;

        if (!product) {
          return;
        }

        this.productsApi.loadProducts({ search: product?.category ?? '', per_page: 8 }, (items) => {
          if (version !== this.requestVersion) {
            return;
          }

          this.relatedProducts = items
            .filter((item) => item.slug !== slug && item.category === this.product?.category)
            .slice(0, 4);
        });
      });
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
