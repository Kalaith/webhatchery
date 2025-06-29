// Game data from JSON
const gameData = {
  towerTypes: [
    {"name": "Archer", "emoji": "🏹", "damage": 25, "range": 120, "speed": 1000, "cost": 50, "description": "Basic tower with balanced stats"},
    {"name": "Fire", "emoji": "🔥", "damage": 40, "range": 80, "speed": 1500, "cost": 100, "description": "Area damage, burns enemies"},
    {"name": "Ice", "emoji": "❄️", "damage": 15, "range": 100, "speed": 800, "cost": 75, "description": "Slows enemies down"},
    {"name": "Lightning", "emoji": "⚡", "damage": 100, "range": 150, "speed": 2500, "cost": 200, "description": "High damage, long range"},
    {"name": "Bomb", "emoji": "💣", "damage": 200, "range": 60, "speed": 3000, "cost": 300, "description": "Massive area damage"}
  ],
  enemyTypes: [
    {"name": "Frog", "emoji": "🐸", "health": 50, "speed": 1, "reward": 10, "description": "Basic weak enemy"},
    {"name": "Dog", "emoji": "🐕", "health": 30, "speed": 1.5, "reward": 15, "description": "Fast but fragile"},
    {"name": "Elephant", "emoji": "🐘", "health": 150, "speed": 0.5, "reward": 25, "description": "Slow tank enemy"},
    {"name": "Ghost", "emoji": "👻", "health": 80, "speed": 1.2, "reward": 20, "description": "Can phase through some attacks"},
    {"name": "Robot", "emoji": "🤖", "health": 120, "speed": 0.8, "reward": 30, "description": "Immune to ice effects"}
  ],
  upgrades: [
    {"name": "Tower Damage", "emoji": "⚔️", "baseCost": 100, "effect": 0.1, "description": "Increases all tower damage by 10%"},
    {"name": "Tower Range", "emoji": "🎯", "baseCost": 150, "effect": 0.05, "description": "Increases all tower range by 5%"},
    {"name": "Starting Gold", "emoji": "💰", "baseCost": 80, "effect": 50, "description": "Start each run with +50 gold"},
    {"name": "XP Multiplier", "emoji": "⭐", "baseCost": 200, "effect": 0.2, "description": "Earn 20% more XP"},
    {"name": "Wave Delay", "emoji": "⏰", "baseCost": 120, "effect": 0.1, "description": "10% delay between enemy spawns"},
    {"name": "Auto-Start", "emoji": "🚀", "baseCost": 500, "effect": 1, "description": "Automatically start next wave"}
  ],
  gameSettings: {
    gridSize: 40,
    pathY: 300,
    canvasWidth: 800,
    canvasHeight: 600,
    startingGold: 200,
    startingLives: 20,
    waveScaling: 1.15
  }
};

// Game state
let gameState = {
  gold: 200,
  xp: 0,
  lives: 20,
  wave: 1,
  gameSpeed: 1,
  isPaused: false,
  selectedTowerType: null,
  towers: [],
  enemies: [],
  projectiles: [],
  waveInProgress: false,
  gameOver: false,
  upgradeLevels: {
    "Tower Damage": 0,
    "Tower Range": 0,
    "Starting Gold": 0,
    "XP Multiplier": 0,
    "Wave Delay": 0,
    "Auto-Start": 0
  }
};

// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Enemy path points
const enemyPath = [
  {x: -50, y: gameData.gameSettings.pathY},
  {x: 100, y: gameData.gameSettings.pathY},
  {x: 200, y: gameData.gameSettings.pathY - 100},
  {x: 400, y: gameData.gameSettings.pathY - 100},
  {x: 500, y: gameData.gameSettings.pathY + 100},
  {x: 700, y: gameData.gameSettings.pathY + 100},
  {x: gameData.gameSettings.canvasWidth + 50, y: gameData.gameSettings.pathY}
];

