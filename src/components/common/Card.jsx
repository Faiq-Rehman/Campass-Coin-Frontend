import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  elevated = false,
  goldBorder = false,
  glass = false,
  hoverable = false,
  className = '',
  onClick,
  ...props
}) => {
  let baseClass = elevated ? 'luxury-card-elevated' : 'luxury-card';
  if (glass) baseClass = 'luxury-glass';
  if (goldBorder) baseClass += ' luxury-card-gold';

  const hoverAnimation = hoverable
    ? {
        whileHover: { y: -3, transition: { duration: 0.2 } },
        style: { cursor: onClick ? 'pointer' : 'default' }
      }
    : {};

  return (
    <motion.div
      className={`${baseClass} ${className}`}
      onClick={onClick}
      {...hoverAnimation}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
