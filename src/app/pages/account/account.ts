import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

type AccountMode = 'login' | 'register' | 'recover';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
  mode: AccountMode = 'login';
  message = '';

  loginForm = {
    email: 'cliente@minishop.com',
    password: ''
  };

  registerForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    reference: ''
  };

  recoverForm = {
    email: ''
  };

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  setMode(mode: AccountMode) {
    this.mode = mode;
    this.message = '';
  }

  login() {
    this.auth.login(this.loginForm.email, this.loginForm.password || 'password', () => {
      const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? (this.auth.isStaff() ? '/admin' : '/conta');
      this.router.navigateByUrl(redirect);
    });
  }

  loginWithGoogle() {
    this.auth.login('cliente@minishop.com', 'password', () => {
      const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/conta';
      this.router.navigateByUrl(redirect);
    });
  }

  register() {
    const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/conta';

    this.auth.register({
      name: this.registerForm.name || 'Cliente MiniShop',
      email: this.registerForm.email || 'cliente@minishop.com',
      password: this.registerForm.password || 'password',
      phone: this.registerForm.phone || '+244 900 000 000',
      address: this.registerForm.address || 'Endereço não informado',
      city: this.registerForm.city || 'Luanda',
      reference: this.registerForm.reference || 'Sem referência'
    }, () => this.router.navigateByUrl(redirect));
  }

  recoverPassword() {
    this.auth.recoverPassword(this.recoverForm.email);
    this.message = 'Enviamos as instruções de recuperação para o e-mail informado.';
  }

  logout() {
    this.auth.logout();
  }
}
