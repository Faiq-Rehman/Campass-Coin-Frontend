import React from 'react';

const Badge = ({
  children,
  variant = 'gold', // 'gold' | 'soft' | 'success' | 'warning' | 'danger' | 'default'
  icon: Icon,
  className = ''
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'gold':
        return 'badge-gold';
      case 'soft':
        return 'badge-soft';
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'danger':
        return 'badge-danger';
      default:
        return 'bg-white/5 text-[#94A3B8] border border-white/10 px-2.5 py-0.5 rounded-full text-xs font-medium';
    }
  };

  return (
    <span className={`${getVariantClass()} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
