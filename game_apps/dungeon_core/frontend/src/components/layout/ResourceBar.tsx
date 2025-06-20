import React from "react";
import { useGameStore } from "../../stores/gameStore";

export const ResourceBar: React.FC = () => {
  const { 
    mana, 
    maxMana, 
    manaRegen, 
    gold, 
    souls, 
    day, 
    hour, 
    status 
  } = useGameStore();

  const formatTime = (hour: number) => {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:00 ${period}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-green-600';
      case 'Closed': return 'text-yellow-600';
      case 'Maintenance': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <header className="game-header bg-gray-800 text-white">
      <div className="resource-bar flex flex-wrap gap-4 justify-between items-center p-2">
        <div className="resource flex items-center gap-2" id="mana-display">
          <span className="resource-icon text-blue-400">✨</span>
          <span className="resource-value">
            <span id="current-mana">{mana}</span>/<span id="max-mana">{maxMana}</span>
            <span className="resource-regen text-xs ml-1 text-blue-300">+{manaRegen}/s</span>
          </span>
          <div className="w-20 bg-gray-700 rounded-full h-2 ml-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(mana / maxMana) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="resource flex items-center gap-2" id="gold-display">
          <span className="resource-icon text-yellow-400">💰</span>
          <span className="resource-value text-yellow-300" id="current-gold">{gold}</span>
        </div>
        
        <div className="resource flex items-center gap-2" id="souls-display">
          <span className="resource-icon text-purple-400">👻</span>
          <span className="resource-value text-purple-300" id="current-souls">{souls}</span>
        </div>
        
        <div className="day-cycle flex flex-col items-end">
          <span className="time-display text-xs text-gray-300">
            Day <span id="day-count" className="font-bold">{day}</span> - 
            <span id="time-display" className="ml-1">{formatTime(hour)}</span>
          </span>
          <span 
            className={`status-indicator text-sm font-bold ${getStatusColor(status)}`} 
            id="dungeon-status"
          >
            {status}
          </span>
        </div>
        
        <div className="dungeon-info text-xs text-gray-400">
          <div>Level 1 Dungeon</div>
          <div>Parties Active: {useGameStore.getState().adventurerParties.length}</div>
        </div>
      </div>
    </header>
  );
};
