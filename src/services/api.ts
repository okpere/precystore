// PrecyNails Backend API Client
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://precystorebackend.onrender.com/api';

export const api = {
  // Auth
  async login(email: string, password_hash: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password_hash })
    });
    return res.json();
  },

  // Products
  async getProducts() {
    const res = await fetch(`${API_BASE_URL}/products`);
    return res.json();
  },

  async createProduct(productData: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  // Orders
  async getOrders(token: string) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async createOrder(orderData: any) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  // Expenses
  async getExpenses(token: string) {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};
