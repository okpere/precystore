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
  getStoredProducts,
  saveStoredProducts,
  getStoredOrders,
  saveStoredOrders,
  getStoredVendorSession,
  saveStoredVendorSession,
  clearVendorSession
} from './services/storage';
import { api } from './services/api';
import { Lock } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('storefront');
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Vendor Auth State - Persisted session
  const [vendorUser, setVendorUser] = useState<VendorUser>(getStoredVendorSession);

  // Orders & active invoice - Persisted orders
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Sync products to local storage whenever they change
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  // Sync orders to local storage whenever they change
  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  // Sync vendor session to local storage
  useEffect(() => {
    saveStoredVendorSession(vendorUser);
  }, [vendorUser]);

  // Hash-based routing for dedicated /vendor path
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#vendor' || hash === '#admin' || window.location.pathname.startsWith('/vendor')) {
        if (vendorUser.isLoggedIn) {
          setViewMode('admin');
        } else {
          setViewMode('login');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [vendorUser.isLoggedIn]);

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
  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
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

  const handleOrderComplete = (order: Order) => {
    setOrders([order, ...orders]);
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
    window.location.hash = 'vendor';
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
      window.location.hash = 'vendor';
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

      {/* Footer with Discreet Vendor Portal Link */}
      <footer style={{ background: '#fdf2f8', borderTop: '1px solid var(--border-color)', padding: '24px 20px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            © PrecyNails Studio • Handcrafted Press-On Nails • Lagos, Nigeria
          </div>

          <div>
            <a
              href="#vendor"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'vendor';
                handleViewChange('admin');
              }}
              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Lock size={13} /> {vendorUser.isLoggedIn ? `Vendor Portal (${vendorUser.handle})` : 'Vendor / Owner Access'}
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
