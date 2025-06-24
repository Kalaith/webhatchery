// Game Data
const GAME_DATA = {
  planetTypes: [
    {"name": "Rocky", "baseTemp": 15, "baseAtmo": 0.3, "baseWater": 0.1, "baseGrav": 1.0, "baseRad": 0.2},
    {"name": "Ice World", "baseTemp": -40, "baseAtmo": 0.1, "baseWater": 0.8, "baseGrav": 0.8, "baseRad": 0.1},
    {"name": "Volcanic", "baseTemp": 80, "baseAtmo": 0.6, "baseWater": 0.0, "baseGrav": 1.2, "baseRad": 0.4},
    {"name": "Desert", "baseTemp": 50, "baseAtmo": 0.2, "baseWater": 0.05, "baseGrav": 0.9, "baseRad": 0.3},
    {"name": "Gas Dwarf", "baseTemp": -20, "baseAtmo": 2.0, "baseWater": 0.3, "baseGrav": 0.6, "baseRad": 0.15}
  ],
  alienSpecies: [
    {
      "name": "Pyrothane Lizards",
      "description": "Cold-blooded reptilian species that thrive in volcanic environments",
      "tempRange": [80, 120],
      "atmoRange": [0.8, 1.5],
      "waterRange": [0.0, 0.3],
      "gravRange": [0.8, 1.3],
      "radRange": [0.2, 0.8],
      "basePrice": 5000,
      "color": "#FF4500"
    },
    {
      "name": "Cryophyte Crystals",
      "description": "Silicon-based beings that prefer frigid, high-radiation worlds",
      "tempRange": [-50, -10],
      "atmoRange": [0.1, 0.4],
      "waterRange": [0.1, 0.6],
      "gravRange": [0.5, 1.2],
      "radRange": [0.6, 1.0],
      "basePrice": 4500,
      "color": "#00BFFF"
    },
    {
      "name": "Aquatic Molluscoids",
      "description": "Ocean-dwelling species requiring high humidity and water coverage",
      "tempRange": [10, 30],
      "atmoRange": [0.8, 1.2],
      "waterRange": [0.7, 1.0],
      "gravRange": [0.7, 1.1],
      "radRange": [0.1, 0.3],
      "basePrice": 6000,
      "color": "#20B2AA"
    },
    {
      "name": "Desert Nomads",
      "description": "Hardy species adapted to hot, arid environments",
      "tempRange": [60, 90],
      "atmoRange": [0.1, 0.3],
      "waterRange": [0.0, 0.1],
      "gravRange": [0.8, 1.2],
      "radRange": [0.3, 0.7],
      "basePrice": 4000,
      "color": "#DEB887"
    },
    {
      "name": "High-Gravity Hunters",
      "description": "Powerful beings that evolved in dense, high-gravity worlds",
      "tempRange": [20, 40],
      "atmoRange": [1.0, 1.8],
      "waterRange": [0.2, 0.5],
      "gravRange": [2.0, 3.0],
      "radRange": [0.1, 0.4],
      "basePrice": 7000,
      "color": "#8B4513"
    },
    {
      "name": "Energy Feeders",
      "description": "Ethereal beings that consume radiation and electromagnetic energy",
      "tempRange": [-10, 60],
      "atmoRange": [0.0, 0.2],
      "waterRange": [0.0, 0.4],
      "gravRange": [0.3, 1.0],
      "radRange": [0.8, 1.0],
      "basePrice": 5500,
      "color": "#9400D3"
    }
  ],
  terraformingTools: [
    {
      "name": "Heat Generator",
      "category": "temperature",
      "effect": {"temperature": 10},
      "cost": 100,
      "description": "Raises planetary temperature through controlled fusion reactions"
    },
    {
      "name": "Cooling System",
      "category": "temperature", 
      "effect": {"temperature": -10},
      "cost": 100,
      "description": "Reduces temperature using orbital solar shades and heat dispersal"
    },
    {
      "name": "Atmosphere Processor",
      "category": "atmosphere",
      "effect": {"atmosphere": 0.2},
      "cost": 150,
      "description": "Generates breathable atmosphere from planetary materials"
    },
    {
      "name": "Atmospheric Scrubber",
      "category": "atmosphere",
      "effect": {"atmosphere": -0.2},
      "cost": 150,
      "description": "Removes excess atmospheric gases through molecular filtration"
    },
    {
      "name": "Ice Comet Bombardment",
      "category": "water",
      "effect": {"water": 0.15, "temperature": -5},
      "cost": 200,
      "description": "Directs ice comets to increase planetary water content"
    },
    {
      "name": "Ocean Former",
      "category": "water",
      "effect": {"water": 0.1},
      "cost": 120,
      "description": "Terraforms land into ocean basins and manages water distribution"
    },
    {
      "name": "Gravity Intensifier",
      "category": "gravity",
      "effect": {"gravity": 0.3},
      "cost": 300,
      "description": "Increases planetary mass through controlled matter compression"
    },
    {
      "name": "Magnetic Field Generator",
      "category": "radiation",
      "effect": {"radiation": -0.2},
      "cost": 250,
      "description": "Creates protective magnetic field to deflect harmful radiation"
    }
  ],
  planetNames: [
    "Kepler-442b", "Proxima Centauri c", "TRAPPIST-1e", "Tau Ceti f", "Gliese 667Cc",
    "HD 40307g", "Wolf 1061c", "K2-18b", "TOI-715b", "LHS 1140b", "GJ 273b",
    "Ross 128b", "Kapteyn b", "Barnard's Star b", "AD Leonis b"
  ]
};

