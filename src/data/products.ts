import { Product, ShippingMethod } from '../types/ecommerce';

export const HERO_IMAGE = '/src/assets/images/hero_fashion_minimal_1793895538299.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Merino Cashmere Ribbed Crewneck',
    category: 'Apparel',
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 128,
    description: 'Spun from Grade-A Mongolian cashmere and extra-fine Australian merino wool. Designed with a seamless fisherman rib knit that holds structure while delivering cloud-soft warmth against the skin.',
    material: '70% Ultra-fine Merino Wool, 30% Mongolian Cashmere',
    dimensions: 'Relaxed tailored fit. True to size.',
    colors: [
      { name: 'Oatmeal Heather', hex: '#e3dec3' },
      { name: 'Charcoal Black', hex: '#262626' },
      { name: 'Raw Natural', hex: '#f4f1ea' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 14,
    inStock: true,
    tag: 'Best Seller',
    image: '/src/assets/images/product_merino_knit_1793895538092.jpg',
    gallery: [
      '/src/assets/images/product_merino_knit_1793895538092.jpg'
    ]
  },
  {
    id: 'prod-02',
    name: 'Atelier Structured Calfskin Tote',
    category: 'Accessories',
    price: 340,
    originalPrice: 380,
    rating: 4.95,
    reviewsCount: 94,
    description: 'Handcrafted in Tuscany from full-grain vegetable-tanned French calfskin. Features reinforced dual top handles, solid brushed brass hardware, and a dedicated magnetic laptop slip pocket.',
    material: '100% Vegetable-Tanned French Calfskin, Solid Brass Hardware',
    dimensions: '38cm W x 32cm H x 14cm D. Fits up to 15" MacBook Pro.',
    colors: [
      { name: 'Caramel Saddle', hex: '#a25927' },
      { name: 'Espresso Brown', hex: '#3d251e' },
      { name: 'Matte Noir', hex: '#1c1917' }
    ],
    sizes: ['One Size'],
    stock: 6,
    inStock: true,
    tag: 'Handcrafted',
    image: '/src/assets/images/product_leather_tote_1793895539192.jpg',
    gallery: [
      '/src/assets/images/product_leather_tote_1793895539192.jpg'
    ]
  },
  {
    id: 'prod-03',
    name: 'Studio Raw Suede Low Sneaker',
    category: 'Footwear',
    price: 195,
    rating: 4.85,
    reviewsCount: 162,
    description: 'Constructed using traditional Strobel stitch construction. Features premium Italian calfskin leather with tactile suede mudguard panels and a natural amber gum rubber outsole for traction.',
    material: 'Italian Calfskin Leather, Italian Calf Suede, Natural Rubber',
    dimensions: 'Cushioned memory foam footbed. Fits true to European sizing.',
    colors: [
      { name: 'Chalk & Taupe', hex: '#d1cfc7' },
      { name: 'Stone White', hex: '#f5f5f4' },
      { name: 'Ash Grey', hex: '#78716c' }
    ],
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
    stock: 9,
    inStock: true,
    tag: 'New Release',
    image: '/src/assets/images/product_minimal_sneaker_1793895540209.jpg',
    gallery: [
      '/src/assets/images/product_minimal_sneaker_1793895540209.jpg'
    ]
  },
  {
    id: 'prod-04',
    name: 'Artisanal Terracotta Pour-Over Set',
    category: 'Lifestyle',
    price: 78,
    originalPrice: 90,
    rating: 4.88,
    reviewsCount: 79,
    description: 'Wheel-thrown porous red clay finished with a food-safe matte interior glaze. Retains optimal brewing heat for uniform extraction, paired with an oiled FSC-certified Scandinavian oak drip plate.',
    material: 'Fired Red Terracotta Clay, FSC Solid Oak Wood',
    dimensions: 'Mug: 350ml capacity. Dripper: Standard #02 cone filters.',
    colors: [
      { name: 'Raw Terracotta', hex: '#b85d3b' },
      { name: 'Sandstone Grey', hex: '#a8a29e' }
    ],
    sizes: ['Standard Set'],
    stock: 22,
    inStock: true,
    tag: 'Artisan Batch',
    image: '/src/assets/images/product_ceramic_mug_1793895540226.jpg',
    gallery: [
      '/src/assets/images/product_ceramic_mug_1793895540226.jpg'
    ]
  },
  {
    id: 'prod-05',
    name: 'Heavyweight Supima Cotton Mockneck',
    category: 'Apparel',
    price: 95,
    rating: 4.78,
    reviewsCount: 110,
    description: 'Knitted from long-staple California Supima cotton at 280 GSM. A structured silhouette that resists warping over years of washing with a clean 1.5-inch mockneck collar.',
    material: '100% Organic Supima Cotton (280 GSM)',
    dimensions: 'Boxy streetwear cut with subtle drop shoulder.',
    colors: [
      { name: 'Bone White', hex: '#f5f5f0' },
      { name: 'Washed Black', hex: '#292524' },
      { name: 'Sage Olive', hex: '#576249' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 18,
    inStock: true,
    image: '/src/assets/images/product_merino_knit_1793895538092.jpg',
    gallery: [
      '/src/assets/images/product_merino_knit_1793895538092.jpg'
    ]
  },
  {
    id: 'prod-06',
    name: 'Minimalist Bifold Card Wallet',
    category: 'Accessories',
    price: 68,
    rating: 4.92,
    reviewsCount: 145,
    description: 'Precision cut from 1.2mm vegetable tanned Badalassi Carlo leather. Six RFID-shielded card slots with a central cash sleeve that patinas beautifully with daily pocket use.',
    material: 'Full-Grain Italian Badalassi Pueblo Leather',
    dimensions: '10.2cm x 7.6cm x 0.6cm ultra-slim profile.',
    colors: [
      { name: 'Cognac Tan', hex: '#9a5327' },
      { name: 'Midnight Blue', hex: '#1e293b' },
      { name: 'Deep Forest', hex: '#233827' }
    ],
    sizes: ['One Size'],
    stock: 12,
    inStock: true,
    image: '/src/assets/images/product_leather_tote_1793895539192.jpg',
    gallery: [
      '/src/assets/images/product_leather_tote_1793895539192.jpg'
    ]
  }
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ship-standard',
    name: 'Standard Carbon-Neutral',
    price: 0,
    estimate: '3–5 business days',
    carrier: 'DHL EcoFreight'
  },
  {
    id: 'ship-express',
    name: 'Priority Courier Express',
    price: 12,
    estimate: '1–2 business days',
    carrier: 'FedEx Express'
  },
  {
    id: 'ship-same-day',
    name: 'Same-Day Metro Courier',
    price: 24,
    estimate: 'Today (Within 3 Hours)',
    carrier: 'Atelier Local Fleet'
  }
];

export const DEMO_ADDRESS = {
  fullName: 'Elena Rostova',
  email: 'elena.rostova@atelier-example.com',
  phone: '+1 (415) 890-4211',
  street: '450 Townsend St',
  apartment: 'Suite 3B',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94107',
  country: 'United States'
};
