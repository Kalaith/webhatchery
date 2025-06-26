// Game Data is now loaded from external JSON files
let GAME_DATA = {
  planetTypes: [],
  alienSpecies: [],
  terraformingTools: [],
  planetNames: []
};

let RESEARCH_DATA = [];
let playerResearch = {
  rpTotal: 0,
  unlocked: [] // names of unlocked research
};

async function loadGameData() {
  const [planetTypes, alienSpecies, terraformingTools, planetNames] = await Promise.all([
    fetch('data/planet_types.json').then(r => r.json()),
    fetch('data/alien_species.json').then(r => r.json()),
    fetch('data/terraforming_tools.json').then(r => r.json()),
    fetch('data/planet_names.json').then(r => r.json())
  ]);
  GAME_DATA.planetTypes = planetTypes;
  GAME_DATA.alienSpecies = alienSpecies;
  GAME_DATA.terraformingTools = terraformingTools;
  GAME_DATA.planetNames = planetNames;
}

async function loadResearchData() {
  RESEARCH_DATA = await fetch('data/tool_research.json').then(r => r.json());
}

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
    const apply = (stat, delta) => {
      if (stat === 'temperature') this.temperature = Math.max(-100, Math.min(200, this.temperature + delta));
      if (stat === 'atmosphere') this.atmosphere = Math.max(0, Math.min(3, this.atmosphere + delta));
      if (stat === 'water') this.water = Math.max(0, Math.min(1, this.water + delta));
      if (stat === 'gravity') this.gravity = Math.max(0.1, Math.min(5, this.gravity + delta));
      if (stat === 'radiation') this.radiation = Math.max(0, Math.min(2, this.radiation + delta));
      // Add biosphere etc as needed
    };
    if (tool.effect) {
      Object.entries(tool.effect).forEach(([stat, delta]) => apply(stat, delta));
    }
    if (tool.sideEffects) {
      Object.entries(tool.sideEffects).forEach(([stat, delta]) => apply(stat, delta));
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
  closeModalBtn: document.getElementById('closeModalBtn'),
  researchPanel: document.getElementById('researchPanel'),
  rpTotal: document.getElementById('rpTotal'),
  researchList: document.getElementById('researchList')
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

// Utility: create element with classes, innerHTML, and event listeners
function createElement(tag, { className = '', html = '', onClick = null } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html) el.innerHTML = html;
  if (onClick) el.addEventListener('click', onClick);
  return el;
}

