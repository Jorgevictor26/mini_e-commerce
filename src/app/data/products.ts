export interface Product {
  id: number;
  name: string;
  category: string;
  slug: string;
  price: number;
  oldPrice: number;
  imageUrl: string;
  isFreeShipping: boolean;
  isOffer: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  rating: number;
}

export interface Category {
  label: string;
  slug: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  {
    label: 'Eletrônicos',
    slug: 'eletronicos',
    icon: 'fa-solid fa-mobile-screen-button',
    description: 'Smartphones, consolas, som e acessórios para o dia a dia.'
  },
  {
    label: 'Casa e Decoração',
    slug: 'casa-e-decoracao',
    icon: 'fa-solid fa-couch',
    description: 'Peças úteis e bonitas para renovar os ambientes.'
  },
  {
    label: 'Moda',
    slug: 'moda',
    icon: 'fa-solid fa-shirt',
    description: 'Looks confortáveis, atuais e fáceis de combinar.'
  },
  {
    label: 'Beleza',
    slug: 'beleza',
    icon: 'fa-solid fa-spa',
    description: 'Cuidados pessoais, perfumes e rotina de skincare.'
  },
  {
    label: 'Esportes',
    slug: 'esportes',
    icon: 'fa-solid fa-dumbbell',
    description: 'Equipamentos para treino, lazer e vida ativa.'
  },
  {
    label: 'Livros',
    slug: 'livros',
    icon: 'fa-solid fa-book-open',
    description: 'Leituras para estudo, imaginação e desenvolvimento.'
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: 'MacBook Air M2 13" - 256GB SSD',
    category: 'Informática',
    slug: 'macbook-air-m2',
    price: 1199,
    oldPrice: 1349,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
    isFreeShipping: true,
    isOffer: true,
    isBestSeller: true,
    isNew: false,
    rating: 4.9
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max 256GB',
    category: 'Eletrônicos',
    slug: 'iphone-15-pro-max',
    price: 1499.9,
    oldPrice: 1599,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800',
    isFreeShipping: true,
    isOffer: false,
    isBestSeller: true,
    isNew: true,
    rating: 4.8
  },
  {
    id: 3,
    name: 'PlayStation 5 Slim Edition',
    category: 'Eletrônicos',
    slug: 'playstation-5-slim',
    price: 449,
    oldPrice: 549,
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800',
    isFreeShipping: false,
    isOffer: true,
    isBestSeller: true,
    isNew: false,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Monitor Gamer Curved 27"',
    category: 'Informática',
    slug: 'monitor-gamer-curved-27',
    price: 299,
    oldPrice: 350,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800',
    isFreeShipping: true,
    isOffer: true,
    isBestSeller: false,
    isNew: false,
    rating: 4.6
  },
  {
    id: 5,
    name: 'Teclado Mecânico RGB Pro',
    category: 'Informática',
    slug: 'teclado-mecanico-rgb-pro',
    price: 89.9,
    oldPrice: 120,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800',
    isFreeShipping: true,
    isOffer: true,
    isBestSeller: false,
    isNew: true,
    rating: 4.5
  },
  {
    id: 6,
    name: 'Auscultadores Noise Cancelling',
    category: 'Eletrônicos',
    slug: 'auscultadores-noise-cancelling',
    price: 249,
    oldPrice: 299,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
    isFreeShipping: true,
    isOffer: true,
    isBestSeller: true,
    isNew: false,
    rating: 4.8
  },
  {
    id: 7,
    name: 'Casaco Essential Urban',
    category: 'Moda',
    slug: 'casaco-essential-urban',
    price: 74.9,
    oldPrice: 95,
    imageUrl: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=800',
    isFreeShipping: true,
    isOffer: false,
    isBestSeller: false,
    isNew: true,
    rating: 4.4
  },
  {
    id: 8,
    name: 'Candeeiro de Mesa Nordic',
    category: 'Casa e Decoração',
    slug: 'candeeiro-de-mesa-nordic',
    price: 39.9,
    oldPrice: 55,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800',
    isFreeShipping: false,
    isOffer: true,
    isBestSeller: false,
    isNew: true,
    rating: 4.3
  },
  {
    id: 9,
    name: 'Kit Skincare Glow Daily',
    category: 'Beleza',
    slug: 'kit-skincare-glow-daily',
    price: 62.5,
    oldPrice: 79.9,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800',
    isFreeShipping: true,
    isOffer: true,
    isBestSeller: true,
    isNew: false,
    rating: 4.7
  },
  {
    id: 10,
    name: 'Sapatilhas Training Flex',
    category: 'Esportes',
    slug: 'sapatilhas-training-flex',
    price: 118,
    oldPrice: 145,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
    isFreeShipping: true,
    isOffer: false,
    isBestSeller: true,
    isNew: true,
    rating: 4.6
  },
  {
    id: 11,
    name: 'Livro: Hábitos de Alta Performance',
    category: 'Livros',
    slug: 'livro-habitos-de-alta-performance',
    price: 24.9,
    oldPrice: 31,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800',
    isFreeShipping: false,
    isOffer: true,
    isBestSeller: false,
    isNew: false,
    rating: 4.5
  },
  {
    id: 12,
    name: 'Smartwatch Series 9',
    category: 'Eletrônicos',
    slug: 'smartwatch-series-9',
    price: 399,
    oldPrice: 449,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
    isFreeShipping: true,
    isOffer: false,
    isBestSeller: true,
    isNew: true,
    rating: 4.9
  }
];
