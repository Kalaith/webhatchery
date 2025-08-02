import { useState } from 'react';
import { RECIPES, MATERIALS } from '../constants/gameData';
import { useGameStore } from '../stores/gameStore';
import { MAX_HAMMER_CLICKS, QUALITY_THRESHOLDS } from '../constants/gameConfig';

export function useCrafting(selectedRecipe: string | null, canCraft: boolean) {
  const { state, setState } = useGameStore();
  const [hammerClicks, setHammerClicks] = useState(0);
  const [hammerAccuracy, setHammerAccuracy] = useState(0);
  const [craftingStarted, setCraftingStarted] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!state || !state.materials || !state.inventory) return {};
  const { materials, inventory } = state;
  const recipe = RECIPES.find(r => r.name === selectedRecipe);

  // Calculate total cost
  const totalCost = recipe ? Object.entries(recipe.materials).reduce((sum, [mat, qty]) => {
    const matObj = MATERIALS.find(m => m.name === mat);
    return sum + (matObj ? matObj.cost * qty : 0);
  }, 0) : 0;

  // Start crafting
  const handleStartCrafting = () => {
    if (!canCraft || !recipe) return;
    setCraftingStarted(true);
    setHammerClicks(0);
    setHammerAccuracy(0);
    setResult(null);
    // Consume materials
    setState({
      ...state,
      materials: Object.fromEntries(
        Object.entries(materials).map(([mat, amt]) => [mat, amt - (recipe.materials[mat] || 0)])
      )
    });
  };

  // Hammer mini-game logic
  const handleHammer = () => {
    if (!craftingStarted || hammerClicks >= MAX_HAMMER_CLICKS || !recipe) return;
    // Simulate accuracy: random success/fail
    const hit = Math.random() > 0.25;
    setHammerAccuracy(acc => acc + (hit ? 25 : 0));
    setHammerClicks(clicks => clicks + 1);

    if (hammerClicks + 1 === MAX_HAMMER_CLICKS) {
      // Calculate result
      let quality = 'Poor';
      if (hammerAccuracy >= QUALITY_THRESHOLDS.excellent) quality = 'Excellent';
      else if (hammerAccuracy >= QUALITY_THRESHOLDS.good) quality = 'Good';
      else if (hammerAccuracy >= QUALITY_THRESHOLDS.fair) quality = 'Fair';
      setResult(quality);

      // Add item to inventory
      setState({
        ...state,
        inventory: [
          ...inventory,
          {
            name: recipe.name,
            icon: recipe.icon,
            quality,
            value: Math.floor(recipe.sellPrice * (quality === 'Excellent' ? 1.2 : quality === 'Good' ? 1.1 : quality === 'Fair' ? 1 : 0.8)),
            type: 'weapon'
          }
        ]
      });
    }
  };

  return {
    recipe,
    materials,
    totalCost,
    hammerClicks,
    hammerAccuracy,
    craftingStarted,
    result,
    handleStartCrafting,
    handleHammer
  };
}
