import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/useGameStore';
import { GAME_DATA } from '../../data/gameData';
import type { CommanderClass, Race } from '../../types/game';

interface RecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecruitmentModal: React.FC<RecruitmentModalProps> = ({ isOpen, onClose }) => {
  const [selectedClass, setSelectedClass] = useState<CommanderClass | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  
  const { resources, addCommander } = useGameStore(state => ({
    resources: state.resources,
    addCommander: state.addCommander
  }));

  const handleConfirmRecruitment = () => {
    if (selectedClass && selectedRace) {
      const success = addCommander(selectedClass, selectedRace);
      if (success) {
        setSelectedClass(null);
        setSelectedRace(null);
        onClose();
      }
    }
  };

  const handleCancel = () => {
    setSelectedClass(null);
    setSelectedRace(null);
    onClose();
  };

  const canAfford = selectedClass ? resources.gold >= GAME_DATA.commanderClasses[selectedClass].cost : false;

  const footer = (
    <>
      <Button variant="secondary" onClick={handleCancel}>
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleConfirmRecruitment}
        disabled={!selectedClass || !selectedRace || !canAfford}
      >
        Recruit (Cost: {selectedClass ? GAME_DATA.commanderClasses[selectedClass].cost : '-'} Gold)
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Recruit Commander"
      footer={footer}
    >
      <div className="recruitment-options">
        <h4>Select Class:</h4>
        <div className="class-selection">
          {Object.entries(GAME_DATA.commanderClasses).map(([key, classData]) => (
            <div
              key={key}
              className={`selection-option ${selectedClass === key ? 'selected' : ''}`}
              onClick={() => setSelectedClass(key as CommanderClass)}
            >
              <div className="option-icon">{classData.icon}</div>
              <div className="option-name">{classData.name}</div>
              <div className="option-description">{classData.description}</div>
              <div className="option-cost">Cost: {classData.cost} gold</div>
            </div>
          ))}
        </div>
        
        <h4>Select Race:</h4>
        <div className="race-selection">
          {Object.entries(GAME_DATA.races).map(([key, raceData]) => (
            <div
              key={key}
              className={`selection-option ${selectedRace === key ? 'selected' : ''}`}
              onClick={() => setSelectedRace(key as Race)}
            >
              <div className="option-icon">{raceData.icon}</div>
              <div className="option-name">{raceData.name}</div>
              <div className="option-description">{raceData.bonus}</div>
            </div>
          ))}
        </div>

        <div className="recruitment-summary">
          {selectedClass && selectedRace ? (
            <div className="summary-stats">
              <h4>Commander Summary:</h4>
              <div className="summary-stat">
                <span className="summary-stat-label">Name:</span>
                <span className="summary-stat-value">
                  {GAME_DATA.races[selectedRace].name} {GAME_DATA.commanderClasses[selectedClass].name}
                </span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">Health:</span>
                <span className="summary-stat-value">{GAME_DATA.commanderClasses[selectedClass].baseHealth}</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">Attack:</span>
                <span className="summary-stat-value">{GAME_DATA.commanderClasses[selectedClass].baseAttack}</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">Defense:</span>
                <span className="summary-stat-value">{GAME_DATA.commanderClasses[selectedClass].baseDefense}</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">Special:</span>
                <span className="summary-stat-value">{GAME_DATA.commanderClasses[selectedClass].specialAbility}</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">Racial Bonus:</span>
                <span className="summary-stat-value">{GAME_DATA.races[selectedRace].bonus}</span>
              </div>
            </div>
          ) : (
            <p>Select a class and race to see details</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
