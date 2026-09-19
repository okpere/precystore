import React, { useState } from 'react';
import { Product, Order } from '../types';
import { DollarSign, ShoppingBag, TrendingUp, Plus, Edit, Trash2, CheckCircle, Package, Truck, Receipt, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';

interface VendorAdminProps {
  products: Product[];
  orders: Order[];
  isLoading?: boolean;
  onAddProduct: (product: Product) => Promise<any> | void;
  onUpdateProduct?: (productId: string, updatedData: Partial<Product>) => Promise<any> | void;
  onDeleteProduct?: (productId: string) => Promise<any> | void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onViewInvoice: (order: Order) => void;
}

// Client-side canvas image compression to keep Base64 payloads compact (< 200KB)
const compressImage = (file: File, maxWidth = 1000, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(e.target?.result as string);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const VendorAdmin: React.FC<VendorAdminProps> = ({
  products,
  orders,
  isLoading = false,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateStock,
  onUpdateOrderStatus,
  onViewInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');
  
  // Add Product State & Loading
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Press-On Sets');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdStock, setNewProdStock] = useState('15');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdCategory, setEditProdCategory] = useState<Product['category']>('Press-On Sets');
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdStock, setEditProdStock] = useState('15');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdBadge, setEditProdBadge] = useState<string>('NEW');
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 6000);
  };

  // Expenses State
  const [expenses, setExpenses] = useState<{ id: string; title: string; amount: number; date: string }[]>([]);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');

  // Revenue & Analytics metrics (computed exclusively from real Supabase DB data)
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const profitMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showToast('error', 'Please enter a product name and price.');
      return;
    }

    setIsSavingProduct(true);
    setToast(null);

    const newProduct: Product = {
      id: 'n-' + Date.now(),
      name: newProdName,
      price: parseFloat(newProdPrice),
      category: newProdCategory,
      image: newProdImage || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      images: [newProdImage || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'],
      description: newProdDesc || 'Handcrafted luxury reusable press-on gel nail set.',
      inStock: parseInt(newProdStock) > 0,
      stockCount: parseInt(newProdStock) || 15,
      badge: parseInt(newProdStock) <= 0 ? 'SOLD OUT' : 'NEW',
      shapes: ['Short Almond', 'Medium Coffin', 'Long Stiletto'],
      sizes: ['XS (3,6,5,7,9)', 'S (2,5,4,6,9)', 'M (1,4,3,5,8)', 'L (0,3,2,4,7)']
    };

    try {
      await onAddProduct(newProduct);
      showToast('success', '✓ Press-on nail set successfully saved to Supabase!');
      setShowAddModal(false);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdDesc('');
      setNewProdImage('');
    } catch (err: any) {
      showToast('error', `❌ ${err?.message || 'Failed to save product to database'}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdPrice(prod.price.toString());
    setEditProdCategory(prod.category);
    setEditProdImage(prod.image);
    setEditProdStock(prod.stockCount.toString());
    setEditProdDesc(prod.description || '');
    setEditProdBadge(prod.badge || 'NEW');
  };

  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editProdName || !editProdPrice) {
      showToast('error', 'Please enter a product name and price.');
      return;
    }

    setIsUpdatingProduct(true);
    const stockVal = parseInt(editProdStock) || 0;
    const isSoldOut = stockVal <= 0 || editProdBadge === 'SOLD OUT';
    
    const updatedData: Partial<Product> = {
      name: editProdName,
      price: parseFloat(editProdPrice),
      category: editProdCategory,
      image: editProdImage || editingProduct.image,
      images: editProdImage ? [editProdImage] : editingProduct.images,
      description: editProdDesc,
      stockCount: stockVal,
      inStock: !isSoldOut,
      badge: isSoldOut ? 'SOLD OUT' : editProdBadge,
      status: isSoldOut ? 'out_of_stock' : 'active'
    };

    try {
      if (onUpdateProduct) {
        await onUpdateProduct(editingProduct.id, updatedData);
      }
      showToast('success', '✓ Product updated successfully in database!');
      setEditingProduct(null);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update product');
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const handleDeleteProductClick = async (prodId: string) => {
    if (window.confirm('Are you sure you want to delete this press-on nail set?')) {
      try {
        if (onDeleteProduct) {
          await onDeleteProduct(prodId);
        }
        showToast('success', '✓ Product deleted from catalog');
      } catch (err: any) {
        showToast('error', 'Failed to delete product');
      }
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    setExpenses([
      ...expenses,
      { id: Date.now().toString(), title: expTitle, amount: parseFloat(expAmount), date: 'Today' }
    ]);
    setExpTitle('');
    setExpAmount('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px', paddingBottom: '60px' }}>
      {/* Toast Notification Alert Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            background: toast.type === 'success' ? '#15803d' : '#be185d',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '480px'
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: 800, padding: '0 4px' }}
          >
            ✕
          </button>
        </div>
      )}
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Nail Studio Business Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage press-on inventory, custom orders, expenses & digital receipts.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="pill-toggle-container">
          <button
            className={`pill-toggle-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics & Expenses
          </button>
          <button
            className={`pill-toggle-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            💅 Press-On Catalog ({products.length})
          </button>
          <button
            className={`pill-toggle-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Nail Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Gross Nail Revenue</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>
                ₦{totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#db2777', fontWeight: 700 }}>Real-time database records</div>
            </div>

            <div className="card" style={{ padding: '20px', borderLeft: '4px solid #9333ea' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Completed Nail Orders</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#9333ea', margin: '8px 0' }}>
                {orders.length} orders
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Avg order value: ₦{avgOrderValue.toLocaleString()}</div>
            </div>

            <div className="card" style={{ padding: '20px', borderLeft: '4px solid #e11d48' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Studio Expenses</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e11d48', margin: '8px 0' }}>
                ₦{totalExpenses.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{expenses.length} recorded entries</div>
            </div>

            <div className="card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Net Profit Margin</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', margin: '8px 0' }}>
                ₦{netProfit.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 700 }}>Margin: {profitMarginPercent}%</div>
            </div>
          </div>

          {/* Record Expense & Expense Log */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Record New Expense Form */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--primary)" /> Record Studio Expense
              </h3>
              <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Expense Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Swarovski Crystal Charms, Packaging Boxes"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Amount (₦)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                  Save Expense Entry
                </button>
              </form>
            </div>

            {/* Expense Log Table */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Expense History Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {expenses.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic', padding: '12px 0' }}>
                    No studio expense entries recorded yet.
                  </div>
                ) : (
                  expenses.map((exp) => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f4f4f5', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{exp.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.date}</div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#e11d48', fontSize: '0.95rem' }}>
                        -₦{exp.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Press-On Nails Inventory</h3>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Add New Nail Set
            </button>
          </div>

          {/* Add Product Modal */}
          {showAddModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '28px', background: 'white' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Add Nail Set to Studio Storefront</h3>
                <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Nail Set Title *"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      placeholder="Price (₦) *"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    />
                    <input
                      type="number"
                      placeholder="Stock Count *"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    />
                  </div>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  >
                    <option value="Press-On Sets">Press-On Sets</option>
                    <option value="Nail Art">Nail Art</option>
                    <option value="Care Kits">Care Kits</option>
                    <option value="Sizing Kits">Sizing Kits</option>
                    <option value="Bundles">Bundles</option>
                  </select>
                  {/* Direct Image File Upload & URL Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      📷 Select Product Image (Upload File or Paste Link):
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressedBase64 = await compressImage(file, 1000, 0.8);
                            setNewProdImage(compressedBase64);
                          } catch (err) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProdImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: '#f4f4f5',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Or Paste Image URL link..."
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}
                    />

                    {/* Image Preview Thumbnail */}
                    {newProdImage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', background: '#fafafa', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <img
                          src={newProdImage}
                          alt="Preview"
                          style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                        <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
                          ✓ Image Optimized & Ready!
                        </span>
                      </div>
                    )}
                  </div>

                  <textarea
                    placeholder="Description..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', height: '70px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      type="button"
                      disabled={isSavingProduct}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProduct}
                      className="btn btn-primary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isSavingProduct ? 0.7 : 1 }}
                    >
                      {isSavingProduct ? (
                        <>Saving to Supabase... <Loader2 size={16} className="animate-spin" /></>
                      ) : (
                        'Save Nail Set'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {editingProduct && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Press-On Nail Set</h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSaveProductEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Product Name *</label>
                    <input
                      type="text"
                      placeholder="Nail Set Title *"
                      value={editProdName}
                      onChange={(e) => setEditProdName(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Price (₦) *</label>
                      <input
                        type="number"
                        placeholder="Price (₦) *"
                        value={editProdPrice}
                        onChange={(e) => setEditProdPrice(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Stock Count *</label>
                      <input
                        type="number"
                        placeholder="Stock Count *"
                        value={editProdStock}
                        onChange={(e) => setEditProdStock(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Category</label>
                      <select
                        value={editProdCategory}
                        onChange={(e) => setEditProdCategory(e.target.value as any)}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                      >
                        <option value="Press-On Sets">Press-On Sets</option>
                        <option value="Nail Art">Nail Art</option>
                        <option value="Care Kits">Care Kits</option>
                        <option value="Sizing Kits">Sizing Kits</option>
                        <option value="Bundles">Bundles</option>
                      </select>
                    </div>

                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Badge / Status Tag</label>
                      <select
                        value={editProdBadge}
                        onChange={(e) => setEditProdBadge(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                      >
                        <option value="NEW">NEW</option>
                        <option value="HOT">HOT 🔥</option>
                        <option value="SALE">SALE 🏷️</option>
                        <option value="BESTSELLER">BESTSELLER ⭐</option>
                        <option value="SOLD OUT">SOLD OUT 🚫</option>
                      </select>
                    </div>
                  </div>

                  {/* Direct Image Upload & URL */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      📷 Product Image (Upload File or Paste Link):
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressedBase64 = await compressImage(file, 1000, 0.8);
                            setEditProdImage(compressedBase64);
                          } catch (err) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditProdImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: '#f4f4f5',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Or Paste Image URL..."
                      value={editProdImage}
                      onChange={(e) => setEditProdImage(e.target.value)}
                      style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}
                    />

                    {/* Image Preview */}
                    {editProdImage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', background: '#fafafa', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                          <img
                            src={editProdImage}
                            alt="Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-sm)',
                              filter: (parseInt(editProdStock) <= 0 || editProdBadge === 'SOLD OUT') ? 'grayscale(70%) opacity(0.75)' : 'none'
                            }}
                          />
                          {(parseInt(editProdStock) <= 0 || editProdBadge === 'SOLD OUT') && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: 'white', background: '#e11d48', fontSize: '0.48rem', fontWeight: 900, padding: '1px 3px' }}>
                                SOLD OUT
                              </span>
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
                          ✓ Image Ready to Update!
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Description</label>
                    <textarea
                      placeholder="Description..."
                      value={editProdDesc}
                      onChange={(e) => setEditProdDesc(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', height: '70px', marginTop: '4px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      type="button"
                      disabled={isUpdatingProduct}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProduct}
                      className="btn btn-primary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isUpdatingProduct ? 0.7 : 1 }}
                    >
                      {isUpdatingProduct ? (
                        <>Updating... <Loader2 size={16} className="animate-spin" /></>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Product Table */}
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f4f4f5', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Nail Item</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px' }}>Stock Level</th>
                  <th style={{ padding: '12px 16px' }}>Actions & Adjust</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f4f4f5' }}>
                      <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '140px' }}>
                          <div className="skeleton" style={{ height: '14px', width: '100%' }} />
                          <div className="skeleton" style={{ height: '10px', width: '50%' }} />
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="skeleton" style={{ height: '14px', width: '90px' }} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="skeleton" style={{ height: '14px', width: '60px' }} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="skeleton" style={{ height: '18px', width: '70px', borderRadius: 'var(--radius-full)' }} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="skeleton" style={{ height: '24px', width: '60px' }} />
                      </td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No press-on nail sets in inventory catalog yet. Click "+ Add New Nail Set" to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    const isSoldOut = prod.stockCount <= 0 || prod.inStock === false || prod.status === 'out_of_stock' || prod.badge === 'SOLD OUT';

                    return (
                      <tr key={prod.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                        <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                            <img
                              src={prod.image}
                              alt={prod.name}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-sm)',
                                objectFit: 'cover',
                                filter: isSoldOut ? 'grayscale(70%) opacity(0.75)' : 'none'
                              }}
                            />
                            {isSoldOut && (
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.65)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'white', background: '#e11d48', fontSize: '0.48rem', fontWeight: 900, padding: '1px 3px', textTransform: 'uppercase', borderRadius: '2px' }}>
                                  SOLD OUT
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{prod.name}</div>
                            {isSoldOut ? (
                              <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>SOLD OUT</span>
                            ) : (
                              prod.badge && <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{prod.badge}</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>{prod.category}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>
                          ₦{prod.price.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${isSoldOut || prod.stockCount < 5 ? 'badge-red' : 'badge-green'}`}>
                            {isSoldOut ? 'Out of Stock' : `${prod.stockCount} sets`}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => onUpdateStock(prod.id, Math.max(0, prod.stockCount - 1))}
                              title="Decrease stock by 1"
                            >
                              -1
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => onUpdateStock(prod.id, prod.stockCount + 5)}
                              title="Increase stock by 5"
                            >
                              +5
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '5px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: '#f4f4f5' }}
                              onClick={() => handleOpenEditModal(prod)}
                              title="Edit Name, Price, Category, Image, Stock & Details"
                            >
                              <Edit size={13} /> Edit
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '5px 8px', fontSize: '0.75rem', color: '#e11d48' }}
                              onClick={() => handleDeleteProductClick(prod.id)}
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Customer Orders & Receipts</h3>
          {orders.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Package size={36} color="var(--primary)" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No nail orders placed yet!</p>
              <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>Go to the Nail Studio storefront and add a set to cart.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((ord) => (
                <div key={ord.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f4f4f5', paddingBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Order #{ord.id}</span>
                        <span className="badge badge-purple">{ord.status}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Placed on {ord.createdAt} by <strong>{ord.customerName}</strong> ({ord.customerPhone})
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={() => onViewInvoice(ord)}>
                        <Receipt size={16} /> View Digital Receipt
                      </button>
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                        style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem', fontWeight: 700 }}
                      >
                        <option value="Confirmed">Status: Confirmed</option>
                        <option value="Shipped">Status: Shipped</option>
                        <option value="Delivered">Status: Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Items: {ord.items.map((i) => `${i.product.name} (${i.selectedShape || 'Almond'}) x${i.quantity}`).join(', ')}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                        Logistics: {ord.logisticsProvider} | Addr: {ord.customerAddress}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₦{ord.total.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Via {ord.paymentMethod}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
