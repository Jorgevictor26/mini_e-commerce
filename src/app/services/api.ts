import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../data/products';

export interface ApiImage {
  path: string;
  is_primary?: boolean;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string | number;
  compare_price?: string | number | null;
  short_description?: string | null;
  description?: string | null;
  status?: string;
  is_featured?: boolean;
  is_new?: boolean;
  primary_image?: ApiImage | null;
  primaryImage?: ApiImage | null;
  images?: ApiImage[];
  categories?: ApiCategory[];
  inventories?: { quantity: number; reserved_quantity?: number }[];
  metadata?: { rating?: number };
}

export interface ProductWritePayload {
  name: string;
  slug?: string;
  sku?: string;
  price: number;
  compare_price?: number;
  description?: string;
  status?: string;
  is_featured?: boolean;
  is_new?: boolean;
  stock?: number;
  category_id?: number;
  category_ids?: number[];
  image_url?: string;
}

export interface ApiMutationResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiCartItem {
  id: number;
  product_id: number;
  product_variant_id?: number | null;
  quantity: number;
  unit_price: string | number;
  product: ApiProduct;
}

export interface ApiCart {
  id: number;
  currency: string;
  items: ApiCartItem[];
}

export interface CheckoutQuote {
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;
  coupon?: unknown;
}

export interface ApiOrderItem {
  product_name: string;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  subtotal: string | number;
  discount_total: string | number;
  tax_total: string | number;
  shipping_total: string | number;
  grand_total: string | number;
  created_at: string;
  items: ApiOrderItem[];
  payment?: { status: string };
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface AdminDashboard {
  stats: {
    revenue: number;
    orders: number;
    customers: number;
    products: number;
    pending_reviews: number;
  };
  orders_by_status: Record<string, number>;
  low_stock_products: ApiProduct[];
  latest_orders: ApiOrder[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = localStorage.getItem('mini-shop-api-url') ?? environment.apiBaseUrl;
  private readonly tokenKey = 'mini-shop-api-token';
  private readonly cartSessionKey = 'mini-shop-cart-session';

  constructor(private http: HttpClient) {}

  getProducts(params: Record<string, string | number | boolean | undefined> = {}) {
    return this.http.get<Paginated<ApiProduct>>(`${this.baseUrl}/products`, {
      params: this.params(params),
      headers: this.headers(),
    });
  }

  getProduct(idOrSlug: number | string) {
    return this.http.get<ApiProduct>(`${this.baseUrl}/products/${idOrSlug}`, {
      headers: this.headers(),
    });
  }

  createAdminProduct(payload: ProductWritePayload | FormData) {
    return this.http.post<ApiMutationResponse<ApiProduct>>(`${this.baseUrl}/admin/products`, payload, { headers: this.headers() });
  }

  updateAdminProduct(id: number, payload: ProductWritePayload | FormData) {
    if (payload instanceof FormData) {
      payload.set('_method', 'PATCH');

      return this.http.post<ApiMutationResponse<ApiProduct>>(`${this.baseUrl}/admin/products/${id}`, payload, { headers: this.headers() });
    }

    return this.http.patch<ApiMutationResponse<ApiProduct>>(`${this.baseUrl}/admin/products/${id}`, payload, { headers: this.headers() });
  }

  deleteAdminProduct(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/admin/products/${id}`, { headers: this.headers() });
  }

  getCategories() {
    return this.http.get<ApiCategory[]>(`${this.baseUrl}/categories`, {
      headers: this.headers(),
    });
  }

  login(email: string, password: string) {
    return this.http.post<{ user: unknown; token: string }>(`${this.baseUrl}/auth/login`, { email, password });
  }

  register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.http.post<{ user: unknown; token: string }>(`${this.baseUrl}/auth/register`, data);
  }

  me() {
    return this.http.get<unknown>(`${this.baseUrl}/auth/me`, { headers: this.headers() });
  }

  logout() {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers: this.headers() });
  }

  getCart() {
    return this.http.get<ApiCart>(`${this.baseUrl}/cart`, { headers: this.headers() });
  }

  addCartItem(productId: number, quantity: number, productVariantId?: number | null) {
    return this.http.post<ApiCartItem>(
      `${this.baseUrl}/cart/items`,
      { product_id: productId, product_variant_id: productVariantId, quantity },
      { headers: this.headers() }
    );
  }

  removeCartItem(itemId: number) {
    return this.http.delete(`${this.baseUrl}/cart/items/${itemId}`, { headers: this.headers() });
  }

  quoteCheckout(payload: unknown) {
    return this.http.post<CheckoutQuote>(`${this.baseUrl}/checkout/quote`, payload, { headers: this.headers() });
  }

  checkout(payload: unknown) {
    return this.http.post<ApiOrder>(`${this.baseUrl}/checkout`, payload, { headers: this.headers() });
  }

  getOrders(params: Record<string, string | number | boolean | undefined> = {}) {
    return this.http.get<Paginated<ApiOrder>>(`${this.baseUrl}/orders`, {
      params: this.params(params),
      headers: this.headers(),
    });
  }

  getOrder(id: number | string) {
    return this.http.get<ApiOrder>(`${this.baseUrl}/orders/${id}`, { headers: this.headers() });
  }

  getAdminDashboard() {
    return this.http.get<AdminDashboard>(`${this.baseUrl}/admin/dashboard`, { headers: this.headers() });
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  mapProduct(product: ApiProduct): Product {
    const primary = product.primary_image ?? product.primaryImage ?? product.images?.find((image) => image.is_primary) ?? product.images?.[0];
    const price = Number(product.price);
    const oldPrice = Number(product.compare_price ?? price);
    const category = product.categories?.[0]?.name ?? 'Geral';

    return {
      id: product.id,
      name: product.name,
      category,
      slug: product.slug,
      price,
      oldPrice,
      imageUrl: this.imageUrl(primary?.path),
      isFreeShipping: price >= 250,
      isOffer: oldPrice > price,
      isBestSeller: Boolean(product.is_featured),
      isNew: Boolean(product.is_new),
      rating: Number(product.metadata?.rating ?? 4.5),
    };
  }

  private headers() {
    let headers = new HttpHeaders();
    const token = localStorage.getItem(this.tokenKey);
    const cartSession = this.cartSession();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    headers = headers.set('X-Cart-Session', cartSession);

    return headers;
  }

  private params(values: Record<string, string | number | boolean | undefined>) {
    let params = new HttpParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }

  private cartSession() {
    const existing = localStorage.getItem(this.cartSessionKey);

    if (existing) {
      return existing;
    }

    const session = crypto.randomUUID();
    localStorage.setItem(this.cartSessionKey, session);

    return session;
  }

  private imageUrl(path?: string | null) {
    if (!path) {
      return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800';
    }

    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
      return path;
    }

    const apiOrigin = new URL(this.baseUrl).origin;

    return `${apiOrigin}/${path.replace(/^\/+/, '')}`;
  }
}
