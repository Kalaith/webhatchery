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
    <div className="game-container">
      <GameHeader />
      
      <div className="game-content">
        <LeftPanel 
          onRecruitClick={handleRecruitClick}
          onHelpClick={handleHelpClick}
        />
        
        <GameCanvas />
        
        <RightPanel />
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>{winner === 'player' ? '🎉 Victory!' : '💀 Defeat!'}</h2>
            <p>
              {winner === 'player' 
                ? 'Congratulations! You have conquered the realm of Aeloria!'
                : 'The enemy has overwhelmed your forces. Better luck next time!'
              }
            </p>
            <Button variant="primary" onClick={handleResetGame}>
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