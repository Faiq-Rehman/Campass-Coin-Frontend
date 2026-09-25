import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color = '#D6B36A',
  className = ''
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}
      className={className}
    >
      {/* Subtle background glow circle */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: color,
          opacity: 0.1,
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.02em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              backgroundColor: `${color}18`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-heading)' }}>
        {value}
      </div>

      {(subtitle || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                color: trend.direction === 'up' ? '#34D399' : '#F87171',
                fontWeight: 600
              }}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {subtitle && <span style={{ color: '#64748B' }}>{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
