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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col gap-6 p-6 h-full overflow-y-auto">
      <ResourcePanel />
      <CommandersPanel onRecruitClick={onRecruitClick} />
      <ActionsPanel onHelpClick={onHelpClick} />
    </div>
  );
};
