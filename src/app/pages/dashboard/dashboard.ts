import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { Product } from '../../data/products';
import { orders } from '../../data/orders';
import {
  AdminDashboard,
  ApiCategory,
  ApiProduct,
  ApiService,
  ProductWritePayload,
} from '../../services/api';
import { AuthService } from '../../services/auth';
import { ProductsApiService } from '../../services/products-api';

type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'customers'
  | 'analytics'
  | 'categories'
  | 'promotions'
  | 'settings';

interface AdminProduct extends Product {
  stock: number;
  status: 'Ativo' | 'Pausado' | 'Esgotado';
}

interface Customer {
  name: string;
  email: string;
  orders: number;
  spent: number;
  status: 'VIP' | 'Regular' | 'Novo';
}

interface Coupon {
  code: string;
  discount: string;
  expiresAt: string;
  status: 'Ativo' | 'Expirado';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  activeTab: AdminTab = 'overview';
  productSearch = '';
  orderSearch = '';
  selectedOrderStatus = 'Todos';
  showProductModal = false;
  editingProductId?: number;
  orders = orders;
  adminDashboard?: AdminDashboard;
  loadingDashboard = false;
  dashboardError = '';
  productFeedback = '';
  productFeedbackTone: 'success' | 'error' = 'success';
  productModalFeedback = '';
  toast = {
    visible: false,
    tone: 'success' as 'success' | 'error',
    title: '',
    message: '',
  };
  apiCategories: ApiCategory[] = [];
  selectedImageFile?: File;
  savingProduct = false;
  loadingProducts = false;
  deletingProductId?: number;
  private toastTimer?: number;

  readonly orderStatuses = ['Todos', 'Em preparação', 'Entregue', 'Saiu para entrega'];

  readonly navigation: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
    { id: 'products', label: 'Produtos', icon: 'fa-solid fa-box-open' },
    { id: 'orders', label: 'Encomendas', icon: 'fa-solid fa-truck-fast' },
    { id: 'customers', label: 'Clientes', icon: 'fa-solid fa-users' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-solid fa-chart-simple' },
    { id: 'categories', label: 'Categorias', icon: 'fa-solid fa-tags' },
    { id: 'promotions', label: 'Promoções', icon: 'fa-solid fa-ticket' },
    { id: 'settings', label: 'Configurações', icon: 'fa-solid fa-gear' },
  ];

  adminProducts: AdminProduct[] = [];

  productForm: AdminProduct = this.createEmptyProduct();

  customers: Customer[] = [
    {
      name: 'Cliente MiniShop',
      email: 'cliente@minishop.com',
      orders: 5,
      spent: 2867.8,
      status: 'VIP',
    },
    { name: 'Ana Costa', email: 'ana.costa@email.com', orders: 3, spent: 842.9, status: 'Regular' },
    {
      name: 'Miguel Paulo',
      email: 'miguel.paulo@email.com',
      orders: 1,
      spent: 399,
      status: 'Novo',
    },
    {
      name: 'Sofia Mendes',
      email: 'sofia.mendes@email.com',
      orders: 4,
      spent: 1650.5,
      status: 'VIP',
    },
  ];

  coupons: Coupon[] = [
    { code: 'MINI10', discount: '10%', expiresAt: '31/05/2026', status: 'Ativo' },
    { code: 'FRETEGRATIS', discount: 'Entrega grátis', expiresAt: '15/06/2026', status: 'Ativo' },
    { code: 'WELCOME5', discount: '5%', expiresAt: '01/05/2026', status: 'Expirado' },
  ];

  salesChart = [
    { label: 'Seg', value: 46 },
    { label: 'Ter', value: 62 },
    { label: 'Qua', value: 38 },
    { label: 'Qui', value: 74 },
    { label: 'Sex', value: 58 },
    { label: 'Sáb', value: 88 },
    { label: 'Dom', value: 70 },
  ];

