import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ApiOrder, ApiService } from '../../services/api';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
  orders: ApiOrder[] = [];
  loading = false;
  error = '';

  constructor(
    public auth: AuthService,
    private api: ApiService
  ) {
    this.loadOrders();
  }

  loadOrders() {
    if (!this.auth.isLoggedIn()) {
      return;
    }

    this.loading = true;
    this.api.getOrders({ per_page: 50 }).subscribe({
      next: (response) => {
        this.orders = response.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar pedidos.';
        this.loading = false;
      },
    });
  }

  total(order: ApiOrder) {
    return Number(order.grand_total);
  }

  date(order: ApiOrder) {
    return new Date(order.created_at).toLocaleDateString('pt-AO');
  }
}
