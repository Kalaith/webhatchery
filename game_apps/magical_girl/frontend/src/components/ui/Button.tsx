// Reusable Button component with magical girl theme
import React from 'react';
import { motion } from 'framer-motion';

interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'magical' | 'sparkle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target';
  
  const variantClasses = {
    primary: 'magical-button focus:ring-magical-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    magical: 'magical-button focus:ring-magical-500',
    sparkle: 'sparkle-button focus:ring-sparkle-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs lg:text-sm min-h-[44px]',
    md: 'px-4 py-3 text-sm lg:text-base min-h-[44px]',
    lg: 'px-6 py-4 text-base lg:text-lg min-h-[48px]'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const buttonContent = (
    <>
      {loading && (
        <div className="magical-spinner mr-2" />
      )}
      {children}
    </>
  );
  
  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};
