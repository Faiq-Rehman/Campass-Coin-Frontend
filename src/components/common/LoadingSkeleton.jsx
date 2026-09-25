import React from 'react';

export const SkeletonItem = ({ height = '20px', width = '100%', borderRadius = '6px', className = '' }) => {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        background: 'linear-gradient(90deg, #111827 25%, #1A2438 50%, #111827 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        border: '1px solid rgba(255, 255, 255, 0.04)'
      }}
      className={className}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export const SkeletonCard = ({ height = '140px', className = '' }) => {
  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '1.5rem',
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      className={className}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonItem width="40%" height="16px" />
        <SkeletonItem width="32px" height="32px" borderRadius="8px" />
      </div>
      <SkeletonItem width="65%" height="32px" />
      <SkeletonItem width="50%" height="14px" />
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => {
  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '1.25rem'
      }}
      className={className}
    >
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonItem key={i} width={`${100 / cols}%`} height="18px" />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem' }}>
            {Array.from({ length: cols }).map((_, j) => (
              <SkeletonItem key={j} width={`${100 / cols}%`} height="22px" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  SkeletonItem,
  SkeletonCard,
  SkeletonTable
};
