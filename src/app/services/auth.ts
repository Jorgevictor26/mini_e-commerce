import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  reference: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'mini-shop-user';
  readonly user = signal<User | null>(null);

  constructor() {
    const savedUser = localStorage.getItem(this.storageKey);

    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  isLoggedIn() {
    return this.user() !== null;
  }

  login(email = 'cliente@minishop.com') {
    const user = {
      name: 'Cliente MiniShop',
      email,
      phone: '+244 900 000 000',
      address: 'Rua principal, Talatona',
      city: 'Luanda',
      reference: 'Próximo ao centro comercial'
    };

    this.user.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  updateUser(user: User) {
    this.user.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem(this.storageKey);
  }
}
