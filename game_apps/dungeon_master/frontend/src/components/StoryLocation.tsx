import React from 'react';

interface StoryLocationProps {
  location: string;
}

const StoryLocation: React.FC<StoryLocationProps> = ({ location }) => (
  <div className="text-sm text-gray-500 font-medium">
    <span>{location}</span>
  </div>
);

export default StoryLocation;
