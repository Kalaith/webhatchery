import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Recipe } from '../types/recipe';

export function useCraftingResult(recipe: Recipe) {
  const { state, setState } = useGameStore();
  const [localResult, setLocalResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleMiniGameComplete = (hammerAccuracy: number) => {
    let quality = 'Poor';
    if (hammerAccuracy >= 80) quality = 'Excellent';
    else if (hammerAccuracy >= 60) quality = 'Good';
    else if (hammerAccuracy >= 40) quality = 'Fair';
    // Add item to inventory
    setState({
      ...state,
      inventory: [
        ...state.inventory,
        {
          name: recipe.name,
          icon: recipe.icon,
          quality,
          value: Math.floor(recipe.sellPrice * (quality === 'Excellent' ? 1.2 : quality === 'Good' ? 1.1 : quality === 'Fair' ? 1 : 0.8)),
          type: 'weapon'
        }
      ]
    });
    setLocalResult(quality);
    setShowResult(true);
  };

  return {
    localResult,
    showResult,
    handleMiniGameComplete,
    setShowResult,
  };
}
