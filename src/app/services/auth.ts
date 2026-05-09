import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  reference: string;
}

export interface RegisteredUser extends User {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'mini-shop-user';
  private readonly registeredUserKey = 'mini-shop-registered-user';
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
    const registeredUser = this.getRegisteredUser();
    const user = registeredUser && registeredUser.email === email
      ? this.toPublicUser(registeredUser)
      : {
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

  register(user: RegisteredUser) {
    localStorage.setItem(this.registeredUserKey, JSON.stringify(user));
    const publicUser = this.toPublicUser(user);

    this.user.set(publicUser);
    localStorage.setItem(this.storageKey, JSON.stringify(publicUser));
  }

  recoverPassword(email: string) {
    localStorage.setItem('mini-shop-recovery-email', email);
  }

  updateUser(user: User) {
    this.user.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private getRegisteredUser(): RegisteredUser | null {
    const savedUser = localStorage.getItem(this.registeredUserKey);
    return savedUser ? JSON.parse(savedUser) : null;
  }

  private toPublicUser(user: RegisteredUser): User {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      reference: user.reference
    };
  }
}
