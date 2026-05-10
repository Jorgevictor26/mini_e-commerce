import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../data/products';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { I18nService } from '../../services/i18n';
import { TranslatePipe } from '../../pipes/translate';
import { ProductsApiService } from '../../services/products-api';
import { combineLatest, distinctUntilChanged, map, Subscription } from 'rxjs';

interface CatalogRouteState {
  type?: string;
  slug: string | null;
  query: string;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit, OnDestroy {
  title = 'Produtos';
  subtitle = 'Escolha produtos selecionados com entrega rápida e pagamento facilitado.';
  products: Product[] = [];
  loadingProducts = false;
  private refreshTimer?: number;
  private routeSubscription?: Subscription;
  private requestVersion = 0;

  constructor(
    private route: ActivatedRoute,
    private cart: CartService,
    private router: Router,
    private auth: AuthService,
    private i18n: I18nService,
    private productsApi: ProductsApiService,
  ) {}

  ngOnInit() {
    this.productsApi.loadCategories();
    this.routeSubscription = combineLatest([
      this.route.data,
      this.route.paramMap,
      this.route.queryParamMap,
    ])
      .pipe(
        map(([data, paramMap, queryParamMap]) => ({
          type: data['type'],
          slug: paramMap.get('slug'),
          query: queryParamMap.get('q')?.trim() ?? '',
        })),
        distinctUntilChanged(
          (previous, current) =>
            previous.type === current.type &&
            previous.slug === current.slug &&
            previous.query === current.query,
        ),
      )
      .subscribe((state) => this.applyRoute(state));
    this.refreshTimer = window.setInterval(() => this.applyRoute(), 15000);
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();

    if (this.refreshTimer) {
      window.clearInterval(this.refreshTimer);
    }
  }

  private applyRoute(state: CatalogRouteState = this.currentRouteState()) {
    const version = ++this.requestVersion;
    const { type, slug, query } = state;
    this.loadingProducts = true;
    this.products = [];

    if (query) {
      const normalizedQuery = this.normalize(query);

      this.title = `Resultado para "${query}"`;
      this.subtitle = 'Produtos encontrados com base no nome, categoria e características.';
      this.productsApi.loadProducts({ search: query, per_page: 48 }, (items) => {
        if (version !== this.requestVersion) {
          return;
        }

        this.products = items.filter((product) =>
          this.normalize(`${product.name} ${product.category} ${product.slug}`).includes(
            normalizedQuery,
          ),
        );
        this.loadingProducts = false;
      });
      return;
    }

    if (type === 'offers') {
      this.title = 'Ofertas do dia';
      this.subtitle = 'Descontos ativos nos produtos mais procurados da MiniShop.';
      this.productsApi.loadProducts({ per_page: 48 }, (items) => {
        if (version === this.requestVersion) {
          this.products = items.filter((product) => product.isOffer);
          this.loadingProducts = false;
        }
      });
      return;
    }

    if (type === 'best-sellers') {
      this.title = 'Mais Vendidos';
      this.subtitle = 'Produtos que os clientes mais compram e recomendam.';
      this.productsApi.loadProducts({ is_featured: true, per_page: 48 }, (items) => {
        if (version === this.requestVersion) {
          this.products = items;
          this.loadingProducts = false;
        }
      });
      return;
    }

    if (type === 'new-arrivals') {
      this.title = 'Lançamentos';
      this.subtitle = 'Novidades que acabaram de chegar ao catálogo.';
      this.productsApi.loadProducts({ is_new: true, per_page: 48 }, (items) => {
        if (version === this.requestVersion) {
          this.products = items;
          this.loadingProducts = false;
        }
      });
      return;
    }

    if (slug) {
      const category = this.productsApi.categories().find((item) => item.slug === slug);
      this.title = category?.label ?? 'Categoria';
      this.subtitle = category?.description ?? 'Veja os produtos disponíveis nesta categoria.';
      this.productsApi.loadProducts({ category: slug, per_page: 48 }, (items) => {
        if (version === this.requestVersion) {
          this.products = this.productsForCategory(items, slug);
          this.loadingProducts = false;
        }
      });
      return;
    }

    this.title = this.i18n.translate('catalog.allProducts');
    this.subtitle = this.i18n.translate('catalog.allProductsSubtitle');
    this.productsApi.loadProducts({ per_page: 48 }, (items) => {
      if (version === this.requestVersion) {
        this.products = items;
        this.loadingProducts = false;
      }
    });
  }

  private productsForCategory(items: Product[], slug: string) {
    const fromApi = items.filter((product) => this.normalize(product.category) === slug);

    if (fromApi.length || items.length === 0) {
      return fromApi;
    }

    return items;
  }

  private currentRouteState(): CatalogRouteState {
    return {
      type: this.route.snapshot.data['type'],
      slug: this.route.snapshot.paramMap.get('slug'),
      query: this.route.snapshot.queryParamMap.get('q')?.trim() ?? '',
    };
  }

  private normalize(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, 'e')
      .replace(/\s+/g, '-');
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

  get categories() {
    return this.productsApi.categories;
  }
}
