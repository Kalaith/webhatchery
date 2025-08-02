/**
 * Main Application Component
 * Clean, modular architecture following frontend standards
 */


import './styles/globals.css';
import './styles/style.css';
import React, { useState } from 'react';
import GameLayout from './components/layout/GameLayout';
import GameHeader from './components/layout/GameHeader';
import GameNav from './components/layout/GameNav';
import ForgeTab from './components/features/ForgeTab';
import RecipesTab from './components/features/RecipesTab';
import MaterialsTab from './components/features/MaterialsTab';
import CustomersTab from './components/features/CustomersTab';
import UpgradesTab from './components/features/UpgradesTab';
import { GameProvider } from './context/GameContext';


const TAB_KEYS = ['forge', 'recipes', 'materials', 'customers', 'upgrades'] as const;
type TabKey = typeof TAB_KEYS[number];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('forge');

  return (
    <GameProvider>
      <GameLayout>
        <GameHeader />
        <GameNav activeTab={activeTab} onTabChange={tab => setActiveTab(tab as TabKey)} />
        <main className="game-content">
          <ForgeTab active={activeTab === 'forge'} />
          <RecipesTab active={activeTab === 'recipes'} />
          <MaterialsTab active={activeTab === 'materials'} />
          <CustomersTab active={activeTab === 'customers'} />
          <UpgradesTab active={activeTab === 'upgrades'} />
        </main>
        {/* TODO: Add modal components here */}
      </GameLayout>
    </GameProvider>
  );
};

export default App;
