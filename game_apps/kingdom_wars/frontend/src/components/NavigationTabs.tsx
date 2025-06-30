import React from 'react';
import { useGameStore } from '../stores/gameStore';
import type { TabType } from '../types';

const NavigationTabs: React.FC = () => {
  const currentTab = useGameStore(state => state.currentTab);
  const setCurrentTab = useGameStore(state => state.setCurrentTab);
  const isKingdomCreated = useGameStore(state => state.isKingdomCreated);

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'kingdom', label: 'Kingdom', icon: '🏰' },
    { key: 'buildings', label: 'Buildings', icon: '🏗️' },
    { key: 'military', label: 'Military', icon: '⚔️' },
    { key: 'attack', label: 'Attack', icon: '🗡️' },
    { key: 'research', label: 'Research', icon: '📚' },
    { key: 'alliances', label: 'Alliances', icon: '🤝' }
  ];

  if (!isKingdomCreated) {
    return null;
  }

  return (
    <nav className="game-nav bg-gray-100 border-b-2 border-gray-300 px-4 py-2">
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setCurrentTab(key)}
            className={`nav-tab flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              currentTab === key
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;
