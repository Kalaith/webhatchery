import React, { useState } from 'react';
import { RECIPES, MATERIALS } from '../../constants/gameData';
import { useGameStore } from '../../stores/gameStore';
import { MAX_HAMMER_CLICKS, QUALITY_THRESHOLDS } from '../../constants/gameConfig';

interface CraftingInterfaceProps {
  selectedRecipe: string | null;
  canCraft: boolean;
}

const CraftingInterface: React.FC<CraftingInterfaceProps> = ({ selectedRecipe, canCraft }) => {
  const { state, setState } = useGameStore();
  if (!state || !state.materials || !state.inventory) return null;
  const { materials, inventory } = state;
  const recipe = RECIPES.find(r => r.name === selectedRecipe);
  const [hammerClicks, setHammerClicks] = useState(0);
  const [hammerAccuracy, setHammerAccuracy] = useState(0);
  const [craftingStarted, setCraftingStarted] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!recipe) return null;

  // Calculate total cost
  const totalCost = Object.entries(recipe.materials).reduce((sum, [mat, qty]) => {
    const matObj = MATERIALS.find(m => m.name === mat);
    return sum + (matObj ? matObj.cost * qty : 0);
  }, 0);

  // Start crafting
  const handleStartCrafting = () => {
    if (!canCraft) return;
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
    if (!craftingStarted || hammerClicks >= MAX_HAMMER_CLICKS) return;
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
  
  return (
    <div className="crafting-interface">
      <div className="recipe-details">
        <h4>{recipe.icon} {recipe.name}</h4>
        <div className="required-materials">
          {Object.entries(recipe.materials).map(([mat, qty]) => (
            <div key={mat} className={`material-requirement${(materials[mat] ?? 0) < qty ? ' insufficient' : ''}`}>
              {mat}: {qty} (Owned: {materials[mat] ?? 0})
            </div>
          ))}
        </div>
        <div className="crafting-cost">
          <span>Total Cost: </span>
          <span>{totalCost}</span> gold
        </div>
      </div>
      {!craftingStarted ? (
        <button
          className="btn btn--primary"
          onClick={handleStartCrafting}
          disabled={!canCraft}
        >Start Crafting</button>
      ) : (
        <div className="crafting-mini-game">
          <h4>Hammer Mini-game</h4>
          <div>Hits: {hammerClicks} / {MAX_HAMMER_CLICKS}</div>
          <div>Accuracy: {hammerAccuracy}%</div>
          <button
            className="btn btn--primary"
            onClick={handleHammer}
            disabled={hammerClicks >= MAX_HAMMER_CLICKS}
          >⚒️ HAMMER!</button>
          {result && (
            <div style={{ marginTop: '16px' }}>
              <div className="status status--success">{result} Quality Crafted!</div>
              <div>Item added to inventory.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CraftingInterface;
