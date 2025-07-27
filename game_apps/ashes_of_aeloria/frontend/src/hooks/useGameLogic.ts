import { useGameStore } from '../stores/useGameStore';

// Extremely simple hook - just return the basic state
export const useGameLogic = () => {
  const gold = useGameStore(state => state.resources.gold);
  const turn = useGameStore(state => state.turn);
  const selectedNode = useGameStore(state => state.selectedNode);
  const gameOver = useGameStore(state => state.gameOver);
  const winner = useGameStore(state => state.winner);

  return {
    gold,
    turn,
    selectedNode,
    gameOver,
    winner
  };
};