// Game classes
class Tower {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.lastShot = 0;
    this.range = type.range * (1 + gameState.upgradeLevels["Tower Range"] * gameData.upgrades[1].effect);
    this.damage = type.damage * (1 + gameState.upgradeLevels["Tower Damage"] * gameData.upgrades[0].effect);
  }

  canShoot() {
    return Date.now() - this.lastShot > this.type.speed / gameState.gameSpeed;
  }

  findTarget() {
    let closest = null;
    let closestDist = this.range;
    
    for (let enemy of gameState.enemies) {
      const dist = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
      if (dist <= this.range && dist < closestDist) {
        closest = enemy;
        closestDist = dist;
      }
    }
    return closest;
  }

  shoot(target) {
    if (!this.canShoot()) return;
    
    this.lastShot = Date.now();
    
    const projectile = new Projectile(this.x, this.y, target, this.damage, this.type);
    gameState.projectiles.push(projectile);
  }

  update() {
    const target = this.findTarget();
    if (target) {
      this.shoot(target);
    }
  }

  draw() {
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.type.emoji, this.x, this.y + 8);
    
    // Draw range when selected
    if (gameState.selectedTowerType === this.type) {
      ctx.strokeStyle = 'rgba(33, 128, 141, 0.3)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

class Enemy {
  constructor(type, wave) {
    this.type = type;
    this.maxHealth = type.health * Math.pow(gameData.gameSettings.waveScaling, wave - 1);
    this.health = this.maxHealth;
    this.speed = type.speed;
    this.pathIndex = 0;
    this.progress = 0;
    this.x = enemyPath[0].x;
    this.y = enemyPath[0].y;
    this.slowEffect = 0;
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      const goldReward = this.type.reward;
      const xpReward = Math.floor(this.type.reward * 0.5 * (1 + gameState.upgradeLevels["XP Multiplier"] * gameData.upgrades[3].effect));
      gameState.gold += goldReward;
      gameState.xp += xpReward;
      return true;
    }
    return false;
  }

  update() {
    const currentSpeed = this.speed * (1 - this.slowEffect) * gameState.gameSpeed;
    this.progress += currentSpeed;
    
    if (this.slowEffect > 0) {
      this.slowEffect -= 0.02;
    }
    
    // Move along path
    if (this.pathIndex < enemyPath.length - 1) {
      const current = enemyPath[this.pathIndex];
      const next = enemyPath[this.pathIndex + 1];
      const segmentLength = Math.sqrt((next.x - current.x) ** 2 + (next.y - current.y) ** 2);
      
      if (this.progress >= segmentLength) {
        this.progress -= segmentLength;
        this.pathIndex++;
        if (this.pathIndex >= enemyPath.length - 1) {
          return true; // Reached end
        }
      }
      
      const t = this.progress / segmentLength;
      this.x = current.x + (next.x - current.x) * t;
      this.y = current.y + (next.y - current.y) * t;
    }
    
    return false;
  }

  draw() {
    // Draw health bar
    const barWidth = 30;
    const barHeight = 4;
    const healthPercent = this.health / this.maxHealth;
    
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - barWidth/2, this.y - 20, barWidth, barHeight);
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x - barWidth/2, this.y - 20, barWidth * healthPercent, barHeight);
    
    // Draw enemy
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(this.type.emoji, this.x, this.y + 6);
  }
}

