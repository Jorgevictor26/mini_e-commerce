import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ApiOrder, ApiService } from '../../services/api';

interface TrackingOrder {
  id: number;
  code: string;
  status: string;
  currentStep: number;
  carrier: string;
  eta: string;
  address: string;
}

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.css'
})
export class Tracking {
  orderId = '';
  order?: TrackingOrder;
  notFound = false;
  loading = false;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
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

    this.loading = true;
    this.notFound = false;

    const navigationOrderId = history.state?.orderId;

    if (navigationOrderId) {
      this.api.getOrder(navigationOrderId).subscribe({
        next: (order) => this.setOrder(order),
        error: () => this.findOrderByNumber(orderId),
      });
      return;
    }

    this.findOrderByNumber(orderId);
  }

  private findOrderByNumber(orderNumber: string) {
    this.api.getOrders({ search: orderNumber, per_page: 50 }).subscribe({
      next: (response) => {
        const order = response.data.find((item) => item.order_number.toUpperCase() === orderNumber.toUpperCase());

        if (order) {
          this.setOrder(order);
          return;
        }

        this.loading = false;
        this.order = undefined;
        this.notFound = true;
      },
      error: () => {
        this.loading = false;
        this.order = undefined;
        this.notFound = true;
      },
    });
  }

  private setOrder(order: ApiOrder) {
    this.order = {
      id: order.id,
      code: order.order_number,
      status: order.status,
      currentStep: this.stepFromStatus(order.status),
      carrier: 'MiniShop Express',
      eta: order.status === 'delivered' ? 'Entregue' : '2 a 5 dias úteis',
      address: 'Endereço informado no checkout',
    };
    this.loading = false;
    this.notFound = false;
  }

  private stepFromStatus(status: string) {
    const steps: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      paid: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 0,
      refunded: 0,
    };

    return steps[status] ?? 0;
  }
}
