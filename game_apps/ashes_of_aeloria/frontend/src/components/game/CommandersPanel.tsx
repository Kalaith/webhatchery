import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/useGameStore';
import type { Commander } from '../../types/game';

interface CommandersPanelProps {
  onRecruitClick: () => void;
}

export const CommandersPanel: React.FC<CommandersPanelProps> = ({ onRecruitClick }) => {
  const commanders = useGameStore(state => state.commanders);
  const selectedCommander = useGameStore(state => state.selectedCommander);
  const selectCommander = useGameStore(state => state.selectCommander);

  const handleCommanderClick = (commander: Commander) => {
    selectCommander(selectedCommander === commander.id ? null : commander.id);
  };

  return (
    <Card className="p-3 lg:p-4">
      <h3 className="text-base lg:text-lg font-bold mb-3 lg:mb-4 text-gray-800">Commanders</h3>
      <div className="flex flex-col gap-2 max-h-40 lg:max-h-48 overflow-y-auto mb-3 lg:mb-4">
        {commanders.length === 0 ? (
          <p className="text-gray-500 text-center py-3 lg:py-4 text-sm lg:text-base">No commanders recruited</p>
        ) : (
          commanders.map((commander: Commander) => (
            <div 
              key={commander.id}
              className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                selectedCommander === commander.id 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
              onClick={() => handleCommanderClick(commander)}
            >
              <div className="text-lg lg:text-xl w-5 lg:w-6 text-center flex-shrink-0">
                {/* Get the icon from the commander's class */}
                {commander.class === 'knight' && '⚔️'}
                {commander.class === 'mage' && '🔮'}
                {commander.class === 'ranger' && '🏹'}
                {commander.class === 'warlord' && '👑'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-xs lg:text-sm truncate">{commander.name}</div>
                <div className={`text-xs mt-1 ${
                  selectedCommander === commander.id ? 'opacity-80' : 'opacity-80 text-gray-600'
                }`}>
                  Level {commander.level} • HP: {commander.health}/{commander.maxHealth}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Button 
        variant="primary" 
        fullWidth 
        onClick={onRecruitClick}
        size="sm"
        className="w-full text-sm lg:text-base"
      >
        Recruit Commander
      </Button>
    </Card>
  );
};
