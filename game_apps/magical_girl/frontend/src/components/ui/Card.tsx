// Reusable Card component with magical styling
import React from 'react';
import { motion } from 'framer-motion';

interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  variant?: 'default' | 'magical' | 'sparkle';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'magical-card';
  
  const variantClasses = {
    default: '',
    magical: 'bg-magical-gradient border-magical-300',
    sparkle: 'bg-sparkle-gradient border-sparkle-300'
  };
  
  const interactiveClasses = clickable ? 'cursor-pointer' : '';
  const classes = `${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`;
  
  const cardContent = (
    <div className="relative">
      {title && (
        <div className="mb-4 pb-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
  
  if (hoverable || clickable) {
    return (
      <motion.div
        className={classes}
        onClick={clickable ? onClick : undefined}
        whileHover={hoverable ? { y: -2, scale: 1.02 } : {}}
        whileTap={clickable ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  return (
    <div className={classes} {...props}>
      {cardContent}
    </div>
  );
};