// Game State
class GameState {
  constructor() {
    this.credits = 10000;
    this.planets = [];
    this.currentPlanet = null;
    this.alienBuyers = [];
    this.usedPlanetNames = new Set();
    this.gameStarted = false;
  }

  addCredits(amount) {
    this.credits += amount;
    this.updateUI();
  }

  spendCredits(amount) {
    if (this.credits >= amount) {
      this.credits -= amount;
      this.updateUI();
      return true;
    }
    return false;
  }

  updateUI() {
    document.getElementById('credits').textContent = this.credits.toLocaleString();
    document.getElementById('currentPlanetName').textContent = 
      this.currentPlanet ? this.currentPlanet.name : 'None';
  }
}

// Planet Class
class Planet {
  constructor(type, name) {
    this.type = type;
    this.name = name;
    this.temperature = type.baseTemp + (Math.random() - 0.5) * 20;
    this.atmosphere = Math.max(0, type.baseAtmo + (Math.random() - 0.5) * 0.4);
    this.water = Math.max(0, Math.min(1, type.baseWater + (Math.random() - 0.5) * 0.3));
    this.gravity = Math.max(0.1, type.baseGrav + (Math.random() - 0.5) * 0.4);
    this.radiation = Math.max(0, type.baseRad + (Math.random() - 0.5) * 0.3);
    this.purchasePrice = this.calculatePrice();
  }

  calculatePrice() {
    return Math.floor(1000 + Math.random() * 2000);
  }

  applyTool(tool) {
    const effects = tool.effect;
    
    if (effects.temperature) {
      this.temperature = Math.max(-100, Math.min(200, this.temperature + effects.temperature));
    }
    if (effects.atmosphere) {
      this.atmosphere = Math.max(0, Math.min(3, this.atmosphere + effects.atmosphere));
    }
    if (effects.water) {
      this.water = Math.max(0, Math.min(1, this.water + effects.water));
    }
    if (effects.gravity) {
      this.gravity = Math.max(0.1, Math.min(5, this.gravity + effects.gravity));
    }
    if (effects.radiation) {
      this.radiation = Math.max(0, Math.min(2, this.radiation + effects.radiation));
    }
  }

  getCompatibilityScore(alien) {
    let score = 0;
    let maxScore = 5;

    // Temperature compatibility
    if (this.temperature >= alien.tempRange[0] && this.temperature <= alien.tempRange[1]) {
      score += 1;
    }
    
    // Atmosphere compatibility
    if (this.atmosphere >= alien.atmoRange[0] && this.atmosphere <= alien.atmoRange[1]) {
      score += 1;
    }
    
    // Water compatibility
    if (this.water >= alien.waterRange[0] && this.water <= alien.waterRange[1]) {
      score += 1;
    }
    
    // Gravity compatibility
    if (this.gravity >= alien.gravRange[0] && this.gravity <= alien.gravRange[1]) {
      score += 1;
    }
    
    // Radiation compatibility
    if (this.radiation >= alien.radRange[0] && this.radiation <= alien.radRange[1]) {
      score += 1;
    }

    return score / maxScore;
  }
}

