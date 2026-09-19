import React from 'react';
import { Order } from '../types';
import { Printer, CheckCircle, ArrowLeft, Download, ShieldCheck, Sparkles } from 'lucide-react';

interface DigitalInvoiceProps {
  order: Order | null;
  onBackToStore: () => void;
}

export const DigitalInvoice: React.FC<DigitalInvoiceProps> = ({ order, onBackToStore }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <button
        className="btn btn-secondary"
        style={{ marginBottom: '20px' }}
        onClick={onBackToStore}
      >
        <ArrowLeft size={16} /> Back to Nail Studio
      </button>

      <div
        className="card"
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
        id="printable-receipt"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f4f4f5', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Precy<span style={{ color: 'var(--primary)' }}>Nails</span>
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Official Press-On E-Receipt & Invoice | IG: @Clawed.by.Finbarz
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Gwarinpa / Lokogoma, Abuja, Nigeria | Support: +234 802 264 2840
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '4px 12px' }}>
              ✓ NAIL ORDER CONFIRMED
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-main)' }}>
              Invoice #{order.id}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Date: {order.createdAt}
            </div>
          </div>
        </div>

        {/* Customer & Delivery details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '24px 0', background: '#fafafa', padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Customer Details:
            </h4>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{order.customerName}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Phone: {order.customerPhone}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Payment Method: <strong>{order.paymentMethod}</strong>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Shipping & Delivery:
            </h4>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>
              Provider: {order.logisticsProvider}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Address: {order.customerAddress}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Status: <strong style={{ color: 'var(--primary)' }}>Processing for Studio Dispatch</strong>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '24px 0' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 8px' }}>Press-On Set / Item</th>
              <th style={{ padding: '12px 8px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Unit Price</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f4f4f5', fontSize: '0.92rem' }}>
                <td style={{ padding: '14px 8px' }}>
                  <div style={{ fontWeight: 700 }}>{item.product.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Shape: {item.selectedShape || 'Almond'} | Size: {item.selectedSize || 'Standard'}
                  </div>
                </td>
                <td style={{ padding: '14px 8px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                <td style={{ padding: '14px 8px', textAlign: 'right' }}>₦{item.product.price.toLocaleString()}</td>
                <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: 700 }}>
                  ₦{(item.product.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Calculation */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Nails Subtotal:</span>
              <span>₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Delivery Fee ({order.logisticsProvider}):</span>
              <span>₦{order.deliveryFee.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 700 }}>
                <span>Discount ({order.couponCode || 'PROMO'}):</span>
                <span>-₦{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, borderTop: '2px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
              <span>Total Paid:</span>
              <span style={{ color: 'var(--primary)' }}>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Receipt Verification & Footer */}
        <div style={{ marginTop: '40px', borderTop: '1px dashed var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mock QR Code */}
            <div style={{ width: '60px', height: '60px', background: '#0f172a', color: 'white', padding: '6px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, textAlign: 'center' }}>
              VERIFIED NAIL RECEIPT
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Thank you for ordering with Clawed.by.Finbarz!
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Handcrafted Press-On Studio Commerce Engine
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <Printer size={16} /> Print Receipt
            </button>
            <button className="btn btn-primary" onClick={onBackToStore}>
              <CheckCircle size={16} /> Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
