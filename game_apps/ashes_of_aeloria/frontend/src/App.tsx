import React, { useState } from 'react';
import { GameHeader } from './components/layout/GameHeader';
import { LeftPanel } from './components/layout/LeftPanel';
import { RightPanel } from './components/layout/RightPanel';
import { GameCanvas } from './components/game/GameCanvas';
import { RecruitmentModal } from './components/game/RecruitmentModal';
import { HelpModal } from './components/game/HelpModal';
import { useGameLogic } from './hooks/useGameLogic';
import { Button } from './components/ui/Button';
import { useGameStore } from './stores/useGameStore';
import './styles/globals.css';

function App() {
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const { gameOver, winner } = useGameLogic();
  const resetGame = useGameStore(state => state.resetGame);

  const handleRecruitClick = () => {
    setShowRecruitModal(true);
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  const handleResetGame = () => {
    resetGame();
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
      <GameHeader />
      
      {/* Mobile-first responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-2 lg:gap-4 p-2 lg:p-4 overflow-hidden">
        {/* Left Panel - Full width on mobile, fixed width on desktop */}
        <div className="w-full lg:w-80 order-2 lg:order-1">
          <LeftPanel 
            onRecruitClick={handleRecruitClick}
            onHelpClick={handleHelpClick}
          />
        </div>
        
        {/* Game Canvas - Takes remaining space */}
        <div className="flex-1 order-1 lg:order-2 min-h-0">
          <GameCanvas />
        </div>
        
        {/* Right Panel - Full width on mobile, fixed width on desktop */}
        <div className="w-full lg:w-80 order-3">
          <RightPanel />
        </div>
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 lg:p-8 rounded-lg border border-gray-200 text-center w-full max-w-sm shadow-lg">
            <h2 className="text-2xl lg:text-3xl mb-4">{winner === 'player' ? '🎉 Victory!' : '💀 Defeat!'}</h2>
            <p className="mb-6 text-gray-600 leading-normal text-sm lg:text-base">
              {winner === 'player' 
                ? 'Congratulations! You have conquered the realm of Aeloria!'
                : 'The enemy has overwhelmed your forces. Better luck next time!'
              }
            </p>
            <Button variant="primary" onClick={handleResetGame} fullWidth>
              Play Again
            </Button>
          </div>
        </div>
      )}

      <RecruitmentModal 
        isOpen={showRecruitModal}
        onClose={() => setShowRecruitModal(false)}
      />

      <HelpModal 
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}

export default App;