// Game instance
const game = new GameState();

// DOM Elements
const elements = {
  credits: document.getElementById('credits'),
  currentPlanetName: document.getElementById('currentPlanetName'),
  planetSphere: document.getElementById('planetSphere'),
  tempValue: document.getElementById('tempValue'),
  atmoValue: document.getElementById('atmoValue'),
  waterValue: document.getElementById('waterValue'),
  gravValue: document.getElementById('gravValue'),
  radValue: document.getElementById('radValue'),
  tempBar: document.getElementById('tempBar'),
  atmoBar: document.getElementById('atmoBar'),
  waterBar: document.getElementById('waterBar'),
  gravBar: document.getElementById('gravBar'),
  radBar: document.getElementById('radBar'),
  alienBuyers: document.getElementById('alienBuyers'),
  planetInventory: document.getElementById('planetInventory'),
  buyPlanetBtn: document.getElementById('buyPlanetBtn'),
  buyPlanetBtn2: document.getElementById('buyPlanetBtn2'),
  planetModal: document.getElementById('planetModal'),
  planetOptions: document.getElementById('planetOptions'),
  tutorial: document.getElementById('tutorial'),
  startGameBtn: document.getElementById('startGameBtn'),
  gameMessages: document.getElementById('gameMessages'),
  closeModalBtn: document.getElementById('closeModalBtn')
};

// Initialize game
function initGame() {
  renderTerraformingTools();
  generateAlienBuyers();
  setInterval(refreshAlienMarket, 30000); // Refresh market every 30 seconds
  
  // Event listeners
  elements.buyPlanetBtn.addEventListener('click', showPlanetPurchaseModal);
  elements.buyPlanetBtn2.addEventListener('click', showPlanetPurchaseModal);
  elements.startGameBtn.addEventListener('click', startGame);
  elements.closeModalBtn.addEventListener('click', closePlanetModal);
  
  // Close modal when clicking outside
  elements.planetModal.addEventListener('click', (e) => {
    if (e.target === elements.planetModal) {
      closePlanetModal();
    }
  });
}

function startGame() {
  game.gameStarted = true;
  elements.tutorial.classList.add('hidden');
  showMessage('Welcome to Terraforming Co! Buy your first planet to get started.', 'success');
}

function renderTerraformingTools() {
  const categories = ['temperature', 'atmosphere', 'water', 'gravity', 'radiation'];
  
  categories.forEach(category => {
    const container = document.getElementById(category + 'Tools');
    const tools = GAME_DATA.terraformingTools.filter(tool => tool.category === category);
    
    tools.forEach(tool => {
      const button = document.createElement('button');
      button.className = 'tool-btn';
      button.innerHTML = `
        <div class="tool-name">${tool.name}</div>
        <div class="tool-cost">Cost: ${tool.cost} credits</div>
        <div class="tool-description">${tool.description}</div>
      `;
      
      button.addEventListener('click', () => useTool(tool));
      container.appendChild(button);
    });
  });
}

function useTool(tool) {
  if (!game.currentPlanet) {
    showMessage('Select a planet first!', 'error');
    return;
  }
  
  if (!game.spendCredits(tool.cost)) {
    showMessage('Not enough credits!', 'error');
    return;
  }
  
  game.currentPlanet.applyTool(tool);
  updatePlanetDisplay();
  updateAlienCompatibility();
  showMessage(`Used ${tool.name}`, 'success');
}

function generateAlienBuyers() {
  game.alienBuyers = [];
  const numBuyers = 3 + Math.floor(Math.random() * 2); // 3-4 buyers
  
  for (let i = 0; i < numBuyers; i++) {
    const species = GAME_DATA.alienSpecies[Math.floor(Math.random() * GAME_DATA.alienSpecies.length)];
    const buyer = {
      ...species,
      id: Date.now() + i,
      timeLeft: 60 + Math.random() * 120, // 1-3 minutes
      currentPrice: species.basePrice + Math.floor((Math.random() - 0.5) * 1000)
    };
    game.alienBuyers.push(buyer);
  }
  
  renderAlienBuyers();
}

