/**
 * Enhanced Button component following clean code principles
 * Supports multiple variants, sizes, states, and accessibility
 */

import React, { forwardRef } from 'react';
import { UI_CONFIG } from '../../constants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const VARIANT_CLASSES = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-transparent focus:ring-gray-500',
  success: 'bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-transparent focus:ring-yellow-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300 focus:ring-gray-500'
} as const;

const SIZE_CLASSES = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = VARIANT_CLASSES[variant];
  const sizeClasses = SIZE_CLASSES[size];
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const combinedClassName = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={combinedClassName}
      disabled={isDisabled}
      style={{ minHeight: `${UI_CONFIG.MIN_TOUCH_TARGET}px` }}
      {...props}
    >
      {leftIcon && !loading && (
        <span className="mr-2 -ml-1">
          {leftIcon}
        </span>
      )}
      
      {loading && (
        <span className="mr-2 -ml-1">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}
      
      <span>{children}</span>
      
      {rightIcon && !loading && (
        <span className="ml-2 -mr-1">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
