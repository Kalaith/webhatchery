import React from 'react';
import { ResourcePanel } from '../game/ResourcePanel';
import { CommandersPanel } from '../game/CommandersPanel';
import { ActionsPanel } from '../game/ActionsPanel';

interface LeftPanelProps {
  onRecruitClick: () => void;
  onHelpClick: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ onRecruitClick, onHelpClick }) => {
  return (
    <div className="left-panel">
      <ResourcePanel />
      <CommandersPanel onRecruitClick={onRecruitClick} />
      <ActionsPanel onHelpClick={onHelpClick} />
    </div>
  );
};
