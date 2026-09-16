import React, { useState } from 'react';
import { ShoppingBag, LayoutDashboard, Store, LogOut, Search, Menu, X, Sparkles } from 'lucide-react';
import { ViewMode, VendorUser } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  vendorUser: VendorUser;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  vendorUser,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNavClick = (view: ViewMode) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 40 }} className="glass-panel">
        {/* Top Announcement Bar */}
        <div style={{ background: '#18181b', color: '#fefce8', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid #ca9e44' }}>
          ✨ Handcrafted Reusable Press-On Nails | 🚚 Same Day Abuja Dispatch & Nationwide Delivery!
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => handleMobileNavClick('storefront')}>
            <div className="story-ring" style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
              <div style={{ background: '#18181b', borderRadius: '50%', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                <Sparkles size={18} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)', lineHeight: 1.1 }}>
                Precy<span style={{ color: 'var(--primary)' }}>Nails</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Press-On Studio
              </div>
            </div>
          </div>

          {/* Desktop Search Bar (Only visible in storefront view on desktop) */}
          {currentView === 'storefront' && (
            <div className="md-search" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search French almond, chrome, glitter, sizing kit..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 14px 8px 38px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: '#fdf2f8',
                  transition: 'border 0.2s ease'
                }}
              />
            </div>
          )}

          {/* Desktop Navigation Links */}
          <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onViewChange('storefront')}
              className={`btn ${currentView === 'storefront' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <Store size={16} />
              <span>Nail Studio</span>
            </button>

            {/* ONLY visible if vendor is logged in */}
            {vendorUser.isLoggedIn && (
              <>
                <button
                  onClick={() => onViewChange('admin')}
                  className={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <LayoutDashboard size={16} />
                  <span>Vendor Portal</span>
                </button>
                <button
                  onClick={onLogout}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.82rem', color: '#e11d48' }}
                  title="Sign Out Vendor"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              style={{
                position: 'relative',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                border: 'none',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px'
              }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#e11d48',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(225, 29, 72, 0.4)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls: Cart & Hamburger Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-menu-btn">
            <button
              onClick={onOpenCart}
              style={{
                position: 'relative',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                border: 'none',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#e11d48',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: '#fdf2f8',
                border: '1px solid var(--border-color)',
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Panel */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-dropdown animate-fade-in"
            style={{
              background: 'white',
              borderTop: '1px solid var(--border-color)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <button
              onClick={() => handleMobileNavClick('storefront')}
              className={`btn ${currentView === 'storefront' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <Store size={18} />
              <span>Nail Studio Storefront</span>
            </button>

            {/* ONLY visible if vendor is logged in */}
            {vendorUser.isLoggedIn && (
              <>
                <button
                  onClick={() => handleMobileNavClick('admin')}
                  className={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
                >
                  <LayoutDashboard size={18} />
                  <span>Vendor Portal Dashboard ({vendorUser.handle})</span>
                </button>
                <button
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', color: '#e11d48' }}
                >
                  <LogOut size={18} />
                  <span>Sign Out Vendor</span>
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* App-Style Fixed Mobile Bottom Navigation Bar */}
      <nav
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '8px 0 10px 0',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
        }}
      >
        <button
          onClick={() => onViewChange('storefront')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: currentView === 'storefront' ? 'var(--primary)' : 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: currentView === 'storefront' ? 800 : 500,
            cursor: 'pointer'
          }}
        >
          <Store size={20} color={currentView === 'storefront' ? 'var(--primary)' : 'var(--text-muted)'} />
          <span>Nails</span>
        </button>

        {/* ONLY visible if vendor is logged in */}
        {vendorUser.isLoggedIn && (
          <button
            onClick={() => onViewChange('admin')}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              color: currentView === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: currentView === 'admin' ? 800 : 500,
              cursor: 'pointer'
            }}
          >
            <LayoutDashboard size={20} color={currentView === 'admin' ? 'var(--primary)' : 'var(--text-muted)'} />
            <span>Portal</span>
          </button>
        )}

        <button
          onClick={onOpenCart}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 500,
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '12px',
                background: '#e11d48',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.62rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cartCount}
            </span>
          )}
          <span>Cart</span>
        </button>
      </nav>
    </>
  );
};
