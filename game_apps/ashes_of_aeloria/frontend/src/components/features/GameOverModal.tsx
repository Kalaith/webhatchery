/**
 * Game Over Modal Component
 * Displays victory/defeat screen with restart option
 */

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/EnhancedButton';
import { useGameActions } from '../../hooks/useGameActions';
import type { Owner } from '../../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  winner: Owner | null;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner
}) => {
  const { restartGame } = useGameActions();

  const handleRestart = () => {
    restartGame();
  };

  if (!isOpen || !winner) return null;

  const isVictory = winner === 'player';
  const isDefeat = winner === 'enemy';
  const isDraw = winner === 'neutral';

  // Handle the edge case of neutral winner (shouldn't happen in normal gameplay)
  const gameOutcome = isVictory ? 'victory' : isDefeat ? 'defeat' : 'draw';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} 
      title={isVictory ? 'Victory!' : isDefeat ? 'Defeat!' : 'Draw!'}
    >
      <div className="text-center p-6">
        <div className="text-6xl mb-4">
          {isVictory ? '🎉' : isDefeat ? '💀' : '🤝'}
        </div>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {isVictory 
            ? 'Congratulations! You have conquered the realm of Aeloria! Your strategic prowess has led your forces to victory.'
            : isDefeat 
            ? 'The enemy has overwhelmed your forces. Your commanders fought valiantly, but this battle is lost. Will you rise again?'
            : 'The battle has ended in a stalemate. Neither side could claim decisive victory. Regroup and try a different strategy!'
          }
        </p>
        
        <div className="space-y-3">
          <Button
            variant={isVictory ? 'success' : 'primary'}
            size="lg"
            fullWidth
            onClick={handleRestart}
            leftIcon={isVictory ? '🎯' : isDefeat ? '⚔️' : '🔄'}
          >
            {isVictory ? 'Play Again' : isDefeat ? 'Fight Again' : 'Try Again'}
          </Button>
          
          <div className="text-xs text-gray-500">
            {isVictory 
              ? 'Challenge yourself with a new conquest!'
              : isDefeat 
              ? 'Learn from defeat and claim victory!'
              : 'Refine your strategy and attempt victory!'
            }
          </div>
        </div>
      </div>
    </Modal>
  );
};
