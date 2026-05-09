import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { ApiService, CheckoutQuote } from '../../services/api';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  loading = false;
  error = '';
  couponCode = '';
  quote?: CheckoutQuote;
  paymentMethod = 'cash_on_delivery';
  form = {
    recipient_name: '',
    phone: '',
    street: '',
    city: 'Luanda',
    province: 'Luanda',
    country: 'Angola',
    reference: '',
  };

  constructor(
    public cart: CartService,
    public auth: AuthService,
    private api: ApiService,
    private router: Router
  ) {
    const user = this.auth.user();

    this.form.recipient_name = user?.name ?? '';
    this.form.phone = user?.phone ?? '';
    this.form.street = user?.address ?? '';
    this.form.city = user?.city ?? 'Luanda';
    this.form.reference = user?.reference ?? '';
    this.refreshQuote();
  }

  refreshQuote() {
    this.api.quoteCheckout({
      coupon_code: this.couponCode || undefined,
      shipping_address: this.form,
    }).subscribe({
      next: (quote) => {
        this.quote = quote;
        this.cart.quote.set(quote);
        this.error = '';
      },
      error: () => this.error = 'Cupão inválido ou não foi possível calcular o checkout.',
    });
  }

  confirmOrder() {
    this.loading = true;
    this.error = '';

    this.api.checkout({
      coupon_code: this.couponCode || undefined,
      billing_address: this.form,
      shipping_address: this.form,
      payment_method: this.paymentMethod,
      payment_provider: 'manual',
    }).subscribe({
      next: (order) => {
        this.loading = false;
        this.cart.clearLocal();
        this.router.navigate(['/tracking', order.order_number], { state: { orderId: order.id } });
      },
      error: () => {
        this.loading = false;
        this.error = 'Não foi possível confirmar o pedido. Verifique stock, cupão e dados de entrega.';
      },
    });
  }
}
