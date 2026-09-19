import { Product, Order, VendorUser } from '../types';

const VENDOR_KEY = 'Clawed.by.Finbarz_vendor_v1';

// Deprecated local storage methods - return empty arrays to force pulling strictly from API / Supabase
export const getStoredProducts = (): Product[] => [];
export const saveStoredProducts = (_products: Product[]) => {
  try {
    localStorage.removeItem('Clawed.by.Finbarz_products_v1');
  } catch (e) {
    // ignore
  }
};

export const getStoredOrders = (): Order[] => [];
export const saveStoredOrders = (_orders: Order[]) => {
  try {
    localStorage.removeItem('Clawed.by.Finbarz_orders_v1');
  } catch (e) {
    // ignore
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
