import { Injectable, signal } from '@angular/core';
import { Category, Product } from '../data/products';
import { ApiService } from './api';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly version = signal(0);
  private readonly productsCacheKey = 'mini-shop-products-cache';

  constructor(private api: ApiService) {
    this.products.set(this.readCachedProducts());
  }

  loadProducts(
    params: Record<string, string | number | boolean | undefined> = {},
    done?: (products: Product[]) => void,
  ) {
    this.loading.set(true);
    this.error.set('');

    this.api.getProducts(params).subscribe({
      next: (response) => {
        const products = response.data.map((product) => this.api.mapProduct(product));
        this.products.set(this.mergeProducts(products));
        done?.(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar produtos da API.');
        done?.(this.filterCachedProducts(params));
        this.loading.set(false);
      },
    });
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(
          categories.map((category) => ({
            label: category.name,
            slug: category.slug,
            icon: category.icon || 'fa-solid fa-tag',
            description: category.description || 'Produtos disponíveis nesta categoria.',
          })),
        );
      },
      error: () => this.categories.set([]),
    });
  }

  findBySlug(slug: string, callback: (product?: Product, apiUnavailable?: boolean) => void) {
    const cached = this.products().find((product) => product.slug === slug);

    if (cached) {
      callback(cached, false);
    }

    this.api.getProduct(slug).subscribe({
      next: (response) => {
        const product = this.api.mapProduct(response);
        this.products.set(this.mergeProducts([product]));
        callback(product, false);
      },
      error: () => {
        if (!cached) {
          callback(undefined, true);
        }
      },
    });
  }

  upsertProduct(product: Product) {
    this.products.set(this.mergeProducts([product]));
  }

  removeProduct(productId: number) {
    const products = this.products().filter((product) => product.id !== productId);
    this.products.set(products);
    localStorage.setItem(this.productsCacheKey, JSON.stringify(products));
    this.version.update((version) => version + 1);
  }

  private mergeProducts(products: Product[]) {
    const bySlug = new Map(this.products().map((product) => [product.slug, product]));

    products.forEach((product) => bySlug.set(product.slug, product));

    const merged = Array.from(bySlug.values());
    localStorage.setItem(this.productsCacheKey, JSON.stringify(merged));
    this.version.update((version) => version + 1);

    return merged;
  }

  private readCachedProducts() {
    try {
      const products = JSON.parse(localStorage.getItem(this.productsCacheKey) ?? '[]');

      return Array.isArray(products) ? (products as Product[]) : [];
    } catch {
      return [];
    }
  }

  private filterCachedProducts(params: Record<string, string | number | boolean | undefined>) {
    let products = this.products();

    if (params['category']) {
      products = products.filter(
        (product) => this.normalize(product.category) === params['category'],
      );
    }

    if (params['search']) {
      const search = this.normalize(String(params['search']));
      products = products.filter((product) =>
        this.normalize(`${product.name} ${product.category} ${product.slug}`).includes(search),
      );
    }

    if (params['is_featured'] !== undefined) {
      products = products.filter(
        (product) => product.isBestSeller === this.toBoolean(params['is_featured']),
      );
    }

    if (params['is_new'] !== undefined) {
      products = products.filter((product) => product.isNew === this.toBoolean(params['is_new']));
    }

    return products;
  }

  private normalize(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, 'e')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private toBoolean(value: string | number | boolean | undefined) {
    return value === true || value === 'true' || value === '1' || value === 1;
  }
}
