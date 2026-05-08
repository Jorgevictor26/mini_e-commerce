import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para o *ngFor
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { ThemeService } from '../../services/theme';
import { AuthService } from '../../services/auth';
import { I18nService, Language } from '../../services/i18n';
import { TranslatePipe } from '../../pipes/translate';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  searchTerm = '';
  isAccountMenuOpen = false;

  constructor(
    public cart: CartService,
    public theme: ThemeService,
    public auth: AuthService,
    public i18n: I18nService,
    private router: Router
  ) {}

  menuLinks = [
    { labelKey: 'nav.offers', url: '/ofertas' },
    { labelKey: 'nav.bestSellers', url: '/mais-vendidos' },
    { labelKey: 'nav.newArrivals', url: '/lancamentos' },
    { labelKey: 'nav.electronics', url: '/categoria/eletronicos' },
    { labelKey: 'nav.homeDecor', url: '/categoria/casa-e-decoracao' },
    { labelKey: 'nav.fashion', url: '/categoria/moda' },
    { labelKey: 'nav.beauty', url: '/categoria/beleza' },
    { labelKey: 'nav.sports', url: '/categoria/esportes' },
    { labelKey: 'nav.books', url: '/categoria/livros' }
  ];

  languages: { label: string; value: Language }[] = [
    { label: '🇵🇹 PT', value: 'pt' },
    { label: '🇬🇧 EN', value: 'en' },
    { label: '🇫🇷 FR', value: 'fr' }
  ];

  search() {
    const query = this.searchTerm.trim();

    this.router.navigate(['/produtos'], {
      queryParams: query ? { q: query } : {}
    });
  }

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  closeAccountMenu() {
    this.isAccountMenuOpen = false;
  }

  logout() {
    this.auth.logout();
    this.closeAccountMenu();
    this.router.navigate(['/']);
  }

  changeLanguage(language: string) {
    this.i18n.setLanguage(language as Language);
  }
}
