import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})

export class ProductList {
  // Dados mockados (estáticos) para o front-end
  products = [
    {
      id: 1,
      name: 'MacBook Air M2 13" - 256GB SSD',
      category: 'Informática',
      price: 1199.00,
      oldPrice: 1349.00,
      imageUrl: 'https://m.media-amazon.com/images/I/719C6bJv8jL._AC_SL1500_.jpg',
      isFreeShipping: true
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max 256GB Titânio',
      category: 'Telemóveis',
      price: 1499.90,
      oldPrice: 1599.00,
      imageUrl: 'https://m.media-amazon.com/images/I/81Os13RBOnL._AC_SL1500_.jpg',
      isFreeShipping: true
    },
    {
      id: 3,
      name: 'Sony PlayStation 5 Slim',
      category: 'Consolas',
      price: 449.00,
      oldPrice: 549.00,
      imageUrl: 'https://m.media-amazon.com/images/I/510uTH7TofL._AC_SL1200_.jpg',
      isFreeShipping: false
    },
    {
      id: 4,
      name: 'Monitor Gamer 27" 165Hz 1ms',
      category: 'Monitores',
      price: 299.00,
      oldPrice: 350.00,
      imageUrl: 'https://m.media-amazon.com/images/I/81mZk8RNoML._AC_SL1500_.jpg',
      isFreeShipping: true
    }
  ];
}