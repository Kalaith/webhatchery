import React from 'react';
import './styles/globals.css';
import { useGameStore } from './stores/gameStore';
import { MainMenu } from './components/MainMenu';
import { CharacterCreation } from './components/CharacterCreation';
import { MainHub } from './components/MainHub';
import { CharacterInteraction } from './components/CharacterInteraction';
import { ActivitiesScreen } from './components/ActivitiesScreen';

function App() {
  const currentScreen = useGameStore(state => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main-menu':
        return <MainMenu />;
      case 'character-creation':
        return <CharacterCreation />;
      case 'main-hub':
        return <MainHub />;
      case 'character-interaction':
        return <CharacterInteraction />;
      case 'activities':
        return <ActivitiesScreen />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  );
}

export default App;