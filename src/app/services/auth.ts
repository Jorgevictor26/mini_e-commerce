import { Injectable, signal } from '@angular/core';
import { ApiService } from './api';

export interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  reference?: string;
  role?: string;
}

export interface RegisteredUser extends User {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'mini-shop-user';
  readonly user = signal<User | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(private api: ApiService) {
    const savedUser = localStorage.getItem(this.storageKey);

    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  isLoggedIn() {
    return this.user() !== null;
  }

  isStaff() {
    const role = this.user()?.role;

    return role === 'admin' || role === 'manager';
  }

  login(email = 'cliente@minishop.com', password = 'password', done?: () => void) {
    this.loading.set(true);
    this.error.set('');

    this.api.login(email, password || 'password').subscribe({
      next: (response) => {
        this.api.saveToken(response.token);
        this.setUser(this.toPublicUser(response.user as Record<string, unknown>));
        this.loading.set(false);
        done?.();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Credenciais inválidas ou API indisponível.');
      },
    });
  }

  register(user: RegisteredUser, done?: () => void) {
    this.loading.set(true);
    this.error.set('');

    this.api.register(user).subscribe({
      next: (response) => {
        this.api.saveToken(response.token);
        this.setUser(this.toPublicUser(response.user as Record<string, unknown>));
        this.loading.set(false);
        done?.();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Não foi possível criar a conta. Verifique os dados informados.');
      },
    });
  }

  recoverPassword(email: string) {
    localStorage.setItem('mini-shop-recovery-email', email);
  }

  updateUser(user: User) {
    this.setUser(user);
  }

  logout() {
    this.api.logout().subscribe({ error: () => undefined });
    this.api.clearToken();
    this.user.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private setUser(user: User) {
    this.user.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private toPublicUser(user: Record<string, unknown>): User {
    return {
      id: Number(user['id'] ?? 0) || undefined,
      name: String(user['name'] ?? 'Cliente MiniShop'),
      email: String(user['email'] ?? ''),
      phone: String(user['phone'] ?? ''),
      role: String(user['role'] ?? 'customer'),
      address: 'Rua principal, Talatona',
      city: 'Luanda',
      reference: 'Próximo ao centro comercial',
    };
  }
}
