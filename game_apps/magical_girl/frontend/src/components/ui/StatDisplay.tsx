import React from 'react';
import { motion } from 'framer-motion';

interface StatDisplayProps {
  label: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
  color?: 'purple' | 'pink' | 'blue' | 'green' | 'orange';
  showBar?: boolean;
  className?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  value,
  maxValue,
  icon,
  color = 'purple',
  showBar = false,
  className = '',
}) => {
  const percentage = maxValue ? (value / maxValue) * 100 : 100;
  
  const colorClasses = {
    purple: 'text-purple-600 bg-purple-500',
    pink: 'text-pink-600 bg-pink-500',
    blue: 'text-blue-600 bg-blue-500',
    green: 'text-green-600 bg-green-500',
    orange: 'text-orange-600 bg-orange-500',
  };
  return (
    <div className={`resource-display ${className}`}>
      {icon && (
        <div className={`w-4 h-4 lg:w-5 lg:h-5 ${colorClasses[color].split(' ')[0]}`}>
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="text-xs lg:text-sm font-medium text-gray-700 truncate">
          {label}
        </div>
        
        <div className="flex items-center gap-1 lg:gap-2">
          <span className="text-sm lg:text-lg font-bold text-gray-900 truncate">
            {Math.floor(value)}
            {maxValue && <span className="text-xs lg:text-sm text-gray-500">/{maxValue}</span>}
          </span>
          
          {showBar && maxValue && (
            <div className="flex-1 stat-bar">
              <motion.div
                className={`stat-bar-fill ${colorClasses[color].split(' ')[1]}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
