// PrecyNails Single-Seller Backend API Client
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://precystorebackend.onrender.com/api';

export const api = {
  // Admin Authentication
  async login(email: string, password_hash: string) {
    const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password_hash, password: password_hash })
    });
    return res.json();
  },

  async register(email: string, password: string, shopName?: string, handle?: string) {
    const res = await fetch(`${API_BASE_URL}/auth/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, shopName, handle })
    });
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_BASE_URL}/auth/admin/logout`, { method: 'POST' });
    return res.json();
  },

  // Public Product Catalog
  async getProducts(params?: { category?: string; search?: string }) {
    let url = `${API_BASE_URL}/products`;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.append('category', params.category);
      if (params.search) searchParams.append('search', params.search);
      url += `?${searchParams.toString()}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  async getProductById(id: string) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return res.json();
  },

  // Admin Product Management
  async createProduct(productData: any, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(productData)
    });

    if (!res.ok) {
      if (res.status === 413) {
        throw new Error('Image size is too large (413 Payload Too Large). Please choose a smaller photo or compress it before uploading.');
      }
      const errorText = await res.text();
      let errorJson;
      try { errorJson = JSON.parse(errorText); } catch(e) {}
      throw new Error(errorJson?.error || errorJson?.message || `Failed to create product (HTTP ${res.status})`);
    }

    return res.json();
  },

  async updateProduct(id: string, productData: any, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productData)
    });

    if (!res.ok) {
      if (res.status === 413) {
        throw new Error('Image size is too large (413 Payload Too Large).');
      }
      throw new Error(`Failed to update product (HTTP ${res.status})`);
    }

    return res.json();
  },

  async deleteProduct(id: string, token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!res.ok) {
      throw new Error(`Failed to delete product (HTTP ${res.status})`);
    }

    return res.json();
  },

  // Orders API
  async getOrders(token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/orders`, { headers });
    if (!res.ok) return [];
    return res.json();
  },

  async createOrder(orderData: any) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (!res.ok) {
      throw new Error(`Failed to place order (HTTP ${res.status})`);
    }

    return res.json();
  }
};
