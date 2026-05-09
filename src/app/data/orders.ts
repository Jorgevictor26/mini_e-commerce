export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  code: string;
  date: string;
  total: number;
  items: OrderItem[];
  status: string;
  currentStep: number;
  carrier: string;
  eta: string;
  address: string;
}

export const orders: Order[] = [
  {
    code: 'MS-2026-0481',
    date: '08/05/2026',
    total: 1948.9,
    items: [
      {
        productName: 'iPhone 15 Pro Max 256GB',
        quantity: 1,
        unitPrice: 1499.9
      },
      {
        productName: 'PlayStation 5 Slim Edition',
        quantity: 1,
        unitPrice: 449
      }
    ],
    status: 'Em preparação',
    currentStep: 2,
    carrier: 'MiniExpress',
    eta: '3 dias úteis',
    address: 'Luanda, Angola'
  },
  {
    code: 'MS-2026-0374',
    date: '02/05/2026',
    total: 399,
    items: [
      {
        productName: 'Smartwatch Series 9',
        quantity: 1,
        unitPrice: 399
      }
    ],
    status: 'Entregue',
    currentStep: 4,
    carrier: 'MiniExpress',
    eta: 'Entregue',
    address: 'Luanda, Angola'
  },
  {
    code: 'MS-2026-0290',
    date: '26/04/2026',
    total: 548,
    items: [
      {
        productName: 'Monitor Gamer Curved 27"',
        quantity: 1,
        unitPrice: 299
      },
      {
        productName: 'Auscultadores Noise Cancelling',
        quantity: 1,
        unitPrice: 249
      }
    ],
    status: 'Saiu para entrega',
    currentStep: 3,
    carrier: 'MiniExpress',
    eta: 'Hoje',
    address: 'Luanda, Angola'
  }
];
