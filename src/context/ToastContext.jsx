import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration)
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#2563EB] shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.35)';
      case 'error':
        return 'rgba(239, 68, 68, 0.35)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.35)';
      default:
        return 'rgba(37, 99, 235, 0.35)';
    }
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '420px',
          width: 'calc(100% - 3rem)',
          pointerEvents: 'none'
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                pointerEvents: 'auto',
                background: '#FFFFFF',
                border: `1px solid ${getBorderColor(t.type)}`,
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backdropFilter: 'blur(12px)'
              }}
            >
              {getToastIcon(t.type)}
              <span
                style={{
                  fontSize: '0.9rem',
                  color: '#0F172A',
                  fontWeight: 500,
                  flex: 1,
                  lineHeight: 1.4
                }}
              >
                {t.message}
              </span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X className="w-4 h-4 hover:text-[#0F172A] transition-colors" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};
