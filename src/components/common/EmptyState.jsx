import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title = 'No records found',
  description = 'There is currently no data available to display here.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: '#FFFFFF',
        border: '1px dashed #CBD5E1',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
      }}
      className={className}
    >
      {Icon && (
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <Icon className="w-7 h-7" />
        </div>
      )}

      <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.4rem' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '380px', marginBottom: actionText ? '1.5rem' : 0 }}>
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="gold" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
