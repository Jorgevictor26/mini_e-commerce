import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para o *ngFor
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  menuLinks = [
    { label: 'Ofertas do dia', url: '#' },
    { label: 'Mais Vendidos', url: '#' },
    { label: 'Lançamentos', url: '#' },
    { label: 'Eletrônicos', url: '#' },
    { label: 'Casa e Decoração', url: '#' },
    { label: 'Moda', url: '#' },
    { label: 'Beleza', url: '#' },
    { label: 'Esportes', url: '#' },
    { label: 'Livros', url: '#' }
  ];
}