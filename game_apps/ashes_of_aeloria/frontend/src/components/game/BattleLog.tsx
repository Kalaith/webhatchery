import React from 'react';
import { Card } from '../ui/Card';
import { useGameStore } from '../../stores/useGameStore';

export const BattleLog: React.FC = () => {
  const battleLog = useGameStore(state => state.battleLog);

  return (
    <Card className="p-4 flex-1 min-h-48">
      <h3 className="text-base lg:text-lg font-bold mb-3 lg:mb-4 text-gray-800">Battle Log</h3>
      <div className="max-h-60 lg:max-h-72 overflow-y-auto flex flex-col gap-1">
        {battleLog.map((entry, index) => (
          <div 
            key={`${entry.timestamp}-${index}`}
            className={`p-2 rounded text-xs lg:text-sm leading-normal border-l-2 last:font-medium ${
              entry.type === 'victory' ? 'bg-green-50 border-l-green-500 text-green-700' :
              entry.type === 'defeat' ? 'bg-red-50 border-l-red-500 text-red-700' :
              entry.type === 'combat' ? 'bg-orange-50 border-l-orange-500 text-orange-700' :
              entry.type === 'recruitment' ? 'bg-purple-50 border-l-purple-500 text-purple-700' :
              'bg-blue-50 border-l-blue-500 text-blue-700'
            }`}
          >
            {entry.message}
          </div>
        ))}
      </div>
    </Card>
  );
};
