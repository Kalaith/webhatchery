import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'attack' | 'recruit';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  className = '',
  children, 
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn--primary',
    secondary: 'btn--secondary', 
    outline: 'btn--outline',
    attack: 'btn--attack',
    recruit: 'btn--recruit-troops'
  };
  const sizeClasses = {
    sm: 'btn--sm',
    md: '',
    lg: 'btn--lg'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'btn--full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
