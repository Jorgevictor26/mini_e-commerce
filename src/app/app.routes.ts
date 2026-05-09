import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Catalog } from './pages/catalog/catalog';
import { Cart } from './pages/cart/cart';
import { Account } from './pages/account/account';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Checkout } from './pages/checkout/checkout';
import { Tracking } from './pages/tracking/tracking';
import { Orders } from './pages/orders/orders';
import { Profile } from './pages/profile/profile';
import { Dashboard } from './pages/dashboard/dashboard';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'produtos',
        component: Catalog
    },
    {
        path: 'ofertas',
        component: Catalog,
        data: { type: 'offers' }
    },
    {
        path: 'mais-vendidos',
        component: Catalog,
        data: { type: 'best-sellers' }
    },
    {
        path: 'lancamentos',
        component: Catalog,
        data: { type: 'new-arrivals' }
    },
    {
        path: 'categoria/:slug',
        component: Catalog
    },
    {
        path: 'produto/:slug',
        component: ProductDetail
    },
    {
        path: 'conta',
        component: Account
    },
    {
        path: 'perfil',
        component: Profile
    },
    {
        path: 'carrinho',
        component: Cart
    },
    {
        path: 'pedidos',
        component: Orders
    },
    {
        path: 'checkout',
        component: Checkout
    },
    {
        path: 'tracking',
        component: Tracking
    },
    {
        path: 'tracking/:orderId',
        component: Tracking
    },
    {
        path: 'admin',
        component: Dashboard
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: '**',
        component: NotFound
    },
];
