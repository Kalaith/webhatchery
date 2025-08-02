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
import ForgePage from './pages/ForgePage';
import RecipesPage from './pages/RecipesPage';
import MaterialsPage from './pages/MaterialsPage';
import CustomersPage from './pages/CustomersPage';
import UpgradesPage from './pages/UpgradesPage';
// import { GameProvider } from './context/GameContext';


const TAB_KEYS = ['forge', 'recipes', 'materials', 'customers', 'upgrades'] as const;
type TabKey = typeof TAB_KEYS[number];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('forge');

  return (
    <GameLayout>
      <GameHeader />
      <GameNav activeTab={activeTab} onTabChange={tab => setActiveTab(tab as TabKey)} />
      <main className="game-content">
        {activeTab === 'forge' && <ForgePage />}
        {activeTab === 'recipes' && <RecipesPage />}
        {activeTab === 'materials' && <MaterialsPage />}
        {activeTab === 'customers' && <CustomersPage />}
        {activeTab === 'upgrades' && <UpgradesPage />}
      </main>
      {/* TODO: Add modal components here */}
    </GameLayout>
  );
};

export default App;
