import { Product, Order, VendorUser } from '../types';

const PRODUCTS_KEY = 'precynails_products_v1';
const ORDERS_KEY = 'precynails_orders_v1';
const VENDOR_KEY = 'precynails_vendor_v1';

export const getStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed saving products to local storage', e);
  }
};

export const getStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed saving orders to local storage', e);
  }
};

export const getStoredVendorSession = (): VendorUser => {
  try {
    const data = localStorage.getItem(VENDOR_KEY);
    return data
      ? JSON.parse(data)
      : { email: '', handle: '', shopName: '', isLoggedIn: false };
  } catch (e) {
    return { email: '', handle: '', shopName: '', isLoggedIn: false };
  }
};

export const saveStoredVendorSession = (vendor: VendorUser) => {
  try {
    localStorage.setItem(VENDOR_KEY, JSON.stringify(vendor));
  } catch (e) {
    console.error('Failed saving vendor session', e);
  }
};

export const clearVendorSession = () => {
  try {
    localStorage.removeItem(VENDOR_KEY);
  } catch (e) {
    console.error('Failed clearing vendor session', e);
  }
};