function renderAlienBuyers() {
  elements.alienBuyers.innerHTML = '';
  
  game.alienBuyers.forEach(buyer => {
    const buyerElement = document.createElement('div');
    buyerElement.className = 'alien-buyer';
    buyerElement.style.borderLeftColor = buyer.color;
    buyerElement.style.borderLeftWidth = '4px';
    
    buyerElement.innerHTML = `
      <div class="alien-header">
        <div class="alien-name">${buyer.name}</div>
        <div class="alien-price">${buyer.currentPrice.toLocaleString()}₵</div>
      </div>
      <div class="alien-description">${buyer.description}</div>
      <div class="alien-preferences">
        <div class="preference-match">
          <div class="match-indicator" data-type="temp"></div>
          <span>Temp: ${buyer.tempRange[0]}°C to ${buyer.tempRange[1]}°C</span>
        </div>
        <div class="preference-match">
          <div class="match-indicator" data-type="atmo"></div>
          <span>Atmosphere: ${buyer.atmoRange[0]}x to ${buyer.atmoRange[1]}x</span>
        </div>
        <div class="preference-match">
          <div class="match-indicator" data-type="water"></div>
          <span>Water: ${Math.round(buyer.waterRange[0]*100)}% to ${Math.round(buyer.waterRange[1]*100)}%</span>
        </div>
        <div class="preference-match">
          <div class="match-indicator" data-type="grav"></div>
          <span>Gravity: ${buyer.gravRange[0]}x to ${buyer.gravRange[1]}x</span>
        </div>
        <div class="preference-match">
          <div class="match-indicator" data-type="rad"></div>
          <span>Radiation: ${buyer.radRange[0]}x to ${buyer.radRange[1]}x</span>
        </div>
      </div>
      <button class="btn btn--primary sell-btn" onclick="sellPlanet('${buyer.id}')">
        Sell Planet
      </button>
    `;
    
    elements.alienBuyers.appendChild(buyerElement);
  });
  
  updateAlienCompatibility();
}

function updateAlienCompatibility() {
  if (!game.currentPlanet) {
    // If no planet selected, show all indicators as neutral
    game.alienBuyers.forEach(buyer => {
      const buyerElement = elements.alienBuyers.querySelector(`[onclick="sellPlanet('${buyer.id}')"]`).parentElement;
      const indicators = buyerElement.querySelectorAll('.match-indicator');
      const sellBtn = buyerElement.querySelector('.sell-btn');
      
      indicators.forEach(indicator => {
        indicator.className = 'match-indicator';
      });
      
      sellBtn.disabled = true;
      sellBtn.textContent = 'No Planet Selected';
    });
    return;
  }
  
  game.alienBuyers.forEach(buyer => {
    const buyerElement = elements.alienBuyers.querySelector(`[onclick="sellPlanet('${buyer.id}')"]`).parentElement;
    const indicators = buyerElement.querySelectorAll('.match-indicator');
    const planet = game.currentPlanet;
    
    // Temperature
    const tempMatch = planet.temperature >= buyer.tempRange[0] && planet.temperature <= buyer.tempRange[1];
    indicators[0].className = `match-indicator ${tempMatch ? 'good' : ''}`;
    
    // Atmosphere
    const atmoMatch = planet.atmosphere >= buyer.atmoRange[0] && planet.atmosphere <= buyer.atmoRange[1];
    indicators[1].className = `match-indicator ${atmoMatch ? 'good' : ''}`;
    
    // Water
    const waterMatch = planet.water >= buyer.waterRange[0] && planet.water <= buyer.waterRange[1];
    indicators[2].className = `match-indicator ${waterMatch ? 'good' : ''}`;
    
    // Gravity
    const gravMatch = planet.gravity >= buyer.gravRange[0] && planet.gravity <= buyer.gravRange[1];
    indicators[3].className = `match-indicator ${gravMatch ? 'good' : ''}`;
    
    // Radiation
    const radMatch = planet.radiation >= buyer.radRange[0] && planet.radiation <= buyer.radRange[1];
    indicators[4].className = `match-indicator ${radMatch ? 'good' : ''}`;
    
    // Update sell button based on compatibility
    const compatibility = planet.getCompatibilityScore(buyer);
    const sellBtn = buyerElement.querySelector('.sell-btn');
    sellBtn.disabled = compatibility < 0.6; // Need at least 60% compatibility
    
    if (compatibility >= 0.8) {
      sellBtn.textContent = `Sell for ${Math.floor(buyer.currentPrice * 1.2).toLocaleString()}₵`;
    } else if (compatibility >= 0.6) {
      sellBtn.textContent = `Sell for ${buyer.currentPrice.toLocaleString()}₵`;
    } else {
      sellBtn.textContent = 'Incompatible';
    }
  });
}

