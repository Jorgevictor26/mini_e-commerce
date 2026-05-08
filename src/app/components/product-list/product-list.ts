import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Esta interface prepara o terreno para a sua API PHP futuramente
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  imageUrl: string;
  isFreeShipping: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  // Quando ligares ao PHP, esta lista virá de um serviço
  products: Product[] = [
    {
      id: 1,
      name: 'MacBook Air M2 13" - 256GB SSD',
      category: 'Informática',
      price: 1199.00,
      oldPrice: 1349.00,
      imageUrl:  'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600',
      isFreeShipping: true
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max 256GB',
      category: 'Eletrónicos',
      price: 1499.90,
      oldPrice: 1599.00,
      imageUrl:  'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600',
      isFreeShipping: true
    },
    {
      id: 3,
      name: 'PlayStation 5 Slim Edition',
      category: 'Eletrónicos',
      price: 449.00,
      oldPrice: 549.00,
      imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600',
      isFreeShipping: false
    },
    {
      id: 4,
      name: 'Monitor Gamer Curved 27"',
      category: 'Informática',
      price: 299.00,
      oldPrice: 350.00,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600',
      isFreeShipping: true
    },
    {
      id: 5,
      name: 'Teclado Mecânico RGB Pro',
      category: 'Informática',
      price: 89.90,
      oldPrice: 120.00,
      imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600',
      isFreeShipping: true
    },
    {
      id: 6,
      name: 'Auscultadores Noise Cancelling',
      category: 'Eletrónicos',
      price: 249.00,
      oldPrice: 299.00,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
      isFreeShipping: true
    },
    {
      id: 7,
      name: 'Placa Gráfica RTX 4070 Ti',
      category: 'Informática',
      price: 899.00,
      oldPrice: 950.00,
      imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600',
      isFreeShipping: false
    },
    {
      id: 8,
      name: 'Smartwatch Series 9',
      category: 'Eletrónicos',
      price: 399.00,
      oldPrice: 449.00,
      imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600',
      isFreeShipping: true
    }
  ];
}