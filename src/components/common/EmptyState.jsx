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
        background: '#111827',
        border: '1px dashed rgba(255, 255, 255, 0.12)',
        borderRadius: '16px'
      }}
      className={className}
    >
      {Icon && (
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(214, 179, 106, 0.1)',
            color: '#D6B36A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <Icon className="w-7 h-7" />
        </div>
      )}

      <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.4rem' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.9rem', color: '#94A3B8', maxWidth: '380px', marginBottom: actionText ? '1.5rem' : 0 }}>
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
