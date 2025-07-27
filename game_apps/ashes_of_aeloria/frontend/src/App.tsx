/**
 * Main Application Component
 * Clean, modular architecture following frontend standards
 */

import React from 'react';
import { GameLayout } from './components/layout/GameLayout';
import { GameHeader } from './components/layout/GameHeader';
import { GameCanvas } from './components/game/GameCanvas';
import { EnhancedLeftPanel } from './components/features/EnhancedLeftPanel';
import { EnhancedRightPanel } from './components/features/EnhancedRightPanel';
import { GameOverModal } from './components/features/GameOverModal';
import { RecruitmentModal } from './components/game/RecruitmentModal';
import { HelpModal } from './components/game/HelpModal';
import { ToastContainer } from './components/ui/Toast';
import { GameProvider } from './providers/GameProvider';
import { useGameLogic } from './hooks/useGameLogic';
import { useNotifications } from './hooks/useNotifications';
import { useModals } from './hooks/useModals';
import './styles/globals.css';

/**
 * Game Content Component
 * Separated from App for cleaner Provider wrapping
 */
const GameContent: React.FC = () => {
  const { gameOver, winner } = useGameLogic();
  const { notifications, removeNotification } = useNotifications();
  const {
    modals,
    openRecruitment,
    closeRecruitment,
    openHelp,
    closeHelp
  } = useModals();

  return (
    <>
      <GameLayout
        header={<GameHeader />}
        leftPanel={
          <EnhancedLeftPanel 
            onRecruitClick={openRecruitment}
            onHelpClick={openHelp}
          />
        }
        mainContent={<GameCanvas />}
        rightPanel={<EnhancedRightPanel />}
      />

      {/* Modals */}
      <GameOverModal 
        isOpen={gameOver} 
        winner={winner} 
      />
      
      <RecruitmentModal 
        isOpen={modals.recruitment}
        onClose={closeRecruitment}
      />
      
      <HelpModal 
        isOpen={modals.help}
        onClose={closeHelp}
      />

      {/* Toast Notifications */}
      <ToastContainer 
        notifications={notifications}
        onClose={removeNotification}
      />
    </>
  );
};

/**
 * Main App Component
 * Provides context and global state management
 */
function App() {
  return (
    <GameProvider>
      <div className="h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
        <GameContent />
      </div>
    </GameProvider>
  );
}

export default App;
