import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.css'
})
export class Tracking {
  constructor(public auth: AuthService) {}

  orderCode = 'MS-2026-0481';
  currentStep = 2;
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
}