class Projectile {
  constructor(x, y, target, damage, towerType) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.towerType = towerType;
    this.speed = 5;
  }

  update() {
    if (!this.target || this.target.health <= 0) {
      return true; // Remove projectile
    }
    
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx ** 2 + dy ** 2);
    
    if (dist < 10) {
      // Hit target
      const killed = this.target.takeDamage(this.damage);
      
      // Special effects
      if (this.towerType.name === 'Ice' && this.target.type.name !== 'Robot') {
        this.target.slowEffect = Math.max(this.target.slowEffect, 0.5);
      }
      
      if (this.towerType.name === 'Fire' || this.towerType.name === 'Bomb') {
        // Area damage
        const areaRange = this.towerType.name === 'Fire' ? 50 : 80;
        for (let enemy of gameState.enemies) {
          const areaDist = Math.sqrt((enemy.x - this.target.x) ** 2 + (enemy.y - this.target.y) ** 2);
          if (areaDist <= areaRange && enemy !== this.target) {
            enemy.takeDamage(this.damage * 0.5);
          }
        }
      }
      
      if (killed) {
        const index = gameState.enemies.indexOf(this.target);
        if (index > -1) {
          gameState.enemies.splice(index, 1);
        }
      }
      
      return true; // Remove projectile
    }
    
    // Move towards target
    this.x += (dx / dist) * this.speed * gameState.gameSpeed;
    this.y += (dy / dist) * this.speed * gameState.gameSpeed;
    
    return false;
  }

  draw() {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Game functions
function initializeGame() {
  // Apply upgrades
  gameState.gold = gameData.gameSettings.startingGold + gameState.upgradeLevels["Starting Gold"] * gameData.upgrades[2].effect;
  gameState.lives = gameData.gameSettings.startingLives;
  gameState.wave = 1;
  gameState.towers = [];
  gameState.enemies = [];
  gameState.projectiles = [];
  gameState.waveInProgress = false;
  gameState.gameOver = false;
  
  updateUI();
  generateTowerButtons();
  generateUpgradeButtons();
}

function generateTowerButtons() {
  const towerGrid = document.getElementById('towerGrid');
  towerGrid.innerHTML = '';
  
  gameData.towerTypes.forEach(tower => {
    const button = document.createElement('div');
    button.className = 'tower-btn';
    button.innerHTML = `
      <div class="tower-emoji">${tower.emoji}</div>
      <div class="tower-name">${tower.name}</div>
      <div class="tower-cost">💰${tower.cost}</div>
    `;
    
    button.addEventListener('click', () => selectTower(tower));
    towerGrid.appendChild(button);
  });
}

function generateUpgradeButtons() {
  const upgradeGrid = document.getElementById('upgradeGrid');
  upgradeGrid.innerHTML = '';
  
  gameData.upgrades.forEach(upgrade => {
    const level = gameState.upgradeLevels[upgrade.name];
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, level));
    
    const upgradeDiv = document.createElement('div');
    upgradeDiv.className = 'upgrade-item';
    upgradeDiv.innerHTML = `
      <div class="upgrade-header">
        <span class="upgrade-emoji">${upgrade.emoji}</span>
        <span class="upgrade-name">${upgrade.name}</span>
        <span class="upgrade-level">Lv.${level}</span>
      </div>
      <div class="upgrade-description">${upgrade.description}</div>
      <button class="btn btn--primary upgrade-btn ${gameState.xp < cost ? 'btn--outline' : ''}" 
              ${gameState.xp < cost ? 'disabled' : ''}>
        ${gameState.xp >= cost ? `Upgrade (⭐${cost})` : `Need ⭐${cost}`}
      </button>
    `;
    
    const button = upgradeDiv.querySelector('.upgrade-btn');
    button.addEventListener('click', () => {
      if (gameState.xp >= cost) {
        gameState.xp -= cost;
        gameState.upgradeLevels[upgrade.name]++;
        generateUpgradeButtons();
        updateUI();
      }
    });
    
    upgradeGrid.appendChild(upgradeDiv);
  });
}

function selectTower(towerType) {
  if (gameState.gold < towerType.cost) return;
  
  gameState.selectedTowerType = towerType;
  
  // Update UI
  document.querySelectorAll('.tower-btn').forEach(btn => btn.classList.remove('selected'));
  event.target.closest('.tower-btn').classList.add('selected');
  
  showTowerInfo(towerType);
}

function showTowerInfo(tower) {
  const selectedTower = document.getElementById('selectedTower');
  selectedTower.style.display = 'block';
  
  document.getElementById('selectedEmoji').textContent = tower.emoji;
  document.getElementById('selectedDamage').textContent = Math.floor(tower.damage * (1 + gameState.upgradeLevels["Tower Damage"] * gameData.upgrades[0].effect));
  document.getElementById('selectedRange').textContent = Math.floor(tower.range * (1 + gameState.upgradeLevels["Tower Range"] * gameData.upgrades[1].effect));
  document.getElementById('selectedSpeed').textContent = tower.speed;
  document.getElementById('selectedCost').textContent = tower.cost;
  document.getElementById('selectedDescription').textContent = tower.description;
}

function placeTower(x, y) {
  if (!gameState.selectedTowerType || gameState.gold < gameState.selectedTowerType.cost) return;
  
  // Check if position is valid (not on path, not occupied)
  const gridX = Math.floor(x / gameData.gameSettings.gridSize) * gameData.gameSettings.gridSize + gameData.gameSettings.gridSize / 2;
  const gridY = Math.floor(y / gameData.gameSettings.gridSize) * gameData.gameSettings.gridSize + gameData.gameSettings.gridSize / 2;
  
  // Check if on path
  if (Math.abs(gridY - gameData.gameSettings.pathY) < 50) return;
  
  // Check if occupied
  for (let tower of gameState.towers) {
    if (Math.abs(tower.x - gridX) < 20 && Math.abs(tower.y - gridY) < 20) return;
  }
  
  const tower = new Tower(gridX, gridY, gameState.selectedTowerType);
  gameState.towers.push(tower);
  gameState.gold -= gameState.selectedTowerType.cost;
  
  updateUI();
}

function startWave() {
  if (gameState.waveInProgress) return;
  
  gameState.waveInProgress = true;
  spawnWave();
  updateUI();
}

