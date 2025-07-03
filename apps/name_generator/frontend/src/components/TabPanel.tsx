import React from 'react';

interface TabPanelProps {
  name: string;
  active: string;
  children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ name, active, children }) => {
  if (name !== active) return null;
  return (
    <div className="animate-in fade-in-0 duration-500">
      {children}
    </div>
  );
};

export default TabPanel; 