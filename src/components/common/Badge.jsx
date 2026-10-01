import React from 'react';

const Badge = ({
  children,
  variant = 'gold', // 'gold' | 'primary' | 'soft' | 'cyan' | 'success' | 'warning' | 'danger' | 'default'
  icon: Icon,
  className = ''
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
      case 'gold':
        return 'badge-gold';
      case 'cyan':
      case 'soft':
        return 'badge-soft';
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'danger':
        return 'badge-danger';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] px-2.5 py-0.5 rounded-full text-xs font-semibold';
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
