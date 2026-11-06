import { Product, ShippingMethod, User } from '../types/ecommerce';

export const HERO_IMAGE = '/images/hero/hero-fashion-minimal.jpg';

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
    featured: true,
    isBestSeller: true,
    image: '/images/products/product-merino-knit.jpg',
    gallery: [
      '/images/products/product-merino-knit.jpg'
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
    featured: true,
    isBestSeller: true,
    image: '/images/products/product-leather-tote.jpg',
    gallery: [
      '/images/products/product-leather-tote.jpg'
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
    featured: true,
    isNewArrival: true,
    image: '/images/products/product-minimal-sneaker.jpg',
    gallery: [
      '/images/products/product-minimal-sneaker.jpg'
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
    featured: true,
    isNewArrival: true,
    image: '/images/products/product-ceramic-mug.jpg',
    gallery: [
      '/images/products/product-ceramic-mug.jpg'
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
    isNewArrival: true,
    image: '/images/products/product-merino-knit.jpg',
    gallery: [
      '/images/products/product-merino-knit.jpg'
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
    isBestSeller: true,
    image: '/images/products/product-leather-tote.jpg',
    gallery: [
      '/images/products/product-leather-tote.jpg'
    ]
  },
  {
    id: 'prod-07',
    name: 'Tailored Pleated Virgin Wool Trouser',
    category: 'Apparel',
    price: 210,
    originalPrice: 240,
    rating: 4.89,
    reviewsCount: 88,
    description: 'Woven from fine Australian virgin wool with an architectural single pleat and relaxed straight taper. Features custom horn buttons, cotton pocket linings, and internal curtain waistband.',
    material: '100% Virgin Worsted Wool (260 GSM)',
    dimensions: 'Mid-rise with gentle taper. Standard 32" inseam with 2" let-out allowance.',
    colors: [
      { name: 'Deep Charcoal', hex: '#333333' },
      { name: 'Warm Taupe', hex: '#8c827a' }
    ],
    sizes: ['28', '30', '32', '34', '36'],
    stock: 11,
    inStock: true,
    featured: true,
    image: '/images/products/product-merino-knit.jpg',
    gallery: [
      '/images/products/product-merino-knit.jpg'
    ]
  },
  {
    id: 'prod-08',
    name: 'Solid Cast Bronze Incense Vessel',
    category: 'Lifestyle',
    price: 115,
    rating: 4.96,
    reviewsCount: 52,
    description: 'Individually sand-cast from solid untreated bronze. Left unlacquered to develop a deep, organic golden-brown patina with continuous heat and handling over the decades.',
    material: '100% Solid Sand-Cast Bronze, Felt Base Pad',
    dimensions: '12cm diameter x 4cm height. Fits standard bamboo core or solid incense.',
    colors: [
      { name: 'Raw Sand-Cast Bronze', hex: '#cd7f32' }
    ],
    sizes: ['Standard'],
    stock: 7,
    inStock: true,
    tag: 'Limited Foundry Run',
    image: '/images/products/product-ceramic-mug.jpg',
    gallery: [
      '/images/products/product-ceramic-mug.jpg'
    ]
  }
];

export const CATEGORIES_DATA = [
  {
    id: 'Apparel',
    name: 'Apparel & Knitwear',
    itemCount: '3 Essentials',
    description: 'Cashmere crewnecks, organic supima mocknecks, and pleated virgin wool trousers.',
    image: '/images/products/product-merino-knit.jpg'
  },
  {
    id: 'Accessories',
    name: 'Leather Goods',
    itemCount: '2 Essentials',
    description: 'Vegetable-tanned French calfskin totes and RFID-shielded Badalassi wallets.',
    image: '/images/products/product-leather-tote.jpg'
  },
  {
    id: 'Footwear',
    name: 'Artisanal Footwear',
    itemCount: '1 Essential',
    description: 'Strobel stitch calfskin sneakers with Italian suede mudguards and amber gum soles.',
    image: '/images/products/product-minimal-sneaker.jpg'
  },
  {
    id: 'Lifestyle',
    name: 'Objects & Ceramics',
    itemCount: '2 Essentials',
    description: 'Hand-thrown terracotta pour-overs, Scandinavian oak plates, and cast bronze vessels.',
    image: '/images/products/product-ceramic-mug.jpg'
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

export const DEMO_USER: User = {
  id: 'usr-9281',
  email: 'elena.rostova@atelier-example.com',
  firstName: 'Elena',
  lastName: 'Rostova',
  phone: '+1 (415) 890-4211',
  defaultAddress: {
    fullName: 'Elena Rostova',
    email: 'elena.rostova@atelier-example.com',
    phone: '+1 (415) 890-4211',
    street: '450 Townsend St',
    apartment: 'Suite 3B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States'
  },
  createdAt: '2025-10-14T09:00:00.000Z',
  loyaltyTier: 'Platinum Connoisseur'
};

export const DEMO_ADDRESS = DEMO_USER.defaultAddress!;
