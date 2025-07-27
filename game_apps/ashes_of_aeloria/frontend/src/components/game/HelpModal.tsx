import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const footer = (
    <Button variant="primary" onClick={onClose}>
      Got it!
    </Button>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Game Rules & Help"
      size="large"
      footer={footer}
    >
      <div className="help-content">
        <h3>Objective</h3>
        <p>Control 70% of strategic nodes to achieve victory!</p>
        
        <h3>Node Types</h3>
        <ul>
          <li><strong>🏰 Cities:</strong> Generate gold and supplies, enable troop recruitment</li>
          <li><strong>⛏️ Resource Nodes:</strong> Provide valuable resources for your empire</li>
          <li><strong>🛡️ Fortresses:</strong> Defensive strongholds with high garrison value</li>
          <li><strong>✨ Shrines:</strong> Ancient sites that provide magical power</li>
          <li><strong>💀 Enemy Strongholds:</strong> Heavily fortified enemy positions</li>
        </ul>

        <h3>Commander Classes</h3>
        <ul>
          <li><strong>⚔️ Knight:</strong> Tank unit with high defense and Shield Wall ability</li>
          <li><strong>🔮 Mage:</strong> AOE damage dealer with Fireball ability</li>
          <li><strong>🏹 Ranger:</strong> Scout with mobility and Stealth ability</li>
          <li><strong>👑 Warlord:</strong> Leadership buffs with Rally ability</li>
        </ul>

        <h3>Combat System</h3>
        <p>Rock-Paper-Scissors mechanics:</p>
        <ul>
          <li>Cavalry beats Archers</li>
          <li>Archers beat Soldiers</li>
          <li>Soldiers beat Cavalry</li>
          <li>Mages disrupt all but are fragile</li>
        </ul>

        <h3>How to Play</h3>
        <ol>
          <li>Click on your nodes to select them</li>
          <li>Click on adjacent enemy nodes to attack</li>
          <li>Recruit commanders and assign them to nodes</li>
          <li>Manage your resources and supply lines</li>
          <li>End your turn to let enemies respond</li>
        </ol>

        <h3>Victory Conditions</h3>
        <p>Achieve victory by controlling 70% of all nodes on the map. Each node has different strategic value and resource generation capabilities.</p>
      </div>
    </Modal>
  );
};
