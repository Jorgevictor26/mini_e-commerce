import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para o *ngFor
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { ThemeService } from '../../services/theme';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  constructor(
    public cart: CartService,
    public theme: ThemeService,
    public auth: AuthService
  ) {}

  menuLinks = [
    { label: 'Ofertas do dia', url: '/ofertas' },
    { label: 'Mais Vendidos', url: '/mais-vendidos' },
    { label: 'Lançamentos', url: '/lancamentos' },
    { label: 'Eletrônicos', url: '/categoria/eletronicos' },
    { label: 'Casa e Decoração', url: '/categoria/casa-e-decoracao' },
    { label: 'Moda', url: '/categoria/moda' },
    { label: 'Beleza', url: '/categoria/beleza' },
    { label: 'Esportes', url: '/categoria/esportes' },
    { label: 'Livros', url: '/categoria/livros' }
  ];
}
