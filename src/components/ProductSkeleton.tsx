import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div
      className="card"
      style={{
        padding: '0',
        overflow: 'hidden',
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Image Skeleton Block */}
      <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: '0' }} />

      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {/* Category Pill Skeleton */}
        <div className="skeleton" style={{ width: '60px', height: '12px', borderRadius: 'var(--radius-full)' }} />
        
        {/* Title Line Skeleton */}
        <div className="skeleton" style={{ width: '85%', height: '16px' }} />

        {/* Price & Action Button Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
          <div className="skeleton" style={{ width: '55px', height: '18px' }} />
          <div className="skeleton" style={{ width: '36px', height: '32px', borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>
    </div>
  );
};

export const ProductSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '16px',
        width: '100%'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
