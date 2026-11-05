export interface Product {
  id: string;
  name: string;
  category: 'All' | 'Apparel' | 'Footwear' | 'Accessories' | 'Lifestyle';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  material: string;
  dimensions?: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  inStock: boolean;
  tag?: string;
  image: string;
  gallery: string[];
}

export interface CartItem {
  id: string; // unique cart item id: product.id + color + size
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimate: string;
  carrier: string;
}

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'cod';

export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cvv: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'generic';
}

export interface OrderTimelineStep {
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active?: boolean;
}

export interface CourierDriver {
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  photo: string;
  minutesAway: number;
}

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'authorized' | 'cash_on_delivery';
  orderStatus: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  currentStepIndex: number;
  tracking: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    timeline: OrderTimelineStep[];
    driver?: CourierDriver;
    driverProgressPercent: number; // 0 to 100 on the route map
  };
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  recommended: boolean;
  fitRating?: 'Runs Small' | 'True to Size' | 'Runs Large';
}

