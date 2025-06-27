import { useState, useEffect, useCallback } from 'react';
import type { Planet, PlanetType, Tool, Species, Alien } from '../types/entities';
// Import color utility functions
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '../utils/colorUtils';
import { fetchGameData } from '../api/fetchGameData';

// Utility functions
export const randomItem = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];

// Planet class logic as a factory function
function createPlanet(type: PlanetType, name: string): Planet {
  return {
    id: `planet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    name,
    temperature: type.baseTemp + (Math.random() - 0.5) * 20,
    atmosphere: Math.max(0, type.baseAtmo + (Math.random() - 0.5) * 0.4),
    water: Math.max(0, Math.min(1, type.baseWater + (Math.random() - 0.5) * 0.3)),
    gravity: Math.max(0.1, type.baseGrav + (Math.random() - 0.5) * 0.4),
    radiation: Math.max(0, type.baseRad + (Math.random() - 0.5) * 0.3),
    purchasePrice: Math.floor(1000 + Math.random() * 2000),
    color: type.color // Ensure color is assigned
  };
}

// Alien species generator - ensures unique species
function generateRandomSpecies(types: Species[], count: number): Species[] {
  if (types.length === 0) return [];
  
  // If we need more species than available, just return all available species
  if (count >= types.length) {
    return [...types];
  }
  
  // Create a copy of the array and shuffle it to get random unique selections
  const shuffled = [...types];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' items from the shuffled array
  return shuffled.slice(0, count);
}

// Utility functions (add to existing ones)
function getRandomPlanetName(planetNames: string[], usedPlanetNames: Set<string>): string {
  if (planetNames && planetNames.length > 0 && usedPlanetNames.size < planetNames.length) {
    let name;
    do {
      name = randomItem(planetNames);
    } while (usedPlanetNames.has(name));
    usedPlanetNames.add(name);
    return name;
  }
  // Otherwise, generate a procedural name
  const starPrefixes = ["HD", "Kepler", "Gliese", "Epsilon", "Tau", "TYC", "Alpha", "Delta", "Theta", "Zeta", "Xeno", "Vesmir", "PX", "LV", "LX"];
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const prefix = randomItem(starPrefixes);
  const code = Math.floor(100 + Math.random() * 9000);
  const suffix = Math.random() < 0.5 ? String.fromCharCode(97 + Math.floor(Math.random() * 3)) : '';
  const roman = Math.random() < 0.3 ? ' ' + randomItem(romanNumerals) : '';
  let name = `${prefix}-${code}${suffix}${roman}`.trim();
  let tries = 0;
  while (usedPlanetNames.has(name) && tries < 10) {
    name = `${prefix}-${Math.floor(100 + Math.random() * 9000)}${suffix}${roman}`.trim();
    tries++;
  }
  usedPlanetNames.add(name);
  return name;
}

// Move usedPlanetNames definition to the top-level scope
const usedPlanetNames = new Set<string>();

export function useGame() {
  // Game state
  const [credits, setCredits] = useState(10000);
  const [alienBuyers, setAlienBuyers] = useState<Alien[]>([]);
  const [messages, setMessages] = useState<{ id: number; msg: string; type: 'info' | 'success' | 'error' }[]>([]);
  const [planetOptions, setPlanetOptions] = useState<Planet[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState({
    planetTypes: [],
    alienSpecies: [],
    terraformingTools: [] as Tool[],
    planetNames: [],
  });
  const [alienSpeciesTypes, setAlienSpeciesTypes] = useState([]);
  const [planetModalOpen, setPlanetModalOpen] = useState(false);

  // Load game data from /api endpoints
  useEffect(() => {
    fetchGameData()
      .then(({ planetTypes, alienSpecies, terraformingTools, planetNames, alienSpeciesTypes }) => {
        setGameData({ planetTypes, alienSpecies, terraformingTools, planetNames });
        setAlienSpeciesTypes(alienSpeciesTypes);
      })
      .catch(err => console.error('Failed to load game data:', err));
  }, []);

  // Alien buyers refresh
  useEffect(() => {
    if (!alienSpeciesTypes.length) return;
    function refreshBuyers() {
      const uniqueSpecies = generateRandomSpecies(alienSpeciesTypes, 4);
      setAlienBuyers(
        uniqueSpecies.map((s, i) => ({
          ...s,
          id: Date.now() + i,
          currentPrice: s.basePrice + Math.floor(Math.random() * 500) - 250, // Add some price variation
        })) as Alien[]
      );
    }
    refreshBuyers();
    const interval = setInterval(refreshBuyers, 30000);
    return () => clearInterval(interval);
  }, [alienSpeciesTypes]);

  // Game actions
  const addCredits = useCallback((amount: number): void => setCredits(c => c + amount), []);
  const spendCredits = useCallback((amount: number): boolean => {
    if (credits < amount) return false;
    setCredits(c => c - amount);
    return true;
  }, [credits]);
  // Show message with auto-remove
  const showMessage = useCallback((msg: string, type: 'info' | 'success' | 'error' = 'info'): void => {
    const messageId = Date.now() + Math.random(); // Unique ID for each message
    setMessages(m => [...m, { id: messageId, msg, type }]);
    setTimeout(() => {
      setMessages(msgs => msgs.filter(m => m.id !== messageId));
    }, 3000);
  }, []);

  // Planet purchase modal logic
  const showPlanetPurchaseModal = useCallback(() => {
    if (!gameStarted) {
      showMessage('Complete the tutorial first!', 'error');
      return;
    }
    // Generate planet options
    const options = [];
    for (let i = 0, n = 3 + Math.floor(Math.random() * 2); i < n; i++) {
      const planetType = randomItem(gameData.planetTypes);
      const name = getRandomPlanetName(
        gameData.planetNames,
        usedPlanetNames as Set<string>
      );
      const planet = createPlanet(planetType, name);
      options.push(planet);
    }
    setPlanetOptions(options);
    setPlanetModalOpen(true);
  }, [gameStarted, gameData, usedPlanetNames, gameData.planetNames]);

  const closePlanetModal = useCallback(() => {
    setPlanetModalOpen(false);
  }, []);

  // Purchase a planet
  const purchasePlanet = useCallback((planet: Planet): void => {
    setCredits(prevCredits => prevCredits - planet.purchasePrice);
    setPlanets(prevPlanets => [...prevPlanets, planet]);
    showMessage(`Purchased ${planet.name} for ${planet.purchasePrice}₵`, 'success');
    closePlanetModal();
  }, [closePlanetModal]);

  // Select a planet
  const selectPlanet = useCallback((planet: Planet): void => {
    setCurrentPlanet(planet);
    showMessage(`Selected ${planet.name}`, 'info');
  }, []);

  // Sell planet to buyer
  const sellPlanet = useCallback((buyer: Alien): void => {
    if (currentPlanet) {
      const price = buyer.currentPrice;
      setCredits(prevCredits => prevCredits + price);
      setPlanets(prevPlanets => prevPlanets.filter(planet => planet.id !== currentPlanet.id));
      setCurrentPlanet(null);
      showMessage(`Sold ${currentPlanet.name} to ${buyer.name} for ${price}₵`, 'success');
    } else {
      showMessage('No planet selected to sell.', 'error');
    }
  }, [currentPlanet]);

  // Apply a terraforming tool to the current planet
  const useTool = useCallback((tool: Tool): void => {
    if (!currentPlanet) {
      showMessage('Select a planet first!', 'error');
      return;
    }
    if (!spendCredits(tool.cost)) {
      showMessage('Not enough credits!', 'error');
      return;
    }
    // Apply tool effects
    const apply = (planet: Planet, stat: string, delta: number): void => {
      if (stat === 'temperature') planet.temperature = Math.max(-100, Math.min(200, (planet.temperature || 0) + delta));
      if (stat === 'atmosphere') planet.atmosphere = Math.max(0, Math.min(3, (planet.atmosphere || 0) + delta));
      if (stat === 'water') planet.water = Math.max(0, Math.min(1, (planet.water || 0) + delta));
      if (stat === 'gravity') planet.gravity = Math.max(0.1, Math.min(5, (planet.gravity || 0) + delta));
      if (stat === 'radiation') planet.radiation = Math.max(0, Math.min(2, (planet.radiation || 0) + delta));
    };
    setCurrentPlanet((planet: Planet | null): Planet | null => {
      if (!planet) return planet;
      const updated = { ...planet };
      if (tool.effect) {
        Object.entries(tool.effect).forEach(([stat, delta]) => apply(updated, stat, delta));
      }
      if (tool.sideEffects) {
        Object.entries(tool.sideEffects).forEach(([stat, delta]) => apply(updated, stat, delta));
      }
      return updated;
    });
    showMessage(`Used ${tool.name}`, 'success');
  }, [currentPlanet, spendCredits, showMessage, setCurrentPlanet]);

  // Simple research unlock system
  const unlockTool = useCallback((toolId: string): void => {
    setGameData(prevData => ({
      ...prevData,
      terraformingTools: prevData.terraformingTools.map(tool => 
        tool.id === toolId ? { ...tool, unlocked: true } : tool
      )
    }));
    showMessage(`Unlocked ${gameData.terraformingTools.find(t => t.id === toolId)?.name}!`, 'success');
  }, [gameData.terraformingTools, showMessage]);

  // Research with credits (simplified)
  const doResearch = useCallback((toolId: string, cost: number = 1000): void => {
    if (!spendCredits(cost)) {
      showMessage('Not enough credits for research!', 'error');
      return;
    }
    unlockTool(toolId);
  }, [spendCredits, unlockTool, showMessage]);

  // Tool locking: a tool is locked if it has unlocked: false in the JSON data
  const isToolLocked = useCallback((tool: Tool): boolean => {
    // Check if tool has an 'unlocked' property, if so use that
    if (tool.hasOwnProperty('unlocked')) {
      return !tool.unlocked;
    }
    // Fallback to research system (for future advanced tools)
    return false;
  }, []);

  const getPlanetColor = useCallback((planet: Planet): string => {
    // Handle cases where planet might be undefined
    if (!planet) {
      console.warn('Planet is undefined in getPlanetColor');
      return '#808080'; // Default gray color
    }

    // Use planet's direct color property if available, otherwise use type color
    let baseColor = planet.color;
    if (!baseColor && planet.type && planet.type.color) {
      baseColor = planet.type.color;
    }
    
    // If still no color, use a default
    if (!baseColor) {
      console.warn('No color found for planet:', planet.name);
      return '#808080'; // Default gray color
    }

    const { r, g, b } = hexToRgb(baseColor);
    const { h, s, l } = rgbToHsl(r, g, b);

    // Safely handle planet properties with defaults
    const gravity = planet.gravity || 1;
    const radiation = planet.radiation || 0;

    const gravityHueShift = gravity * 10;
    const adjustedHue = (h + gravityHueShift) % 360;

    const radiationBrightness = Math.min(1, radiation / 10);
    const adjustedLightness = Math.max(0, Math.min(1, l + radiationBrightness));

    const { r: newR, g: newG, b: newB } = hslToRgb(adjustedHue, s, adjustedLightness);
    return rgbToHex(Math.round(newR * 255), Math.round(newG * 255), Math.round(newB * 255));
  }, []);

  const startGame = useCallback((): void => {
    setGameStarted(true);
    showMessage('Game started! Begin terraforming planets.', 'info');
  }, []);

  return {
    credits,
    alienBuyers,
    messages,
    planetOptions,
    planets,
    currentPlanet,
    gameStarted,
    gameData,
    planetModalOpen,
    // Actions
    addCredits,
    spendCredits,
    showMessage,
    sellPlanet,
    getPlanetColor,
    showPlanetPurchaseModal,
    selectPlanet,
    closePlanetModal,
    purchasePlanet,
    startGame,
    useTool,
    isToolLocked,
    unlockTool,
    doResearch,
  };
}
