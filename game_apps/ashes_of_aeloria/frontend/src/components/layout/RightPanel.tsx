import React from 'react';
import { InfoPanel } from '../game/InfoPanel';
import { BattleLog } from '../game/BattleLog';

export const RightPanel: React.FC = () => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col gap-6 p-6 h-full overflow-y-auto">
      <InfoPanel />
      <BattleLog />
    </div>
  );
};
