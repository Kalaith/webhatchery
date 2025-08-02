import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, Player, Customer } from '../types/game';
import { MATERIALS, RECIPES, CUSTOMERS, FORGE_UPGRADES } from '../constants/gameData';

const defaultState: GameState = {
  player: { gold: 100, reputation: 0, level: 1, experience: 0 },
  inventory: [],
  unlockedRecipes: ['Iron Dagger', 'Iron Sword'],
  materials: {
    'Iron Ore': 0,
    'Coal': 0,
    'Wood': 0,
    'Leather': 0,
    'Silver Ore': 0,
    'Mythril': 0
  },
  forgeUpgrades: [],
  forgeLit: false,
  currentCustomer: null,
  tutorialCompleted: false,
  tutorialStep: 0
};

interface GameContextType {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(defaultState);

  const resetGame = useCallback(() => setState(defaultState), []);

  return (
    <GameContext.Provider value={{ state, setState, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