  settings = {
    storeName: 'MiniShop',
    email: 'admin@minishop.com',
    currency: 'EUR',
    lowStockLimit: 10,
    autoApproveOrders: true,
  };

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private productsApi: ProductsApiService,
    private router: Router,
  ) {
    if (!this.auth.isStaff()) {
      this.router.navigate(['/conta'], { queryParams: { redirect: '/admin' } });
      return;
    }

    this.loadDashboard();
    this.loadAdminProducts();
    this.loadCategories();
  }

  get revenue() {
    return (
      this.adminDashboard?.stats.revenue ?? orders.reduce((total, order) => total + order.total, 0)
    );
  }

  get lowStockCount() {
    return (
      this.adminDashboard?.low_stock_products.length ??
      this.adminProducts.filter((product) => product.stock <= this.settings.lowStockLimit).length
    );
  }

  get activeProductsCount() {
    return (
      this.adminDashboard?.stats.products ??
      this.adminProducts.filter((product) => product.status === 'Ativo').length
    );
  }

  get ordersCount() {
    return this.adminDashboard?.stats.orders ?? this.filteredOrders.length;
  }

  get filteredProducts() {
    const search = this.productSearch.trim().toLowerCase();
    if (!search) {
      return this.adminProducts;
    }

    return this.adminProducts.filter((product) =>
      `${product.name} ${product.category} ${product.status}`.toLowerCase().includes(search),
    );
  }

  get filteredOrders() {
    const search = this.orderSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        this.selectedOrderStatus === 'Todos' || order.status === this.selectedOrderStatus;
      const matchesSearch =
        !search || `${order.code} ${order.status} ${order.date}`.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }

  get categoriesSummary() {
    return this.apiCategories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: this.adminProducts.filter((product) => product.category === category.name).length,
      icon: category.icon || 'fa-solid fa-tag',
    }));
  }

  setTab(tab: AdminTab) {
    this.activeTab = tab;
  }

  loadDashboard() {
    this.loadingDashboard = true;
    this.dashboardError = '';

    this.api.getAdminDashboard().subscribe({
      next: (dashboard) => {
        this.adminDashboard = dashboard;
        this.loadingDashboard = false;
      },
      error: () => {
        this.dashboardError =
          'Não foi possível carregar dados reais do dashboard. Confirme se entrou como admin.';
        this.loadingDashboard = false;
      },
    });
  }

  loadAdminProducts() {
    this.loadingProducts = true;

    this.api
      .getProducts({ per_page: 100 })
      .pipe(
        timeout(15000),
        finalize(() => (this.loadingProducts = false)),
      )
      .subscribe({
        next: (response) => {
          this.adminProducts = response.data.map((product) => this.toAdminProduct(product));
          response.data.forEach((product) =>
            this.productsApi.upsertProduct(this.api.mapProduct(product)),
          );
        },
        error: (error) =>
          this.showProductFeedback(
            this.apiErrorMessage(error, 'Erro ao carregar produtos da API.'),
            'error',
          ),
      });
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (categories) => (this.apiCategories = categories),
      error: () => (this.apiCategories = []),
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/conta']);
  }

  openCreateProductModal() {
    this.editingProductId = undefined;
    this.selectedImageFile = undefined;
    this.productModalFeedback = '';
    this.productForm = this.createEmptyProduct();
    this.showProductModal = true;
  }

  openEditProductModal(product: AdminProduct) {
    this.editingProductId = product.id;
    this.selectedImageFile = undefined;
    this.productModalFeedback = '';
    this.productForm = { ...product };
    this.showProductModal = true;
  }

  closeProductModal(force = false) {
    if (this.savingProduct && !force) {
      return;
    }

    this.showProductModal = false;
  }

  saveProduct() {
    if (this.savingProduct) {
      return;
    }

    if (!this.productForm.name.trim() || Number(this.productForm.price) <= 0) {
      this.showProductFeedback('Informe nome e preço válido antes de guardar.', 'error', true);
      return;
    }

    const stock = Number(this.productForm.stock);
    this.productForm.stock = stock;
    this.productForm.status = stock <= 0 ? 'Esgotado' : this.productForm.status;
    this.productFeedback = '';
    this.productModalFeedback = '';
    this.savingProduct = true;

    const payload = this.toProductPayload(this.productForm);

    if (this.editingProductId) {
      this.api
        .updateAdminProduct(this.editingProductId, payload)
        .pipe(
          timeout(20000),
          finalize(() => (this.savingProduct = false)),
        )
        .subscribe({
          next: (response) => {
            const updated = this.toAdminProduct(response.data);
            this.adminProducts = this.adminProducts.map((product) =>
              product.id === updated.id ? updated : product,
            );
            this.productsApi.upsertProduct(this.api.mapProduct(response.data));
            this.showProductFeedback('Produto atualizado com sucesso', 'success');
            this.closeProductModal(true);
            this.refreshAdminData();
          },
          error: (error) => {
            this.showProductFeedback(
              this.apiErrorMessage(error, 'Erro ao atualizar produto'),
              'error',
              true,
            );
          },
        });
      return;
    }

    this.api
      .createAdminProduct(payload)
      .pipe(
        timeout(20000),
        finalize(() => (this.savingProduct = false)),
      )
      .subscribe({
        next: (response) => {
          const created = this.toAdminProduct(response.data);
          this.adminProducts = [
            created,
            ...this.adminProducts.filter((product) => product.id !== created.id),
          ];
          this.productsApi.upsertProduct(this.api.mapProduct(response.data));
          this.showProductFeedback('Produto criado com sucesso', 'success');
          this.closeProductModal(true);
          this.refreshAdminData();
        },
        error: (error) => {
          this.showProductFeedback(
            this.apiErrorMessage(error, 'Erro ao criar produto'),
            'error',
            true,
          );
        },
      });
  }

  deleteProduct(productId: number) {
    if (this.deletingProductId) {
      return;
    }

    const product = this.adminProducts.find((item) => item.id === productId);
    const confirmed = window.confirm(`Remover "${product?.name ?? 'este produto'}" do catálogo?`);

    if (!confirmed) {
      return;
    }

    this.deletingProductId = productId;

    this.api
      .deleteAdminProduct(productId)
      .pipe(
        timeout(15000),
        finalize(() => (this.deletingProductId = undefined)),
      )
      .subscribe({
        next: () => {
          this.adminProducts = this.adminProducts.filter((item) => item.id !== productId);
          this.productsApi.removeProduct(productId);
          this.showProductFeedback('Produto removido com sucesso', 'success');
          this.refreshAdminData();
        },
        error: (error) =>
          this.showProductFeedback(this.apiErrorMessage(error, 'Erro ao remover produto'), 'error'),
      });
  }

  isDeleting(productId: number) {
    return this.deletingProductId === productId;
  }

  updateOrderStatus(orderCode: string, status: string) {
    const order = orders.find((item) => item.code === orderCode);
    if (order) {
      order.status = status;
    }
  }

  exportProductsCsv() {
    const rows = [
      ['Produto', 'Categoria', 'Preço', 'Stock', 'Estado'],
      ...this.filteredProducts.map((product) => [
        product.name,
        product.category,
        product.price.toString(),
        product.stock.toString(),
        product.status,
      ]),
    ];
    this.downloadCsv('produtos-minishop.csv', rows);
  }

  exportOrdersCsv() {
    const rows = [
      ['Pedido', 'Data', 'Estado', 'Total'],
      ...this.filteredOrders.map((order) => [
        order.code,
        order.date,
        order.status,
        order.total.toString(),
      ]),
    ];
    this.downloadCsv('encomendas-minishop.csv', rows);
  }

  exportPdf() {
    window.print();
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedImageFile = file;
    this.productForm.imageUrl = URL.createObjectURL(file);
    this.showProductFeedback(
      'Imagem selecionada. Ao guardar, será enviada para o storage.',
      'success',
      true,
    );
  }

  stockTone(product: AdminProduct) {
    if (product.stock <= 0) {
      return 'bg-red-50 text-red-700 border-red-100';
    }

    if (product.stock <= this.settings.lowStockLimit) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }

    return 'bg-green-50 text-green-700 border-green-100';
  }

  private createEmptyProduct(): AdminProduct {
    return {
      id: 0,
      name: '',
      category: this.apiCategories[0]?.name ?? 'Geral',
      slug: '',
      price: 0,
      oldPrice: 0,
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
      isFreeShipping: true,
      isOffer: false,
      isBestSeller: false,
      isNew: true,
      rating: 4.5,
      stock: 10,
      status: 'Ativo',
    };
  }

  private toAdminProduct(product: ApiProduct): AdminProduct {
    const mapped = this.api.mapProduct(product);
    const stock =
      product.inventories?.reduce(
        (total, inventory) => total + Number(inventory.quantity ?? 0),
        0,
      ) ?? 0;
    const status: AdminProduct['status'] =
      product.status === 'active' && stock > 0
        ? 'Ativo'
        : product.status === 'archived'
          ? 'Pausado'
          : stock <= 0
            ? 'Esgotado'
            : 'Pausado';

    return {
      ...mapped,
      stock,
      status,
    };
  }

  private toProductPayload(product: AdminProduct): ProductWritePayload | FormData {
    const category = this.apiCategories.find((item) => item.name === product.category);
    const payload: ProductWritePayload = {
      name: product.name,
      slug: product.slug || this.slugify(product.name),
      price: Number(product.price),
      compare_price: Number(product.oldPrice) || undefined,
      status:
        product.status === 'Ativo' ? 'active' : product.status === 'Pausado' ? 'draft' : 'active',
      is_featured: product.isBestSeller,
      is_new: product.isNew,
      stock: Number(product.stock),
      category_id: category?.id,
      category_ids: category ? [category.id] : [],
      image_url: this.selectedImageFile ? undefined : product.imageUrl,
    };

    if (!this.selectedImageFile) {
      return payload;
    }

    const formData = new FormData();
    formData.set('name', payload.name);
    formData.set('slug', payload.slug ?? '');
    formData.set('price', String(payload.price));
    formData.set('status', payload.status ?? 'active');
    formData.set('is_featured', payload.is_featured ? '1' : '0');
    formData.set('is_new', payload.is_new ? '1' : '0');
    formData.set('stock', String(payload.stock ?? 0));

    if (payload.compare_price) {
      formData.set('compare_price', String(payload.compare_price));
    }

    if (category) {
      formData.set('category_id', String(category.id));
      formData.append('category_ids[]', String(category.id));
    }

    formData.append('images[]', this.selectedImageFile);

    return formData;
  }

  dismissToast() {
    this.toast.visible = false;
  }

  private showProductFeedback(message: string, tone: 'success' | 'error', modalOnly = false) {
    this.productFeedback = message;
    this.productFeedbackTone = tone;

    if (this.showProductModal || modalOnly) {
      this.productModalFeedback = message;
    }

    if (modalOnly) {
      return;
    }

    this.toast = {
      visible: true,
      tone,
      title: tone === 'success' ? 'Operação concluída' : 'Algo não correu bem',
      message,
    };

    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
    }

    this.toastTimer = window.setTimeout(() => this.dismissToast(), 4500);
  }

  private apiErrorMessage(error: unknown, fallback: string) {
    const response = error as {
      status?: number;
      name?: string;
      error?: { message?: string; errors?: Record<string, string[]> };
    };

    if (response.name === 'TimeoutError') {
      return `${fallback}. A API demorou demasiado a responder.`;
    }

    if (response.status === 0) {
      return `${fallback}. Backend Laravel indisponível ou porta da API incorreta.`;
    }

    if (response.status === 401) {
      return `${fallback}. Sessão expirada. Entre novamente como admin.`;
    }

    if (response.status === 403) {
      return `${fallback}. O utilizador atual não tem permissões de admin.`;
    }

    const message = response.error?.message;
    const errors = response.error?.errors;

    if (errors) {
      const firstError = Object.values(errors).flat()[0];

      if (firstError) {
        return firstError;
      }
    }

    return message || fallback;
  }

  private refreshAdminData() {
    this.loadDashboard();
    this.loadAdminProducts();
  }

  private slugify(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private downloadCsv(filename: string, rows: string[][]) {
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
