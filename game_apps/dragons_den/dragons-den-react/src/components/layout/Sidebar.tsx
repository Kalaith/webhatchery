import React from 'react';
import { StatDisplay } from '../ui/StatDisplay';
import { useGameStats } from '../../hooks/useGameStats';

export const Sidebar: React.FC = () => {
  const { stats } = useGameStats();

  return (
    <aside className="w-64 p-4 bg-white border-r border-gray-200 shadow-sm">
      <header className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">📊 Game Stats</h2>
        <p className="text-sm text-gray-500 mt-1">Your current progress</p>
      </header>
      
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <StatDisplay
            key={`${stat.label}-${index}`}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            showChange={stat.showChange}
          />
        ))}
      </div>
      
      <footer className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Dragon's Den v1.0
        </p>
      </footer>
    </aside>
  );
};