import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Order, orders } from '../../data/orders';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.css'
})
export class Tracking {
  orderId = '';
  order?: Order;
  notFound = false;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      const orderId = params.get('orderId') ?? '';
      this.orderId = orderId;
      this.findOrder(orderId);
    });
  }

  steps = [
    {
      title: 'Pedido confirmado',
      description: 'Recebemos a sua compra e enviamos a confirmação.',
      icon: 'fa-solid fa-circle-check'
    },
    {
      title: 'Pagamento aprovado',
      description: 'O pagamento foi validado com sucesso.',
      icon: 'fa-solid fa-credit-card'
    },
    {
      title: 'Em preparação',
      description: 'A equipa está separando os produtos no armazém.',
      icon: 'fa-solid fa-box-open'
    },
    {
      title: 'Saiu para entrega',
      description: 'A transportadora já recebeu o pedido.',
      icon: 'fa-solid fa-truck-fast'
    },
    {
      title: 'Entregue',
      description: 'Pedido entregue no endereço informado.',
      icon: 'fa-solid fa-house-circle-check'
    }
  ];

  searchOrder() {
    const normalizedOrderId = this.orderId.trim().toUpperCase();

    if (!normalizedOrderId) {
      this.order = undefined;
      this.notFound = false;
      return;
    }

    this.router.navigate(['/tracking', normalizedOrderId]);
  }

  private findOrder(orderId: string) {
    if (!orderId) {
      this.order = undefined;
      this.notFound = false;
      return;
    }

    this.order = orders.find((order) => order.code.toUpperCase() === orderId.toUpperCase());
    this.notFound = !this.order;
  }
}
