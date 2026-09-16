import React, { useState } from 'react';
import { Instagram, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Store, KeyRound, Sparkles } from 'lucide-react';
import { VendorUser } from '../types';
import confetti from 'canvas-confetti';

interface VendorLoginProps {
  onLoginSuccess: (vendor: VendorUser) => void;
  onGoToStorefront: () => void;
}

export const VendorLogin: React.FC<VendorLoginProps> = ({ onLoginSuccess, onGoToStorefront }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailOrHandle, setEmailOrHandle] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrHandle || !password) {
      setErrorMsg('Please enter your email/handle and password.');
      return;
    }

    // Authenticate
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onLoginSuccess({
      email: emailOrHandle.includes('@') ? emailOrHandle : `${emailOrHandle}@precynails.ng`,
      handle: emailOrHandle.startsWith('@') ? emailOrHandle : `@${emailOrHandle.replace(/[^a-zA-Z0-9_.]/g, '') || 'precynails'}`,
      shopName: shopName || 'PrecyNails Studio Official',
      isLoggedIn: true
    });
  };

  const handleDemoLogin = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onLoginSuccess({
      email: 'vendor@precynails.ng',
      handle: '@precynails.ng',
      shopName: 'PrecyNails Luxury Press-On Studio',
      isLoggedIn: true
    });
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px', paddingBottom: '60px' }}>
      <div
        className="card animate-fade-in"
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 28px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Glow Accent */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #ec4899 0%, #db2777 50%, #9333ea 100%)', position: 'absolute', top: 0, left: 0, right: 0 }} />

        {/* Vendor Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            className="story-ring"
            style={{ width: '64px', height: '64px', padding: '3px', margin: '0 auto 12px auto' }}
          >
            <div
              style={{
                background: '#db2777',
                borderRadius: '50%',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Sparkles size={30} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            {isRegistering ? 'Create Nail Studio' : 'Nail Vendor Portal Login'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {isRegistering
              ? 'Start managing your press-on orders & nail inventory'
              : 'Log in to manage custom nail orders, inventory & sales'}
          </p>
        </div>

        {/* Form Mode Toggle */}
        <div className="pill-toggle-container" style={{ width: '100%', marginBottom: '24px' }}>
          <button
            className={`pill-toggle-btn ${!isRegistering ? 'active' : ''}`}
            style={{ flex: 1, padding: '10px' }}
            onClick={() => setIsRegistering(false)}
          >
            Sign In
          </button>
          <button
            className={`pill-toggle-btn ${isRegistering ? 'active' : ''}`}
            style={{ flex: 1, padding: '10px' }}
            onClick={() => setIsRegistering(true)}
          >
            Register Studio
          </button>
        </div>

        {/* Demo Fast Login Banner */}
        {!isRegistering && (
          <div
            style={{
              background: '#fafafa',
              border: '1px solid #ca9e44',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#db2777" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#db2777' }}>Demo Vendor Access</div>
                <div style={{ fontSize: '0.75rem', color: '#be185d' }}>Instant 1-click login as @precynails.ng</div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#db2777' }}
              onClick={handleDemoLogin}
            >
              1-Click Login
            </button>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegistering && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Nail Studio / Brand Name *
              </label>
              <div style={{ position: 'relative' }}>
                <Store size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. PrecyNails Luxury Studio"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 40px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Instagram Handle or Email *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="e.g. @precynails.ng or vendor@mail.com"
                value={emailOrHandle}
                onChange={(e) => setEmailOrHandle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 40px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Password *
              </label>
              {!isRegistering && (
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered phone/email.'); }} style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot Password?
                </a>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 40px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: '#e11d48', fontSize: '0.82rem', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}
          >
            {isRegistering ? 'Create Studio Account' : 'Login to Nail Portal'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer Navigation Back to Store */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
            onClick={onGoToStorefront}
          >
            ← Return to Nail Studio Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
