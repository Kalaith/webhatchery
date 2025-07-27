import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/useGameStore';
import type { Commander } from '../../types/game';

interface CommandersPanelProps {
  onRecruitClick: () => void;
}

export const CommandersPanel: React.FC<CommandersPanelProps> = ({ onRecruitClick }) => {
  const { commanders, selectedCommander, selectCommander } = useGameStore(state => ({
    commanders: state.commanders,
    selectedCommander: state.selectedCommander,
    selectCommander: state.selectCommander
  }));

  const handleCommanderClick = (commander: Commander) => {
    selectCommander(selectedCommander === commander.id ? null : commander.id);
  };

  return (
    <Card className="commanders-panel">
      <h3>Commanders</h3>
      <div className="commanders-list">
        {commanders.length === 0 ? (
          <p className="text-secondary">No commanders recruited</p>
        ) : (
          commanders.map(commander => (
            <div 
              key={commander.id}
              className={`commander-item ${selectedCommander === commander.id ? 'selected' : ''}`}
              onClick={() => handleCommanderClick(commander)}
            >
              <div className="commander-icon">
                {/* Get the icon from the commander's class */}
                {commander.class === 'knight' && '⚔️'}
                {commander.class === 'mage' && '🔮'}
                {commander.class === 'ranger' && '🏹'}
                {commander.class === 'warlord' && '👑'}
              </div>
              <div className="commander-info">
                <div className="commander-name">{commander.name}</div>
                <div className="commander-details">
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
      >
        Recruit Commander
      </Button>
    </Card>
  );
};
