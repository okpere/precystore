import React, { useState } from 'react';
import { Product } from '../types';
import { STORY_HIGHLIGHTS } from '../data/mockData';
import { CheckCircle2, ShoppingBag, Eye, Star, Search, Sparkles, MessageSquare, Heart } from 'lucide-react';

interface StorefrontProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Press-On Sets', 'Nail Art', 'Care Kits', 'Sizing Kits', 'Bundles'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* IG Vendor Hero Banner - Rose Gold & Velvet Magenta Gradient */}
      <div
        style={{
          background: 'linear-gradient(135deg, #831843 0%, #db2777 50%, #ec4899 100%)',
          color: 'white',
          padding: '28px 16px',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          marginBottom: '20px',
          boxShadow: '0 12px 32px rgba(219, 39, 119, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow Sparkle Background Overlay */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
          
          {/* Main Vendor Info Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div className="story-ring" style={{ flexShrink: 0 }}>
                <img
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=300&q=80"
                  alt="PrecyNails Studio"
                  className="story-avatar hero-avatar"
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Username & Verified Tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.2 }} className="hero-title">
                    @precynails.ng
                  </h1>
                  <CheckCircle2 size={18} color="#ec4899" fill="#ec4899" style={{ color: 'white', flexShrink: 0 }} />
                  <span className="badge" style={{ fontSize: '0.65rem', padding: '2px 8px', background: '#fbcfe8', color: '#831843', flexShrink: 0 }}>
                    ✨ VERIFIED NAIL STUDIO
                  </span>
                </div>

                {/* Tagline / Bio */}
                <p style={{ color: '#fbcfe8', fontSize: '0.84rem', marginTop: '6px', lineHeight: 1.4 }}>
                  Handcrafted Reusable Press-On Nails & Gel Nail Art | 📍 Ikeja, Lagos | 🚚 Same Day Delivery
                </p>

                {/* Instagram Profile Metrics */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '0.78rem', color: '#f3e8ff', flexWrap: 'wrap' }}>
                  <span><strong>3,120</strong> sets sold</span>
                  <span><strong>42.8k</strong> followers</span>
                  <span><strong>4.95 ★</strong> (2.4k+ reviews)</span>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Action Button */}
            <a
              href="https://wa.me/2348000000000?text=Hi%20PrecyNails!%20I%20want%20to%20order%20custom%20press-on%20nails"
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
              style={{
                textDecoration: 'none',
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)'
              }}
            >
              <MessageSquare size={18} /> Order Custom Press-Ons on WhatsApp
            </a>
          </div>

          {/* Search Input Bar */}
          {/* <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#fbcfe8' }} />
            <input
              type="text"
              placeholder="Search French almond, chrome, glitter, sizing kit..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(251,207,232,0.3)',
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                fontSize: '0.88rem',
                outline: 'none',
                backdropFilter: 'blur(8px)'
              }}
            />
          </div> */}

          {/* Instagram Story Highlights */}
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {STORY_HIGHLIGHTS.map((story) => (
              <div key={story.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer', flexShrink: 0 }}>
                <div className="story-ring">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="story-avatar"
                    style={{ width: '58px', height: '58px', objectFit: 'cover' }}
                  />
                </div>
                <span style={{ fontSize: '0.74rem', color: '#fdf2f8', fontWeight: 600 }}>{story.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Catalog Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', width: '100%', maxWidth: '100%' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pill-toggle-btn ${selectedCategory === cat ? 'active' : ''}`}
                style={{
                  background: selectedCategory === cat ? 'var(--primary)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  flexShrink: 0
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="card" style={{ padding: '36px 20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No press-on nail sets found matching "{searchQuery}"</p>
            <button className="btn btn-secondary" style={{ marginTop: '14px', fontSize: '0.85rem' }} onClick={() => { onSearchChange(''); setSelectedCategory('All'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px'
            }}
            className="product-responsive-grid"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card animate-fade-in"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Product Badge */}
                {product.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      zIndex: 10
                    }}
                  >
                    <span
                      className={`badge ${
                        product.badge === 'HOT'
                          ? 'badge-red'
                          : product.badge === 'SALE'
                          ? 'badge-gold'
                          : product.badge === 'BESTSELLER'
                          ? 'badge-purple'
                          : 'badge-green'
                      }`}
                      style={{ fontSize: '0.65rem', padding: '2px 6px' }}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Stock Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 10,
                    background: 'rgba(15,23,42,0.75)',
                    color: '#fbcfe8',
                    backdropFilter: 'blur(4px)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.65rem',
                    fontWeight: 600
                  }}
                >
                  {product.stockCount} left
                </div>

                {/* Product Image */}
                <div
                  style={{
                    height: '210px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    background: '#fdf2f8'
                  }}
                  className="product-img-container"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                      {product.category}
                    </div>
                    <h3
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        margin: '3px 0 6px 0',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        lineHeight: 1.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                      onClick={() => onSelectProduct(product)}
                    >
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₦{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₦{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '6px 4px', fontSize: '0.75rem' }}
                      onClick={() => onSelectProduct(product)}
                    >
                      <Eye size={13} /> View
                    </button>

                    <button
                      className="btn btn-primary"
                      style={{ flex: 1.2, padding: '6px 4px', fontSize: '0.75rem' }}
                      onClick={() => onAddToCart(product)}
                    >
                      <ShoppingBag size={13} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
