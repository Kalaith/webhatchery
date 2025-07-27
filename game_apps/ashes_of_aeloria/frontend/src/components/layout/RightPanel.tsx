import React from 'react';
import { InfoPanel } from '../game/InfoPanel';
import { BattleLog } from '../game/BattleLog';

export const RightPanel: React.FC = () => {
  return (
    <div className="w-full bg-white border border-gray-200 lg:border-l lg:border-r-0 lg:border-t-0 lg:border-b-0 rounded-lg lg:rounded-none flex flex-col gap-4 lg:gap-6 p-4 lg:p-6 h-auto lg:h-full overflow-y-auto">
      <InfoPanel />
      <BattleLog />
    </div>
  );
};
