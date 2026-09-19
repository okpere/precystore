import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, ViewMode, VendorUser } from './types';
import { Navbar } from './components/Navbar';
import { Storefront } from './components/Storefront';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { DigitalInvoice } from './components/DigitalInvoice';
import { VendorAdmin } from './components/VendorAdmin';
import { VendorLogin } from './components/VendorLogin';
import {
  getStoredVendorSession,
  saveStoredVendorSession,
  clearVendorSession
} from './services/storage';
import { api } from './services/api';
import { Lock } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('storefront');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Vendor Auth State - Persisted session
  const [vendorUser, setVendorUser] = useState<VendorUser>(getStoredVendorSession);

  // Orders & active invoice
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Clear any old local storage product/order caches on startup
  useEffect(() => {
    try {
      localStorage.removeItem('ClawsbyFinbars_products_v1');
      localStorage.removeItem('ClawsbyFinbars_orders_v1');
    } catch (e) {
      // ignore
    }
  }, []);

  // Load products directly from Backend API / Supabase database on mount
  useEffect(() => {
    async function loadApiProducts() {
      setIsLoadingProducts(true);
      try {
        const fetched = await api.getProducts();
        if (Array.isArray(fetched)) {
          setProducts(fetched);
        }
      } catch (err) {
        console.error('Error fetching products from API:', err);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    loadApiProducts();
  }, []);

  // Load orders directly from Backend API / Supabase database when logged in
  useEffect(() => {
    async function loadApiOrders() {
      if (!vendorUser.isLoggedIn) return;
      try {
        const fetched = await api.getOrders(vendorUser.token);
        if (Array.isArray(fetched)) {
          setOrders(fetched);
        }
      } catch (err) {
        console.error('Error fetching orders from API:', err);
      }
    }
    loadApiOrders();
  }, [vendorUser.isLoggedIn, vendorUser.token]);

  // Sync vendor session to local storage
  useEffect(() => {
    saveStoredVendorSession(vendorUser);
  }, [vendorUser]);

  // Route handling for /adminvendor and deep links (#order=ORD-xxx, #product=xxx)
  useEffect(() => {
    const handleRouteChange = async () => {
      const hash = window.location.hash;
      const path = window.location.pathname.toLowerCase();

      // 1. Order Deep Link (#order=ORD-xxx, #invoice=ORD-xxx)
      let orderIdParam = '';
      if (hash.startsWith('#order=')) orderIdParam = hash.replace('#order=', '');
      else if (hash.startsWith('#invoice=')) orderIdParam = hash.replace('#invoice=', '');
      else {
        const searchParams = new URLSearchParams(window.location.search);
        orderIdParam = searchParams.get('order') || searchParams.get('invoice') || '';
      }

      if (orderIdParam) {
        const existingOrder = orders.find((o) => o.id.toLowerCase() === orderIdParam.toLowerCase());
        if (existingOrder) {
          setActiveInvoiceOrder(existingOrder);
          setViewMode('invoice');
          return;
        } else {
          try {
            const fetchedOrder = await api.getOrderById(orderIdParam);
            if (fetchedOrder && fetchedOrder.id) {
              setActiveInvoiceOrder(fetchedOrder);
              setViewMode('invoice');
              return;
            }
          } catch (e) {
            console.error('Error fetching deep linked order:', e);
          }
        }
      }

      // 2. Product Deep Link (#product=xxx)
      if (hash.startsWith('#product=')) {
        const prodId = hash.replace('#product=', '');
        const existingProd = products.find((p) => p.id === prodId);
        if (existingProd) {
          setSelectedProduct(existingProd);
        } else {
          try {
            const fetchedProd = await api.getProductById(prodId);
            if (fetchedProd && fetchedProd.id) {
              setSelectedProduct(fetchedProd);
            }
          } catch (e) {
            console.error('Error fetching deep linked product:', e);
          }
        }
      }

      // 3. Admin Vendor Route (/adminvendor)
      if (
        hash.toLowerCase() === '#adminvendor' ||
        hash.toLowerCase() === '#vendor' ||
        hash.toLowerCase() === '#admin' ||
        path.startsWith('/adminvendor') ||
        path.startsWith('/vendor')
      ) {
        if (vendorUser.isLoggedIn) {
          setViewMode('admin');
        } else {
          setViewMode('login');
        }
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [vendorUser.isLoggedIn, orders, products]);

  // Cart operations
  const handleAddToCart = (product: Product, size?: string, shape?: string) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedShape === shape
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === size && item.selectedShape === shape
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedShape: shape }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Vendor Admin Operations
  const handleAddProduct = async (newProduct: Product) => {
    try {
      const created = await api.createProduct(newProduct, vendorUser.token);
      const savedProd = (created && created.id) ? created : newProduct;
      setProducts((prev) => [savedProd, ...prev]);
      return savedProd;
    } catch (err: any) {
      console.error('Failed API product creation:', err);
      throw err;
    }
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleOrderComplete = async (order: Order) => {
    try {
      await api.createOrder(order);
    } catch (err) {
      console.error('Failed creating order in Supabase:', err);
    }
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setActiveInvoiceOrder(order);
    setViewMode('invoice');
  };

  const handleViewInvoice = (order: Order) => {
    setActiveInvoiceOrder(order);
    setViewMode('invoice');
  };

  const handleLoginSuccess = (user: VendorUser) => {
    setVendorUser(user);
    window.location.hash = 'adminvendor';
    setViewMode('admin');
  };

  const handleLogout = () => {
    clearVendorSession();
    setVendorUser({ email: '', handle: '', shopName: '', isLoggedIn: false });
    window.location.hash = '';
    setViewMode('storefront');
  };

  const handleViewChange = (view: ViewMode) => {
    if (view === 'admin' && !vendorUser.isLoggedIn) {
      window.location.hash = 'adminvendor';
      setViewMode('login');
    } else {
      if (view === 'storefront') window.location.hash = '';
      setViewMode(view);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentView={viewMode}
        onViewChange={handleViewChange}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vendorUser={vendorUser}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {viewMode === 'storefront' && (
          <Storefront
            products={products}
            isLoading={isLoadingProducts}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {viewMode === 'admin' && (
          vendorUser.isLoggedIn ? (
            <VendorAdmin
              products={products}
              orders={orders}
              isLoading={isLoadingProducts}
              onAddProduct={handleAddProduct}
              onUpdateStock={handleUpdateStock}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onViewInvoice={handleViewInvoice}
            />
          ) : (
            <VendorLogin
              onLoginSuccess={handleLoginSuccess}
              onGoToStorefront={() => { window.location.hash = ''; setViewMode('storefront'); }}
            />
          )
        )}

        {viewMode === 'login' && (
          <VendorLogin
            onLoginSuccess={handleLoginSuccess}
            onGoToStorefront={() => { window.location.hash = ''; setViewMode('storefront'); }}
          />
        )}

        {viewMode === 'invoice' && (
          <DigitalInvoice
            order={activeInvoiceOrder}
            onBackToStore={() => setViewMode('storefront')}
          />
        )}
      </main>

      {/* Footer with Centered Copyright and Discreet Admin Portal Link */}
      <footer style={{ background: '#fafafa', borderTop: '1px solid var(--border-color)', padding: '24px 20px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', textAlign: 'center' }}>
          <div>
            © ClawsbyFinbars Studio • Handcrafted Press-On Nails • Gwarinpa / Lokogoma, Abuja, Nigeria
          </div>

          <div>
            <a
              href="/adminvendor"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'adminvendor';
                handleViewChange('admin');
              }}
              style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: 0.85 }}
            >
            </a>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
}
