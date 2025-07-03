import React from 'react';

interface TabPanelProps {
  name: string;
  active: string;
  children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ name, active, children }) => {
  if (name !== active) return null;
  return <div>{children}</div>;
};

export default TabPanel; 