function spawnWave() {
  const enemiesInWave = Math.min(5 + gameState.wave, 20);
  let spawned = 0;
  
  const spawnInterval = setInterval(() => {
    if (spawned >= enemiesInWave) {
      clearInterval(spawnInterval);
      return;
    }
    
    // Select random enemy type, with harder enemies more likely in later waves
    let enemyTypeIndex = 0;
    if (gameState.wave > 3) enemyTypeIndex = Math.floor(Math.random() * 2);
    if (gameState.wave > 6) enemyTypeIndex = Math.floor(Math.random() * 3);
    if (gameState.wave > 10) enemyTypeIndex = Math.floor(Math.random() * 4);
    if (gameState.wave > 15) enemyTypeIndex = Math.floor(Math.random() * 5);
    
    const enemyType = gameData.enemyTypes[enemyTypeIndex];
    const enemy = new Enemy(enemyType, gameState.wave);
    gameState.enemies.push(enemy);
    
    spawned++;
  }, 1000 / (1 + gameState.upgradeLevels["Wave Delay"] * gameData.upgrades[4].effect));
}

function updateGame() {
  if (gameState.isPaused || gameState.gameOver) return;
  
  // Update towers
  gameState.towers.forEach(tower => tower.update());
  
  // Update enemies
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    const reachedEnd = enemy.update();
    
    if (reachedEnd) {
      gameState.lives--;
      gameState.enemies.splice(i, 1);
      
      if (gameState.lives <= 0) {
        gameOver();
        return;
      }
    }
  }
  
  // Update projectiles
  gameState.projectiles = gameState.projectiles.filter(projectile => !projectile.update());
  
  // Check wave completion
  if (gameState.waveInProgress && gameState.enemies.length === 0) {
    gameState.waveInProgress = false;
    gameState.wave++;
    
    // Auto-start next wave if upgrade is purchased
    if (gameState.upgradeLevels["Auto-Start"] > 0) {
      setTimeout(() => startWave(), 3000);
    }
  }
  
  updateUI();
}

function drawGame() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(94, 82, 64, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += gameData.gameSettings.gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gameData.gameSettings.gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw path
  ctx.strokeStyle = 'rgba(168, 75, 47, 0.3)';
  ctx.lineWidth = 40;
  ctx.beginPath();
  for (let i = 0; i < enemyPath.length; i++) {
    if (i === 0) {
      ctx.moveTo(enemyPath[i].x, enemyPath[i].y);
    } else {
      ctx.lineTo(enemyPath[i].x, enemyPath[i].y);
    }
  }
  ctx.stroke();
  
  // Draw game objects
  gameState.towers.forEach(tower => tower.draw());
  gameState.enemies.forEach(enemy => enemy.draw());
  gameState.projectiles.forEach(projectile => projectile.draw());
}

function updateUI() {
  document.getElementById('gold').textContent = gameState.gold;
  document.getElementById('xp').textContent = gameState.xp;
  document.getElementById('lives').textContent = gameState.lives;
  document.getElementById('wave').textContent = gameState.wave;
  
  // Update tower buttons affordability
  document.querySelectorAll('.tower-btn').forEach((btn, index) => {
    const tower = gameData.towerTypes[index];
    if (gameState.gold < tower.cost) {
      btn.classList.add('disabled');
    } else {
      btn.classList.remove('disabled');
    }
  });
  
  // Update start wave button
  const startWaveBtn = document.getElementById('startWave');
  startWaveBtn.textContent = gameState.waveInProgress ? 'Wave In Progress' : 'Start Wave';
  startWaveBtn.disabled = gameState.waveInProgress;
}

function gameOver() {
  gameState.gameOver = true;
  
  document.getElementById('finalWave').textContent = gameState.wave;
  document.getElementById('earnedXP').textContent = gameState.xp;
  document.getElementById('totalXP').textContent = gameState.xp;
  
  generateUpgradeButtons();
  document.getElementById('upgradeModal').style.display = 'flex';
}

function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Event listeners
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  placeTower(x, y);
});

document.getElementById('startWave').addEventListener('click', startWave);

document.getElementById('pauseGame').addEventListener('click', () => {
  gameState.isPaused = !gameState.isPaused;
  document.getElementById('pauseGame').textContent = gameState.isPaused ? 'Resume' : 'Pause';
});

document.getElementById('speedToggle').addEventListener('click', () => {
  gameState.gameSpeed = gameState.gameSpeed === 1 ? 2 : gameState.gameSpeed === 2 ? 4 : 1;
  document.getElementById('speedToggle').textContent = `Speed: ${gameState.gameSpeed}x`;
});

document.getElementById('restartGame').addEventListener('click', () => {
  document.getElementById('upgradeModal').style.display = 'none';
  initializeGame();
});

// Initialize game
initializeGame();
gameLoop();