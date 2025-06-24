import React, { type ReactNode } from 'react';

interface StorySectionProps {
  children: ReactNode;
}

const StorySection: React.FC<StorySectionProps> = ({ children }) => (
  <section className="w-full mb-6">{children}</section>
);

export default StorySection;
