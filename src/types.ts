export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Press-On Sets' | 'Nail Art' | 'Care Kits' | 'Sizing Kits' | 'Bundles';
  image: string;
  images: string[];
  description: string;
  inStock: boolean;
  stockCount: number;
  badge?: 'HOT' | 'SALE' | 'NEW' | 'BESTSELLER';
  shapes?: string[];
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShape?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'WhatsApp' | 'Card Transfer' | 'Pay on Delivery';
  logisticsProvider: 'Shipbubble' | 'Fez Delivery' | 'Store Pickup';
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  couponCode?: string;
}

export type ViewMode = 'storefront' | 'admin' | 'login' | 'invoice';

export interface VendorUser {
  email: string;
  handle: string;
  shopName: string;
  isLoggedIn: boolean;
  token?: string;
}
