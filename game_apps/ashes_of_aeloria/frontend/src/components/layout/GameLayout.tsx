/**
 * Game Layout Component
 * Responsive layout container for the main game interface
 */

import React from 'react';

interface GameLayoutProps {
  header: React.ReactNode;
  leftPanel: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  header,
  leftPanel,
  mainContent,
  rightPanel,
  className = ''
}) => {
  return (
    <div className={`h-screen flex flex-col overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0">
        {header}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-2 lg:gap-4 p-2 lg:p-4 overflow-hidden">
        {/* Left Panel - Full width on mobile, fixed width on desktop */}
        <div className="w-full lg:w-80 order-2 lg:order-1 flex-shrink-0">
          {leftPanel}
        </div>
        
        {/* Main Content - Takes remaining space */}
        <div className="flex-1 order-1 lg:order-2 min-h-0">
          {mainContent}
        </div>
        
        {/* Right Panel - Full width on mobile, fixed width on desktop */}
        <div className="w-full lg:w-80 order-3 flex-shrink-0">
          {rightPanel}
        </div>
      </div>
    </div>
  );
};