function sellPlanet(buyerId) {
  if (!game.currentPlanet) {
    showMessage('No planet selected!', 'error');
    return;
  }
  
  const buyer = game.alienBuyers.find(b => b.id == buyerId);
  if (!buyer) return;
  
  const compatibility = game.currentPlanet.getCompatibilityScore(buyer);
  if (compatibility < 0.6) {
    showMessage('Planet is not compatible with this species!', 'error');
    return;
  }
  
  let salePrice = buyer.currentPrice;
  if (compatibility >= 0.8) {
    salePrice = Math.floor(salePrice * 1.2);
  }
  
  // Remove planet from inventory
  game.planets = game.planets.filter(p => p !== game.currentPlanet);
  game.currentPlanet = null;
  
  // Remove buyer from market
  game.alienBuyers = game.alienBuyers.filter(b => b.id !== buyer.id);
  
  // Add credits
  game.addCredits(salePrice);
  
  // Update UI
  renderPlanetInventory();
  renderAlienBuyers();
  clearPlanetDisplay();
  
  showMessage(`Sold planet to ${buyer.name} for ${salePrice.toLocaleString()}₵!`, 'success');
  
  // Generate new buyer
  setTimeout(() => {
    const species = GAME_DATA.alienSpecies[Math.floor(Math.random() * GAME_DATA.alienSpecies.length)];
    const newBuyer = {
      ...species,
      id: Date.now(),
      timeLeft: 60 + Math.random() * 120,
      currentPrice: species.basePrice + Math.floor((Math.random() - 0.5) * 1000)
    };
    game.alienBuyers.push(newBuyer);
    renderAlienBuyers();
  }, 2000);
}

function showPlanetPurchaseModal() {
  if (!game.gameStarted) {
    showMessage('Complete the tutorial first!', 'error');
    return;
  }
  
  elements.planetOptions.innerHTML = '';
  
  // Generate 3-4 planet options
  for (let i = 0; i < 3 + Math.floor(Math.random() * 2); i++) {
    const planetType = GAME_DATA.planetTypes[Math.floor(Math.random() * GAME_DATA.planetTypes.length)];
    const planetName = getRandomPlanetName();
    const planet = new Planet(planetType, planetName);
    
    const option = document.createElement('div');
    option.className = 'planet-option';
    option.innerHTML = `
      <div class="option-preview" style="background: ${getPlanetColor(planet)}"></div>
      <div class="option-info">
        <div class="option-name">${planet.name}</div>
        <div class="option-type">${planet.type.name}</div>
        <div class="option-price">${planet.purchasePrice.toLocaleString()}₵</div>
      </div>
    `;
    
    option.addEventListener('click', () => purchasePlanet(planet));
    elements.planetOptions.appendChild(option);
  }
  
  elements.planetModal.classList.add('active');
}

function purchasePlanet(planet) {
  if (!game.spendCredits(planet.purchasePrice)) {
    showMessage('Not enough credits!', 'error');
    return;
  }
  
  game.planets.push(planet);
  game.currentPlanet = planet;
  closePlanetModal();
  renderPlanetInventory();
  updatePlanetDisplay();
  showMessage(`Purchased ${planet.name}!`, 'success');
}

function closePlanetModal() {
  elements.planetModal.classList.remove('active');
}

function getRandomPlanetName() {
  let name;
  do {
    name = GAME_DATA.planetNames[Math.floor(Math.random() * GAME_DATA.planetNames.length)];
  } while (game.usedPlanetNames.has(name));
  
  game.usedPlanetNames.add(name);
  return name;
}

function getPlanetColor(planet) {
  // Base color on temperature and water
  if (planet.water > 0.5) {
    return '#4682B4'; // Steel blue for water worlds
  } else if (planet.temperature > 60) {
    return '#B22222'; // Fire brick for hot worlds
  } else if (planet.temperature < -10) {
    return '#E0E6FF'; // Light blue for ice worlds
  } else {
    return '#8B4513'; // Saddle brown for rocky worlds
  }
}

