import React, { type ReactNode } from 'react';

interface StoryCardProps {
  children: ReactNode;
}

const StoryCard: React.FC<StoryCardProps> = ({ children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
    {children}
  </div>
);

export default StoryCard;
