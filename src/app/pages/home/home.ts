import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../../components/hero/hero';
import { ProductList } from '../../components/product-list/product-list';


@Component({
  selector: 'app-home',
    standalone: true,
  imports: [
    CommonModule, 
    Hero, 
    ProductList, 
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

