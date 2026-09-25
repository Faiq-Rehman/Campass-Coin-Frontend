import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'gold', // 'gold' | 'primary' | 'outline' | 'danger' | 'ghost' | 'soft'
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'btn-outline';
      case 'danger':
        return 'btn-danger';
      case 'ghost':
        return 'bg-transparent text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent';
      case 'soft':
        return 'bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE] border border-[#BFDBFE]';
      case 'primary':
      case 'gold':
      default:
        return 'btn-gold';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-3 py-1.5 rounded-[6px]';
      case 'lg':
        return 'text-base px-6 py-3 rounded-[10px] font-semibold';
      default:
        return 'text-sm px-4 py-2 rounded-[8px]';
    }
  };

  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.01 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
