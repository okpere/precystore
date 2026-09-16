import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'n1',
    name: 'French Ombré Chrome Almond Press-Ons',
    price: 18500,
    originalPrice: 24000,
    category: 'Press-On Sets',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted 10-piece luxury gel press-on set with pearl chrome finish. Includes glue, sticky tabs, cuticle pusher, and alcohol prep pad.',
    inStock: true,
    stockCount: 14,
    badge: 'BESTSELLER',
    shapes: ['Short Almond', 'Medium Almond', 'Long Coffin', 'Stiletto'],
    sizes: ['XS (3,6,5,7,9)', 'S (2,5,4,6,9)', 'M (1,4,3,5,8)', 'L (0,3,2,4,7)']
  },
  {
    id: 'n2',
    name: 'Glitz 3D Crystal & Pearl Coffin Set',
    price: 26000,
    originalPrice: 32000,
    category: 'Press-On Sets',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-glam festival nails embedded with genuine Swarovski crystals and micro-pearl charms. Double gel layer sealed.',
    inStock: true,
    stockCount: 8,
    badge: 'HOT',
    shapes: ['Long Coffin', 'Medium Coffin', 'Extra Long Stiletto'],
    sizes: ['XS (3,6,5,7,9)', 'S (2,5,4,6,9)', 'M (1,4,3,5,8)', 'L (0,3,2,4,7)']
  },
  {
    id: 'n3',
    name: 'Velvet Rose Gold Cat-Eye Gel Nails',
    price: 21000,
    originalPrice: 27000,
    category: 'Press-On Sets',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Magnetic rose gold cat-eye shimmer that reflects light at every angle. reusable up to 5 times with proper care.',
    inStock: true,
    stockCount: 19,
    badge: 'NEW',
    shapes: ['Medium Almond', 'Short Square', 'Medium Coffin'],
    sizes: ['XS (3,6,5,7,9)', 'S (2,5,4,6,9)', 'M (1,4,3,5,8)', 'L (0,3,2,4,7)']
  },
  {
    id: 'n4',
    name: '3D Butterfly & Gold Foil Accent Charms',
    price: 7500,
    originalPrice: 10000,
    category: 'Nail Art',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Set of 20 metallic gold 3D alloy butterfly charms & iridescent gold foil flakes for DIY press-on customization.',
    inStock: true,
    stockCount: 30,
    badge: 'SALE',
    shapes: ['Universal Fit'],
    sizes: ['One Size']
  },
  {
    id: 'n5',
    name: 'Organic Cuticle Serum & Glass File Kit',
    price: 9500,
    category: 'Care Kits',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Jojoba & Vitamin E cuticle oil applicator pen, tempered nano glass shine file, and 48-piece waterproof adhesive tape tabs.',
    inStock: true,
    stockCount: 22,
    badge: 'BESTSELLER',
    shapes: ['Kit Fit'],
    sizes: ['Standard Kit']
  },
  {
    id: 'n6',
    name: 'Perfect Match Sizing Kit & Super Bond Glue',
    price: 4500,
    category: 'Sizing Kits',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Clear sizing sample card for all nail shapes (0-9) to find your exact nail size before ordering custom press-on sets.',
    inStock: true,
    stockCount: 50,
    badge: 'NEW',
    shapes: ['Sample Card'],
    sizes: ['All Sizes Included']
  }
];

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