function renderPlanetInventory() {
  if (game.planets.length === 0) {
    elements.planetInventory.innerHTML = '<div class="no-planets">No planets owned. Buy your first planet to get started!</div>';
    return;
  }
  
  elements.planetInventory.innerHTML = '';
  
  game.planets.forEach(planet => {
    const thumbnail = document.createElement('div');
    thumbnail.className = `planet-thumbnail ${planet === game.currentPlanet ? 'active' : ''}`;
    thumbnail.innerHTML = `
      <div class="planet-preview" style="background: ${getPlanetColor(planet)}"></div>
      <div class="planet-info">
        <div class="planet-name">${planet.name}</div>
        <div class="planet-type">${planet.type.name}</div>
      </div>
    `;
    
    thumbnail.addEventListener('click', () => selectPlanet(planet));
    elements.planetInventory.appendChild(thumbnail);
  });
}

function selectPlanet(planet) {
  game.currentPlanet = planet;
  renderPlanetInventory();
  updatePlanetDisplay();
  updateAlienCompatibility();
}

function updatePlanetDisplay() {
  if (!game.currentPlanet) {
    clearPlanetDisplay();
    return;
  }
  
  const planet = game.currentPlanet;
  
  // Update visual appearance
  const surface = elements.planetSphere.querySelector('.planet-surface');
  const atmosphere = elements.planetSphere.querySelector('.planet-atmosphere');
  const water = elements.planetSphere.querySelector('.planet-water');
  
  surface.style.background = getPlanetColor(planet);
  atmosphere.style.opacity = Math.min(planet.atmosphere, 1);
  water.style.opacity = planet.water;
  
  // Update stats
  elements.tempValue.textContent = `${Math.round(planet.temperature)}°C`;
  elements.atmoValue.textContent = `${planet.atmosphere.toFixed(1)}x`;
  elements.waterValue.textContent = `${Math.round(planet.water * 100)}%`;
  elements.gravValue.textContent = `${planet.gravity.toFixed(1)}x`;
  elements.radValue.textContent = `${planet.radiation.toFixed(1)}x`;
  
  // Update stat bars
  elements.tempBar.style.width = `${Math.max(0, Math.min(100, (planet.temperature + 50) / 150 * 100))}%`;
  elements.atmoBar.style.width = `${Math.min(100, planet.atmosphere / 2 * 100)}%`;
  elements.waterBar.style.width = `${planet.water * 100}%`;
  elements.gravBar.style.width = `${Math.min(100, planet.gravity / 3 * 100)}%`;
  elements.radBar.style.width = `${Math.min(100, planet.radiation / 1.5 * 100)}%`;
  
  game.updateUI();
}

function clearPlanetDisplay() {
  elements.tempValue.textContent = '0°C';
  elements.atmoValue.textContent = '0.0x';
  elements.waterValue.textContent = '0%';
  elements.gravValue.textContent = '0.0x';
  elements.radValue.textContent = '0.0x';
  
  const bars = [elements.tempBar, elements.atmoBar, elements.waterBar, elements.gravBar, elements.radBar];
  bars.forEach(bar => bar.style.width = '0%');
  
  const surface = elements.planetSphere.querySelector('.planet-surface');
  const atmosphere = elements.planetSphere.querySelector('.planet-atmosphere');
  const water = elements.planetSphere.querySelector('.planet-water');
  
  surface.style.background = '#8B4513';
  atmosphere.style.opacity = '0';
  water.style.opacity = '0';
}

function showMessage(text, type = 'info') {
  const message = document.createElement('div');
  message.className = `game-message ${type}`;
  message.textContent = text;
  
  elements.gameMessages.appendChild(message);
  
  setTimeout(() => {
    message.remove();
  }, 3000);
}

function refreshAlienMarket() {
  // Remove oldest buyer and add new one
  if (game.alienBuyers.length > 0) {
    game.alienBuyers.shift();
    
    const species = GAME_DATA.alienSpecies[Math.floor(Math.random() * GAME_DATA.alienSpecies.length)];
    const newBuyer = {
      ...species,
      id: Date.now(),
      timeLeft: 60 + Math.random() * 120,
      currentPrice: species.basePrice + Math.floor((Math.random() - 0.5) * 1000)
    };
    game.alienBuyers.push(newBuyer);
    
    renderAlienBuyers();
    showMessage('New buyer entered the market!', 'info');
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);