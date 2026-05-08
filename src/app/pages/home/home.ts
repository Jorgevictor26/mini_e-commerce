import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Hero } from '../../components/hero/hero';
import { ProductList } from '../../components/product-list/product-list';
import { categories, products } from '../../data/products';


@Component({
  selector: 'app-home',
    standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Hero, 
    ProductList, 
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  categories = categories;
  newProducts = products.filter((product) => product.isNew).slice(0, 4);
}
