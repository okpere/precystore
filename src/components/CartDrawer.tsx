import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { COUPONS } from '../data/mockData';
import { X, Trash2, Plus, Minus, Tag, Truck, ArrowRight, CheckCircle, CreditCard, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOrderComplete: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number }>({ code: '', amount: 0 });
  const [couponError, setCouponError] = useState('');
  const [logistics, setLogistics] = useState<'Shipbubble' | 'Fez Delivery' | 'Store Pickup'>('Shipbubble');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'WhatsApp' | 'Card Transfer'>('WhatsApp');
  const [formError, setFormError] = useState('');

  // Delivery pricing map
  const deliveryFees = {
    Shipbubble: 2500,
    'Fez Delivery': 3000,
    'Store Pickup': 0
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryFees[logistics];
  const total = Math.max(0, subtotal + deliveryFee - appliedDiscount.amount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (COUPONS[code] !== undefined) {
      const val = COUPONS[code];
      let discountVal = 0;
      if (val < 1) {
        discountVal = Math.round(subtotal * val);
      } else {
        discountVal = val;
      }
      setAppliedDiscount({ code, amount: discountVal });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setCouponError('Invalid coupon code. Try NAILS10 or PRECYFREE');
    }
  };

  const handleCheckout = () => {
    if (!customerName || !customerPhone || (logistics !== 'Store Pickup' && !customerAddress)) {
      setFormError('Please fill in your name, phone, and delivery address.');
      return;
    }
    setFormError('');

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      customerName,
      customerPhone,
      customerAddress: customerAddress || 'Studio Pickup (Ikeja Plaza)',
      items: [...cartItems],
      subtotal,
      deliveryFee,
      discount: appliedDiscount.amount,
      total,
      paymentMethod,
      logisticsProvider: logistics,
      status: 'Confirmed',
      couponCode: appliedDiscount.code
    };

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

    if (paymentMethod === 'WhatsApp') {
      const itemList = cartItems
        .map((i) => `• 💅 *${i.product.name}*\n   Shape/Length: ${i.selectedShape || 'Almond'}\n   Size: ${i.selectedSize || 'Standard'}\n   Qty: x${i.quantity} = ₦${(i.product.price * i.quantity).toLocaleString()}`)
        .join('\n\n');

      const orderPageUrl = `${window.location.origin}/#order=${newOrder.id}`;

      const waMsg = encodeURIComponent(
        `💅 *NEW PRESS-ON NAIL ORDER - PRECY NAILS*\nOrder Ref: #${newOrder.id}\n\n*Order Items:*\n${itemList}\n\nSubtotal: ₦${subtotal.toLocaleString()}\nLogistics (${logistics}): ₦${deliveryFee.toLocaleString()}\nDiscount: -₦${appliedDiscount.amount.toLocaleString()}\n*Total Amount: ₦${total.toLocaleString()}*\n\n*Customer Info:*\nName: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\n\n🔗 *View Digital Receipt & Order Page:*\n${orderPageUrl}`
      );
      window.open(`https://wa.me/2348022642840?text=${waMsg}`, '_blank');
    }

    onOrderComplete(newOrder);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '100vh',
          background: 'white',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>Your Press-On Cart</h3>
            <span className="badge badge-gold">{cartItems.length} items</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Sparkles size={40} color="var(--primary)" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Your nail cart is empty!</p>
              <p style={{ fontSize: '0.88rem', marginTop: '8px' }}>Explore our handmade press-on nail sets & care kits.</p>
              <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={onClose}>
                Explore Nail Sets
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: '#ffffff'
                  }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.2 }}>{item.product.name}</h4>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      Shape: {item.selectedShape || 'Almond'} | Size: {item.selectedSize || 'Standard'}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      style={{ background: 'transparent', border: 'none', color: '#e11d48', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f4f4f5', borderRadius: 'var(--radius-sm)', padding: '2px 6px' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Engine */}
              <div style={{ background: '#fafafa', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                  <Tag size={16} color="var(--primary)" /> Have a Nail Promo Code?
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. NAILS10 or PRECYFREE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textTransform: 'uppercase' }}
                  />
                  <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={handleApplyCoupon}>
                    Apply
                  </button>
                </div>
                {appliedDiscount.amount > 0 && (
                  <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, marginTop: '6px' }}>
                    ✓ Applied {appliedDiscount.code}: -₦{appliedDiscount.amount.toLocaleString()} off!
                  </div>
                )}
                {couponError && <div style={{ color: '#e11d48', fontSize: '0.78rem', marginTop: '4px' }}>{couponError}</div>}
              </div>

              {/* Delivery Logistics */}
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                  <Truck size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Select Delivery Logistics:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {(['Shipbubble', 'Fez Delivery', 'Store Pickup'] as const).map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setLogistics(prov)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 'var(--radius-sm)',
                        border: logistics === prov ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: logistics === prov ? 'var(--primary-light)' : 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div>{prov}</div>
                      <div style={{ color: 'var(--primary)', marginTop: '2px' }}>
                        {deliveryFees[prov] === 0 ? 'FREE' : `₦${deliveryFees[prov].toLocaleString()}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details Form */}
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Customer Delivery Details</h4>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp / Phone Number *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
                {logistics !== 'Store Pickup' && (
                  <textarea
                    placeholder="Full Delivery Address (Street, City, State) *"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', height: '60px' }}
                  />
                )}

                {/* Payment Option */}
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>Checkout Option:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setPaymentMethod('WhatsApp')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'WhatsApp' ? '2px solid #25d366' : '1px solid var(--border-color)',
                      background: paymentMethod === 'WhatsApp' ? '#e8fdf0' : 'white',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    💬 Direct WhatsApp Order
                  </button>
                  <button
                    onClick={() => setPaymentMethod('Card Transfer')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'Card Transfer' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: paymentMethod === 'Card Transfer' ? 'var(--primary-light)' : 'white',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    💳 Instant Card / Transfer
                  </button>
                </div>

                {formError && <div style={{ color: '#e11d48', fontSize: '0.8rem', fontWeight: 600 }}>{formError}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculation */}
        {cartItems.length > 0 && (
          <div style={{ padding: '18px 20px', borderTop: '1px solid var(--border-color)', background: '#fafafa' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Nails Subtotal:</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Delivery ({logistics}):</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              {appliedDiscount.amount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 700 }}>
                  <span>Discount ({appliedDiscount.code}):</span>
                  <span>-₦{appliedDiscount.amount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--primary)' }}>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              className={`btn ${paymentMethod === 'WhatsApp' ? 'btn-whatsapp' : 'btn-primary'}`}
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
              onClick={handleCheckout}
            >
              {paymentMethod === 'WhatsApp' ? (
                <>
                  <MessageSquare size={20} /> Complete Order on WhatsApp
                </>
              ) : (
                <>
                  <CreditCard size={20} /> Pay ₦{total.toLocaleString()} Now & Print Receipt
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
