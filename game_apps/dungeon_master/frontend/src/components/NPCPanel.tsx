import React, { type ReactNode } from 'react';

interface NPCPanelProps {
  children: ReactNode;
}

const NPCPanel: React.FC<NPCPanelProps> = ({ children }) => (
  <section className="min-h-[500px]">{children}</section>
);

export default NPCPanel;
