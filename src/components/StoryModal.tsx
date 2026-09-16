import React from 'react';
import { X, Sparkles, CheckCircle, Ruler, CreditCard, ShieldCheck, Heart } from 'lucide-react';

interface StoryModalProps {
  storyId: string | null;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ storyId, onClose }) => {
  if (!storyId) return null;

  const renderContent = () => {
    switch (storyId) {
      case '1': // Nail Shapes
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '50%', color: '#b45309' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>💅 Nail Shapes & Length Guide</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Find the perfect shape for your nail beds</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginTop: '8px' }}>
              {[
                { title: 'Short Almond', desc: 'Natural & classy daily wear' },
                { title: 'Medium Almond', desc: 'Slims & elongates fingers' },
                { title: 'Long Coffin', desc: 'Maximum glam & drama' },
                { title: 'Medium Coffin', desc: 'Popular bestseller shape' },
                { title: 'Short Square', desc: 'Modern minimalist chic' },
                { title: 'Stiletto', desc: 'Edgy & fierce pointed tips' }
              ].map((item, i) => (
                <div key={i} style={{ background: '#f4f4f5', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', color: '#78350f' }}>
              💡 <strong>Pro Tip:</strong> All press-on sets can be customized to your preferred shape and length during order placement!
            </div>
          </div>
        );

      case '2': // Sizing Guide
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '50%', color: '#15803d' }}>
                <Ruler size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>📏 Sizing Guide & Presets</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>How to measure your natural nail bed</p>
              </div>
            </div>

            <div style={{ background: '#fafafa', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '8px' }}>Standard Preset Sizes (Thumb to Pinky):</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
                <div><strong>XS:</strong> 14mm | 11mm | 12mm | 10mm | 8mm <em>(Nail sizes 3, 6, 5, 7, 9)</em></div>
                <div><strong>S:</strong> 15mm | 12mm | 13mm | 11mm | 8mm <em>(Nail sizes 2, 5, 4, 6, 9)</em></div>
                <div><strong>M:</strong> 16mm | 13mm | 14mm | 12mm | 9mm <em>(Nail sizes 1, 4, 3, 5, 8)</em></div>
                <div><strong>L:</strong> 18mm | 14mm | 15mm | 13mm | 10mm <em>(Nail sizes 0, 3, 2, 4, 7)</em></div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
              <strong>How to Measure at Home:</strong>
              <ol style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Place transparent tape across the widest part of your natural nail bed.</li>
                <li>Mark both side edges of your nail using a pen.</li>
                <li>Remove tape and measure distance in millimeters using a ruler.</li>
              </ol>
            </div>
          </div>
        );

      case '3': // How To Apply
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#f3e8ff', padding: '10px', borderRadius: '50%', color: '#7e22ce' }}>
                <CheckCircle size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>✨ How To Apply Press-Ons</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Follow these 5 steps for 2-3 weeks long-lasting wear</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { step: '1', title: 'Prep Cuticles', desc: 'Gently push back cuticles using the included cuticle stick.' },
                { step: '2', title: 'Buff Surface', desc: 'Lightly buff natural nail surface to remove shine and natural oils.' },
                { step: '3', title: 'Alcohol Wipe', desc: 'Dehydrate and clean nails with the alcohol prep wipe.' },
                { step: '4', title: 'Apply Glue', desc: 'Apply a drop of Super Bond Glue to both your natural nail and press-on back.' },
                { step: '5', title: 'Press 30s', desc: 'Press firm at a 45° angle for 30 seconds to prevent air bubbles.' }
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#fafafa', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <span style={{ background: '#18181b', color: '#fef08a', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                    {s.step}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{s.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case '4': // Client Nails
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#ffe4e6', padding: '10px', borderRadius: '50%', color: '#e11d48' }}>
                <Heart size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>📸 Client Showcase & Reviews</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>3,120+ happy clients across Lagos & Nigeria</p>
              </div>
            </div>

            <div style={{ background: '#fafafa', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.86rem', lineHeight: 1.5 }}>
              <p>⭐️⭐️⭐️⭐️⭐️ <em>"The chrome almond press-ons lasted over 2 weeks during my vacation! Nobody believed they weren't salon acrylics!"</em> — <strong>Chioma A., Lagos</strong></p>
              <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <p>⭐️⭐️⭐️⭐️⭐️ <em>"Fast same-day delivery in Ikeja and the sizing kit was spot on!"</em> — <strong>Tolu O., Ikeja</strong></p>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', color: '#166534' }}>
              ✨ <strong>100% Reusable:</strong> All PrecyNails sets can be safely soaked off and reused up to 5 times!
            </div>
          </div>
        );

      case '5': // How To Pay
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '50%', color: '#b45309' }}>
                <CreditCard size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>💳 How To Pay & Order</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Fast, secure, & transparent checkout</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <div style={{ background: '#fafafa', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong>1. Instant Bank Transfer:</strong> Transfer directly to our verified studio bank account after placing your order.
              </div>
              <div style={{ background: '#fafafa', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong>2. WhatsApp Checkout:</strong> Send your cart directly to our official WhatsApp line for custom assistance & fast confirmation.
              </div>
              <div style={{ background: '#fafafa', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong>3. Doorstep Delivery:</strong> Same-day dispatch within Lagos & 24-48h nationwide shipping.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(9, 9, 11, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f4f4f5',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)'
          }}
        >
          <X size={18} />
        </button>

        {renderContent()}

        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '20px' }}
          onClick={onClose}
        >
          Got it! Close
        </button>
      </div>
    </div>
  );
};
