import { Component, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Hero } from '../../components/hero/hero';
import { ProductList } from '../../components/product-list/product-list';
import { TranslatePipe } from '../../pipes/translate';
import { ProductsApiService } from '../../services/products-api';


@Component({
  selector: 'app-home',
    standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    Hero, 
    ProductList, 
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy {
  newProducts = computed(() => this.productsApi.products().filter((product) => product.isNew).slice(0, 4));
  private refreshTimer?: number;

  constructor(private productsApi: ProductsApiService) {
    this.productsApi.loadCategories();
    this.productsApi.loadProducts({ is_new: true, per_page: 4 });
    this.refreshTimer = window.setInterval(() => {
      this.productsApi.loadCategories();
      this.productsApi.loadProducts({ is_new: true, per_page: 4 });
    }, 15000);
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      window.clearInterval(this.refreshTimer);
    }
  }

  get categories() {
    return this.productsApi.categories;
  }
}
