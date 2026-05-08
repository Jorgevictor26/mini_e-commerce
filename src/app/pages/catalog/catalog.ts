import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { categories, Product, products } from '../../data/products';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { I18nService } from '../../services/i18n';
import { TranslatePipe } from '../../pipes/translate';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog implements OnInit {
  title = 'Produtos';
  subtitle = 'Escolha produtos selecionados com entrega rápida e pagamento facilitado.';
  products: Product[] = products;
  categories = categories;

  constructor(
    private route: ActivatedRoute,
    private cart: CartService,
    private router: Router,
    private auth: AuthService,
    private i18n: I18nService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => this.applyRoute());
    this.route.data.subscribe(() => this.applyRoute());
    this.route.queryParamMap.subscribe(() => this.applyRoute());
  }

  private applyRoute() {
    const type = this.route.snapshot.data['type'];
    const slug = this.route.snapshot.paramMap.get('slug');
    const query = this.route.snapshot.queryParamMap.get('q')?.trim() ?? '';

    if (query) {
      const normalizedQuery = this.normalize(query);

      this.title = `Resultado para "${query}"`;
      this.subtitle = 'Produtos encontrados com base no nome, categoria e características.';
      this.products = products.filter((product) => {
        const searchableText = this.normalize(`${product.name} ${product.category} ${product.slug}`);
        return searchableText.includes(normalizedQuery);
      });
      return;
    }

    if (type === 'offers') {
      this.title = 'Ofertas do dia';
      this.subtitle = 'Descontos ativos nos produtos mais procurados da MiniShop.';
      this.products = products.filter((product) => product.isOffer);
      return;
    }

    if (type === 'best-sellers') {
      this.title = 'Mais Vendidos';
      this.subtitle = 'Produtos que os clientes mais compram e recomendam.';
      this.products = products.filter((product) => product.isBestSeller);
      return;
    }

    if (type === 'new-arrivals') {
      this.title = 'Lançamentos';
      this.subtitle = 'Novidades que acabaram de chegar ao catálogo.';
      this.products = products.filter((product) => product.isNew);
      return;
    }

    if (slug) {
      const category = categories.find((item) => item.slug === slug);
      this.title = category?.label ?? 'Categoria';
      this.subtitle = category?.description ?? 'Veja os produtos disponíveis nesta categoria.';
      this.products = products.filter((product) => this.normalize(product.category) === slug);
      return;
    }

    this.title = this.i18n.translate('catalog.allProducts');
    this.subtitle = this.i18n.translate('catalog.allProductsSubtitle');
    this.products = products;
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
}
