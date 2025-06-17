import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const Header: React.FC = () => {
  const { prestigeLevel, achievements } = useGameStore();

  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-red-900 to-orange-800 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">🐉 Dragon's Den</h1>
        {prestigeLevel > 0 && (
          <div className="flex items-center gap-2 bg-yellow-600 px-3 py-1 rounded-full text-sm">
            <span>⭐</span>
            <span>Prestige {prestigeLevel}</span>
          </div>
        )}
      </div>
      
      <nav className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span className="text-sm">{achievements.size} Achievements</span>
        </div>
        
        <div className="flex gap-4">
          <button className="text-white hover:text-yellow-300 transition-colors">
            Game
          </button>
          <button className="text-white hover:text-yellow-300 transition-colors">
            Achievements
          </button>
          <button className="text-white hover:text-yellow-300 transition-colors">
            Stats
          </button>
        </div>
      </nav>
    </header>
  );
};

export { Header };
