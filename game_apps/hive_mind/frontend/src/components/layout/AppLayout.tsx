import React from 'react';
import Header from './Header';
import HiveVisualization from '../features/HiveVisualization';
import EvolutionPanel from '../features/EvolutionPanel';
import UnitProduction from '../features/UnitProduction';
import GoalsPanel from '../features/GoalsPanel';

const AppLayout: React.FC = () => {
  return (
    <div className="game-container">
      <Header />
      <main className="main-content">
        <div className="left-panel">
          <HiveVisualization />
          <EvolutionPanel />
        </div>
        <div className="center-panel">
          <UnitProduction />
        </div>
        <div className="right-panel">
          <GoalsPanel />
          <div className="settings-panel">
            <h3>Settings</h3>
            <div className="settings-controls">
              {/* Settings controls content */}
            </div>
          </div>
        </div>
      </main>
      <div className="game-status" id="game-status">
        <div className="status-item">
          <span className="status-label">Total Units:</span>
          <span className="status-value" id="total-units">0</span>
        </div>
        <div className="status-item">
          <span className="status-label">Offline for:</span>
          <span className="status-value" id="offline-time">0s</span>
        </div>
      </div>
      <div className="notifications" id="notifications">
        {/* Notifications content */}
      </div>
    </div>
  );
};

export default AppLayout;