// Utility: get random item from array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderTerraformingTools() {
  const categories = ['temperature', 'atmosphere', 'water', 'gravity', 'radiation', 'biological'];
  categories.forEach(category => {
    const container = document.getElementById(category + 'Tools');
    if (!container) return;
    container.innerHTML = '';
    GAME_DATA.terraformingTools.filter(tool => tool.category === category).forEach(tool => {
      // Tool lock/unlock logic
      const locked = tool.unlocked === false;
      let sideEffectsHtml = '';
      if (tool.sideEffects && Object.keys(tool.sideEffects).length > 0) {
        const sideList = Object.entries(tool.sideEffects)
          .map(([k,v]) => `${k}: ${v > 0 ? '+' : ''}${v}`)
          .join(', ');
        sideEffectsHtml = `<div class="tool-sideeffects"><strong>Side Effects:</strong> ${sideList}</div>`;
      }
      const upgradeHtml = tool.upgradeRequired ? `<div class="tool-upgrade">🔒 Requires: ${tool.upgradeRequired}</div>` : '';
      const tierHtml = `<div class="tool-tier">Tier ${tool.tier || 1}</div>`;
      const button = createElement('button', {
        className: `tool-btn${locked ? ' tool-locked' : ''}`,
        html: `
          <div class="tool-name">${tool.name}</div>
          <div class="tool-cost">Cost: ${tool.cost} credits</div>
          ${tierHtml}
          <div class="tool-description">${tool.description}</div>
          ${sideEffectsHtml}
          ${upgradeHtml}
        `,
        onClick: locked ? null : () => useTool(tool)
      });
      button.disabled = locked;
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
    const species = randomItem(GAME_DATA.alienSpecies);
    game.alienBuyers.push({
      ...species,
      id: Date.now() + i,
      timeLeft: 60 + Math.random() * 120,
      currentPrice: species.basePrice + Math.floor((Math.random() - 0.5) * 1000)
    });
  }
  renderAlienBuyers();
}

function renderAlienBuyers() {
  elements.alienBuyers.innerHTML = '';
  game.alienBuyers.forEach(buyer => {
    const buyerElement = createElement('div', {
      className: 'alien-buyer',
      html: `
        <div class="alien-header">
          <div class="alien-name">${buyer.name}</div>
          <div class="alien-price">${buyer.currentPrice.toLocaleString()}₵</div>
        </div>
        <div class="alien-description">${buyer.description}</div>
        <div class="alien-preferences">
          ${['temp','atmo','water','grav','rad'].map((type, idx) => `
            <div class="preference-match">
              <div class="match-indicator" data-type="${type}"></div>
              <span>${[
                `Temp: ${buyer.tempRange[0]}°C to ${buyer.tempRange[1]}°C`,
                `Atmosphere: ${buyer.atmoRange[0]}x to ${buyer.atmoRange[1]}x`,
                `Water: ${Math.round(buyer.waterRange[0]*100)}% to ${Math.round(buyer.waterRange[1]*100)}%`,
                `Gravity: ${buyer.gravRange[0]}x to ${buyer.gravRange[1]}x`,
                `Radiation: ${buyer.radRange[0]}x to ${buyer.radRange[1]}x`
              ][idx]}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn--primary sell-btn" data-buyer-id="${buyer.id}">Sell Planet</button>
      `
    });
    elements.alienBuyers.appendChild(buyerElement);
    buyerElement.querySelector('.sell-btn').addEventListener('click', () => sellPlanet(buyer.id));
  });
  updateAlienCompatibility();
}

function updateAlienCompatibility() {
  if (!game.currentPlanet) {
    game.alienBuyers.forEach(buyer => {
      const buyerElement = elements.alienBuyers.querySelector(`[data-buyer-id="${buyer.id}"]`).parentElement;
      buyerElement.querySelectorAll('.match-indicator').forEach(ind => ind.className = 'match-indicator');
      const sellBtn = buyerElement.querySelector('.sell-btn');
      sellBtn.disabled = true;
      sellBtn.textContent = 'No Planet Selected';
    });
    return;
  }
  game.alienBuyers.forEach(buyer => {
    const buyerElement = elements.alienBuyers.querySelector(`[data-buyer-id="${buyer.id}"]`).parentElement;
    const indicators = buyerElement.querySelectorAll('.match-indicator');
    const planet = game.currentPlanet;
    const matches = [
      planet.temperature >= buyer.tempRange[0] && planet.temperature <= buyer.tempRange[1],
      planet.atmosphere >= buyer.atmoRange[0] && planet.atmosphere <= buyer.atmoRange[1],
      planet.water >= buyer.waterRange[0] && planet.water <= buyer.waterRange[1],
      planet.gravity >= buyer.gravRange[0] && planet.gravity <= buyer.gravRange[1],
      planet.radiation >= buyer.radRange[0] && planet.radiation <= buyer.radRange[1]
    ];
    indicators.forEach((ind, i) => ind.className = `match-indicator${matches[i] ? ' good' : ''}`);
    const compatibility = planet.getCompatibilityScore(buyer);
    const sellBtn = buyerElement.querySelector('.sell-btn');
    sellBtn.disabled = compatibility < 0.6;
    sellBtn.textContent = compatibility >= 0.8
      ? `Sell for ${Math.floor(buyer.currentPrice * 1.2).toLocaleString()}₵`
      : compatibility >= 0.6
        ? `Sell for ${buyer.currentPrice.toLocaleString()}₵`
        : 'Incompatible';
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
  
  // Grant Research Points based on compatibility
  grantResearchPoints(compatibility);
  
  // Update UI
  renderPlanetInventory();
  renderAlienBuyers();
  clearPlanetDisplay();
  
  showMessage(`Sold planet to ${buyer.name} for ${salePrice.toLocaleString()}₵!`, 'success');
  
  // Generate new buyer
  setTimeout(() => {
    const species = randomItem(GAME_DATA.alienSpecies);
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

function grantResearchPoints(compatibility) {
  const percent = Math.round(compatibility * 100);
  let rp = 0;
  if (percent >= 100) {
    rp = 20 + 5; // 20 + Bonus
  } else if (percent >= 90) {
    rp = 15;
  } else if (percent >= 70) {
    rp = 10;
  } else if (percent >= 50) {
    rp = 5;
  }
  if (rp > 0) {
    playerResearch.rpTotal += rp;
    showMessage(`Gained ${rp} Research Points!`, 'success');
    renderResearchPanel();
  }
}

function showPlanetPurchaseModal() {
  if (!game.gameStarted) {
    showMessage('Complete the tutorial first!', 'error');
    return;
  }
  elements.planetOptions.innerHTML = '';
  for (let i = 0, n = 3 + Math.floor(Math.random() * 2); i < n; i++) {
    const planetType = randomItem(GAME_DATA.planetTypes);
    const planetName = getRandomPlanetName();
    const planet = new Planet(planetType, planetName);
    const option = createElement('div', {
      className: 'planet-option',
      html: `
        <div class="option-preview" style="background: ${getPlanetColor(planet)}"></div>
        <div class="option-info">
          <div class="option-name">${planet.name}</div>
          <div class="option-type">${planet.type.name}</div>
          <div class="option-price">${planet.purchasePrice.toLocaleString()}₵</div>
        </div>
      `,
      onClick: () => purchasePlanet(planet)
    });
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
  // Use hardcoded names if any remain unused
  if (GAME_DATA.planetNames && GAME_DATA.planetNames.length > 0 && game.usedPlanetNames.size < GAME_DATA.planetNames.length) {
    let name;
    do {
      name = randomItem(GAME_DATA.planetNames);
    } while (game.usedPlanetNames.has(name));
    game.usedPlanetNames.add(name);
    return name;
  }
  // Otherwise, generate a procedural name
  const starPrefixes = ["HD", "Kepler", "Gliese", "Epsilon", "Tau", "TYC", "Alpha", "Delta", "Theta", "Zeta", "Xeno", "Vesmir", "PX", "LV", "LX"];
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function randLetters(n) {
    let s = "";
    for (let i = 0; i < n; i++) s += letters[Math.floor(Math.random() * letters.length)];
    return s;
  }
  const prefix = randomItem(starPrefixes);
  const code = Math.floor(100 + Math.random() * 9000);
  const suffix = Math.random() < 0.5 ? String.fromCharCode(97 + Math.floor(Math.random() * 3)) : '';
  const roman = Math.random() < 0.3 ? ' ' + randomItem(romanNumerals) : '';
  let name = `${prefix}-${code}${suffix}${roman}`.trim();
  // Ensure uniqueness in session
  let tries = 0;
  while (game.usedPlanetNames.has(name) && tries < 10) {
    name = `${prefix}-${Math.floor(100 + Math.random() * 9000)}${suffix}${roman}`.trim();
    tries++;
  }
  game.usedPlanetNames.add(name);
  return name;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function getPlanetColor(planet) {
  let baseColor;
  // Determine base by temp and water
  if (planet.water > 0.5) {
    baseColor = '#4682B4'; // Water
  } else if (planet.temperature > 60) {
    baseColor = '#B22222'; // Hot
  } else if (planet.temperature < -10) {
    baseColor = '#E0E6FF'; // Ice
  } else {
    baseColor = '#8B4513'; // Rocky
  }
  // Apply radiation as brightness modifier
  const radiation = Math.min(planet.radiation || 0, 1); // 0–1
  let brightnessMod = 1 - radiation * 0.3;
  // Apply gravity as hue shift (higher gravity = more green, lower = more red)
  let rgb = hexToRgb(baseColor);
  let hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const gravNorm = Math.max(0, Math.min(1, (planet.gravity - 0.5) / 2.5)); // 0.5–3.0 mapped to 0–1
  hsl.h = (hsl.h + gravNorm * 40) % 360; // shift hue up to +40deg
  // Convert back to RGB
  rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  // Apply brightness
  const moddedRgb = {
    r: Math.round(rgb.r * brightnessMod),
    g: Math.round(rgb.g * brightnessMod),
    b: Math.round(rgb.b * brightnessMod)
  };
  return rgbToHex(moddedRgb.r, moddedRgb.g, moddedRgb.b);
}
// HSL helpers
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}
function hslToRgb(h, s, l) {
  let r, g, b;
  h /= 360;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function renderPlanetInventory() {
  if (game.planets.length === 0) {
    elements.planetInventory.innerHTML = '<div class="no-planets">No planets owned. Buy your first planet to get started!</div>';
    return;
  }
  elements.planetInventory.innerHTML = '';
  game.planets.forEach(planet => {
    const thumbnail = createElement('div', {
      className: `planet-thumbnail${planet === game.currentPlanet ? ' active' : ''}`,
      html: `
        <div class="planet-preview" style="background: ${getPlanetColor(planet)}"></div>
        <div class="planet-info">
          <div class="planet-name">${planet.name}</div>
          <div class="planet-type">${planet.type.name}</div>
        </div>
      `,
      onClick: () => selectPlanet(planet)
    });
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

// Call this after loading all data
async function loadAllGameData() {
  await loadGameData();
  await loadResearchData();
}

// Initialize the game when the page loads

document.addEventListener('DOMContentLoaded', async () => {
  await loadAllGameData();
  initGame();
  renderResearchPanel();
});