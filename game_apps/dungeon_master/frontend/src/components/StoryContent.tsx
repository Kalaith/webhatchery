import React from 'react';

interface StoryContentProps {
  events: string[];
}

const StoryContent: React.FC<StoryContentProps> = ({ events }) => (
  <div className="max-h-52 overflow-y-auto leading-normal">
    {events.map((event, idx) => (
      <p key={idx} className="mb-3 last:mb-0">
        {event}
      </p>
    ))}
  </div>
);

export default StoryContent;
