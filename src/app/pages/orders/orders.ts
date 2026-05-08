import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
  constructor(public auth: AuthService) {}

  orders = [
    {
      code: 'MS-2026-0481',
      date: '08/05/2026',
      total: 1948.9,
      status: 'Em preparação',
      currentStep: 2
    },
    {
      code: 'MS-2026-0374',
      date: '02/05/2026',
      total: 399,
      status: 'Entregue',
      currentStep: 4
    }
  ];

  steps = ['Confirmado', 'Pago', 'Preparação', 'Entrega', 'Entregue'];
}
