import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, categories, products } from '../../data/products';
import { orders } from '../../data/orders';

type AdminTab = 'overview' | 'products' | 'orders' | 'customers' | 'analytics' | 'categories' | 'promotions' | 'settings';

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
  imports: [CommonModule, FormsModule],
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

  adminProducts: AdminProduct[] = products.map((product, index) => ({
    ...product,
    stock: [24, 8, 0, 16, 42, 11, 19, 5, 31, 14, 53, 7][index] ?? 10,
    status: ([24, 8, 0, 16, 42, 11, 19, 5, 31, 14, 53, 7][index] ?? 10) === 0 ? 'Esgotado' : 'Ativo',
  }));

  productForm: AdminProduct = this.createEmptyProduct();

  customers: Customer[] = [
    { name: 'Cliente MiniShop', email: 'cliente@minishop.com', orders: 5, spent: 2867.8, status: 'VIP' },
    { name: 'Ana Costa', email: 'ana.costa@email.com', orders: 3, spent: 842.9, status: 'Regular' },
    { name: 'Miguel Paulo', email: 'miguel.paulo@email.com', orders: 1, spent: 399, status: 'Novo' },
    { name: 'Sofia Mendes', email: 'sofia.mendes@email.com', orders: 4, spent: 1650.5, status: 'VIP' },
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

  get revenue() {
    return orders.reduce((total, order) => total + order.total, 0);
  }

  get lowStockCount() {
    return this.adminProducts.filter((product) => product.stock <= this.settings.lowStockLimit).length;
  }

  get activeProductsCount() {
    return this.adminProducts.filter((product) => product.status === 'Ativo').length;
  }

  get filteredProducts() {
    const search = this.productSearch.trim().toLowerCase();
    if (!search) {
      return this.adminProducts;
    }

    return this.adminProducts.filter((product) =>
      `${product.name} ${product.category} ${product.status}`.toLowerCase().includes(search)
    );
  }

  get filteredOrders() {
    const search = this.orderSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = this.selectedOrderStatus === 'Todos' || order.status === this.selectedOrderStatus;
      const matchesSearch = !search || `${order.code} ${order.status} ${order.date}`.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }

  get categoriesSummary() {
    return categories.map((category) => ({
      name: category.label,
      products: this.adminProducts.filter((product) => product.category === category.label).length,
      icon: category.icon,
    }));
  }

  setTab(tab: AdminTab) {
    this.activeTab = tab;
  }

  openCreateProductModal() {
    this.editingProductId = undefined;
    this.productForm = this.createEmptyProduct();
    this.showProductModal = true;
  }

  openEditProductModal(product: AdminProduct) {
    this.editingProductId = product.id;
    this.productForm = { ...product };
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
  }

  saveProduct() {
    const stock = Number(this.productForm.stock);
    this.productForm.stock = stock;
    this.productForm.status = stock <= 0 ? 'Esgotado' : this.productForm.status;

    if (this.editingProductId) {
      this.adminProducts = this.adminProducts.map((product) =>
        product.id === this.editingProductId ? { ...this.productForm } : product
      );
    } else {
      this.adminProducts = [{ ...this.productForm, id: Date.now() }, ...this.adminProducts];
    }

    this.closeProductModal();
  }

  deleteProduct(productId: number) {
    this.adminProducts = this.adminProducts.filter((product) => product.id !== productId);
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
      ...this.filteredOrders.map((order) => [order.code, order.date, order.status, order.total.toString()]),
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

    const reader = new FileReader();
    reader.onload = () => {
      this.productForm.imageUrl = String(reader.result);
    };
    reader.readAsDataURL(file);
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
      category: categories[0]?.label ?? 'Geral',
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

  private downloadCsv(filename: string, rows: string[][]) {
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
