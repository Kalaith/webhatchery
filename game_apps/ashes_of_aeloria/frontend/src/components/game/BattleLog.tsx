import React from 'react';
import { Card } from '../ui/Card';
import { useGameStore } from '../../stores/useGameStore';

export const BattleLog: React.FC = () => {
  const battleLog = useGameStore(state => state.battleLog);

  return (
    <Card className="battle-log">
      <h3>Battle Log</h3>
      <div className="log-content">
        {battleLog.map((entry, index) => (
          <div 
            key={`${entry.timestamp}-${index}`}
            className={`log-entry log-${entry.type}`}
          >
            {entry.message}
          </div>
        ))}
      </div>
    </Card>
  );
};
