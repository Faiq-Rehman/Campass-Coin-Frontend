import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg'
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflowY: 'auto'
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(7, 11, 20, 0.85)',
              backdropFilter: 'blur(8px)'
            }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'relative',
              width: '100%',
              backgroundColor: '#111827',
              border: '1px solid rgba(214, 179, 106, 0.25)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              zIndex: 10
            }}
            className={maxWidth}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '0.85rem'
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    margin: 0
                  }}
                >
                  {title}
                </h3>
                {subtitle && (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#94A3B8',
                      marginTop: '0.25rem',
                      marginBottom: 0
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X className="w-5 h-5 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Content Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
