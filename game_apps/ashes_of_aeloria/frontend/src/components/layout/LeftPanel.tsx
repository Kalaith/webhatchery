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
    <div className="w-full bg-white border border-gray-200 lg:border-r lg:border-l-0 lg:border-t-0 lg:border-b-0 rounded-lg lg:rounded-none flex flex-col gap-4 lg:gap-6 p-4 lg:p-6 h-auto lg:h-full overflow-y-auto">
      <ResourcePanel />
      <CommandersPanel onRecruitClick={onRecruitClick} />
      <ActionsPanel onHelpClick={onHelpClick} />
    </div>
  );
};
