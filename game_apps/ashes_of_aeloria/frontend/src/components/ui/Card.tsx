import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card__header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="card__body">
        {children}
      </div>
    </div>
  );
};
