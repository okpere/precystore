import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, Check, MessageSquare, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, shape?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.images[0] || product.image);
  const [selectedShape, setSelectedShape] = useState<string>(product.shapes ? product.shapes[0] : 'Medium Almond');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : 'S (2,5,4,6,9)');

  const handleWhatsAppBuy = () => {
    const productUrl = `${window.location.origin}/#product=${product.id}`;
    const message = encodeURIComponent(
      `Hi Clawed.by.Finbarz! I want to order press-on set:\n\n💅 *${product.name}*\nPrice: ₦${product.price.toLocaleString()}\nShape/Length: ${selectedShape}\nNail Size: ${selectedSize}\nLink: ${productUrl}`
    );
    window.open(`https://wa.me/2348022642840?text=${message}`, '_blank');
  };

  const isSoldOut = product.stockCount <= 0 || product.inStock === false || product.status === 'out_of_stock' || product.badge === 'SOLD OUT';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          padding: '0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: '#f4f4f5',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Images Gallery */}
          <div style={{ padding: '24px', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '360px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#f4f4f5' }}>
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: activeImage === img ? '2px solid var(--primary)' : '2px solid transparent'
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-purple">{product.category}</span>
                {isSoldOut ? (
                  <span className="badge badge-red">SOLD OUT</span>
                ) : (
                  product.badge && <span className="badge badge-gold">{product.badge}</span>
                )}
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                {product.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '18px' }}>
                {product.description}
              </p>

              {/* Shapes Selection */}
              {product.shapes && product.shapes.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Choose Nail Shape & Length:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {product.shapes.map((shape) => (
                      <button
                        key={shape}
                        onClick={() => setSelectedShape(shape)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-full)',
                          border: selectedShape === shape ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          background: selectedShape === shape ? 'var(--primary-light)' : '#f4f4f5',
                          color: selectedShape === shape ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Choose Nail Size:
                    </div>
                    <a href="#sizing" onClick={(e) => { e.preventDefault(); alert('PrecyNails Standard Size Guide:\nXS: 3, 6, 5, 7, 9\nS: 2, 5, 4, 6, 9\nM: 1, 4, 3, 5, 8\nL: 0, 3, 2, 4, 7'); }} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                      📏 Size Guide
                    </a>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-full)',
                          border: selectedSize === size ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          background: selectedSize === size ? 'var(--primary-light)' : '#f4f4f5',
                          color: selectedSize === size ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Included Prep Kit notice */}
              <div style={{ background: '#fffbeb', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#b38832' }}>
                <Sparkles size={18} color="var(--primary)" />
                <span>Every set includes a free <strong>Nail Prep Kit</strong> (Nail Glue, Adhesive Tabs, File & Cuticle Stick).</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.95rem',
                  opacity: isSoldOut ? 0.5 : 1,
                  cursor: isSoldOut ? 'not-allowed' : 'pointer'
                }}
                disabled={isSoldOut}
                onClick={() => {
                  if (!isSoldOut) {
                    onAddToCart(product, selectedSize, selectedShape);
                    onClose();
                  }
                }}
              >
                <ShoppingBag size={18} /> {isSoldOut ? 'Out of Stock' : 'Add Press-On Set to Cart'}
              </button>

              <button
                className="btn btn-whatsapp"
                style={{ width: '100%', padding: '11px', fontSize: '0.9rem' }}
                onClick={handleWhatsAppBuy}
              >
                <MessageSquare size={18} /> Instant Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
