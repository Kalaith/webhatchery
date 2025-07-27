import { useEffect } from 'react';
import { useGameStore } from '../stores/useGameStore';

export const useGameLogic = () => {
  const { 
    initializeGame, 
    gameOver,
    winner,
    addBattleLog,
    nodes
  } = useGameStore(state => ({
    initializeGame: state.initializeGame,
    gameOver: state.gameOver,
    winner: state.winner,
    addBattleLog: state.addBattleLog,
    nodes: state.nodes
  }));

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Check victory condition when nodes change, but only if game is not over
  useEffect(() => {
    if (!gameOver) {
      const totalNodes = nodes.length;
      const playerNodes = nodes.filter(node => node.owner === 'player').length;
      const playerControlPercentage = playerNodes / totalNodes;
      
      if (playerControlPercentage >= 0.7) { // VICTORY_CONTROL_PERCENTAGE
        // Victory will be handled by the store
        addBattleLog('🎉 Victory! You have conquered the realm!', 'victory');
      }
    }
  }, [nodes, gameOver, addBattleLog]);

  // Add victory/defeat message when game ends
  useEffect(() => {
    if (gameOver && winner) {
      const message = winner === 'player' 
        ? '🏆 Game Over! Victory achieved!' 
        : '💀 Game Over! Defeat!';
      addBattleLog(message, winner === 'player' ? 'victory' : 'defeat');
    }
  }, [gameOver, winner, addBattleLog]);

  return {
    gameOver,
    winner
  };
};
