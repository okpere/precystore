import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];

export const STORY_HIGHLIGHTS = [
  { id: '1', name: 'Nail Shapes', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Sizing Guide', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'How To Apply', image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=200&q=80' },
  { id: '4', name: 'Client Nails', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=200&q=80' },
  { id: '5', name: 'How To Pay', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80' },
];

export const COUPONS: Record<string, number> = {
  'NAILS10': 0.10, // 10% off
  'PRECYFREE': 2500, // ₦2500 off
  'GLAM20': 0.20 // 20% off
};
