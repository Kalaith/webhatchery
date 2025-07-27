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
  
  const resources = useGameStore(state => state.resources);
  const addCommander = useGameStore(state => state.addCommander);

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
      <Button variant="secondary" onClick={handleCancel} fullWidth className="sm:w-auto">
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleConfirmRecruitment}
        disabled={!selectedClass || !selectedRace || !canAfford}
        fullWidth
        className="sm:w-auto"
      >
        Recruit ({selectedClass ? GAME_DATA.commanderClasses[selectedClass].cost : '-'} Gold)
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
      <div className="space-y-4 lg:space-y-6">
        <div>
          <h4 className="text-sm lg:text-md font-semibold text-gray-800 mb-3">Select Class:</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(GAME_DATA.commanderClasses).map(([key, classData]) => (
              <div
                key={key}
                className={`p-3 border rounded cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                  selectedClass === key 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onClick={() => setSelectedClass(key as CommanderClass)}
              >
                <div className="text-lg lg:text-xl w-6 lg:w-8 text-center flex-shrink-0">{classData.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm lg:text-base">{classData.name}</div>
                  <div className={`text-xs lg:text-sm mt-1 ${selectedClass === key ? 'opacity-80' : 'text-gray-600'}`}>
                    {classData.description}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  Cost: {classData.cost} gold
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm lg:text-md font-semibold text-gray-800 mb-3">Select Race:</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(GAME_DATA.races).map(([key, raceData]) => (
              <div
                key={key}
                className={`p-3 border rounded cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                  selectedRace === key 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onClick={() => setSelectedRace(key as Race)}
              >
                <div className="text-lg lg:text-xl w-6 lg:w-8 text-center flex-shrink-0">{raceData.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm lg:text-base">{raceData.name}</div>
                  <div className={`text-xs lg:text-sm mt-1 ${selectedRace === key ? 'opacity-80' : 'text-gray-600'}`}>
                    {raceData.bonus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-3 lg:p-4 rounded border border-gray-200">
          {selectedClass && selectedRace ? (
            <div className="space-y-2 lg:space-y-3">
              <h4 className="text-sm lg:text-md font-semibold text-gray-800">Commander Summary:</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {GAME_DATA.races[selectedRace].name} {GAME_DATA.commanderClasses[selectedClass].name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Health:</span>
                  <span className="font-medium">{GAME_DATA.commanderClasses[selectedClass].baseHealth}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attack:</span>
                  <span className="font-medium">{GAME_DATA.commanderClasses[selectedClass].baseAttack}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Defense:</span>
                  <span className="font-medium">{GAME_DATA.commanderClasses[selectedClass].baseDefense}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Special:</span>
                  <span className="font-medium">{GAME_DATA.commanderClasses[selectedClass].specialAbility}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Racial Bonus:</span>
                  <span className="font-medium">{GAME_DATA.races[selectedRace].bonus}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Select a class and race to see details</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
