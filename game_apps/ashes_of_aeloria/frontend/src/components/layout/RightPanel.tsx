import React from 'react';
import { InfoPanel } from '../game/InfoPanel';
import { BattleLog } from '../game/BattleLog';

export const RightPanel: React.FC = () => {
  return (
    <div className="right-panel">
      <InfoPanel />
      <BattleLog />
    </div>
  );
};
