/**
 * Enhanced Right Panel Component
 * Clean, modular implementation for commanders and information
 */

import React from 'react';
import { EnhancedInfoPanel } from './EnhancedInfoPanel';
import { EnhancedCommandersPanel } from './EnhancedCommandersPanel';

interface EnhancedRightPanelProps {
  className?: string;
}

export const EnhancedRightPanel: React.FC<EnhancedRightPanelProps> = ({
  className = ''
}) => {
  return (
    <div className={`space-y-4 h-full overflow-y-auto ${className}`}>
      {/* Node/Commander Information */}
      <EnhancedInfoPanel />
      
      {/* Commanders Management */}
      <EnhancedCommandersPanel />
    </div>
  );
};
