import { Component, effect, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../data/products';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { TranslatePipe } from '../../pipes/translate';
import { ProductsApiService } from '../../services/products-api';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit, OnDestroy {
  @Input() title = 'Mais Vendidos';
  @Input() showHeaderLink = true;
  @Input() products: Product[] = [];
  @Input() autoLoad = true;
  private refreshTimer?: number;
  private loadedFromApi = false;

  constructor(
    private cart: CartService,
    private router: Router,
    private auth: AuthService,
    private productsApi: ProductsApiService,
  ) {
    effect(() => {
      this.productsApi.version();

      if (!this.loadedFromApi) {
        return;
      }

      this.products = this.productsApi
        .products()
        .filter((product) => product.isBestSeller)
        .slice(0, 8);
    });
  }

  ngOnInit() {
    if (!this.autoLoad || this.products.length) {
      return;
    }

    this.loadFeatured();
    this.refreshTimer = window.setInterval(() => this.loadFeatured(), 15000);
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      window.clearInterval(this.refreshTimer);
    }
  }

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

  private loadFeatured() {
    this.productsApi.loadProducts({ is_featured: true, per_page: 8 }, (products) => {
      this.loadedFromApi = true;
      this.products = products;
    });
  }
}
