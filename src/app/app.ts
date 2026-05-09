import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Mini_Ecommerce');

  constructor(private router: Router) {}

  get isAdminLayout() {
    return this.router.url.startsWith('/admin') || this.router.url.startsWith('/dashboard');
  }
}
