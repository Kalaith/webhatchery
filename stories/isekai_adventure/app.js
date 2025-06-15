// Game data from the provided JSON
const GAME_DATA = {
  initialStats: {
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    strength: 10,
    intelligence: 10,
    agility: 10,
    xp: 0,
    xpToNextLevel: 100
  },
  skills: [
    {
      id: "slash",
      name: "Slash",
      description: "A basic sword attack",
      damage: 15,
      mpCost: 0,
      unlockLevel: 1
    },
    {
      id: "fireball",
      name: "Fireball",
      description: "A ball of fire that deals magic damage",
      damage: 25,
      mpCost: 15,
      unlockLevel: 3
    },
    {
      id: "heal",
      name: "Heal",
      description: "Restore some HP",
      healing: 30,
      mpCost: 20,
      unlockLevel: 5
    },
    {
      id: "lightning",
      name: "Lightning Strike",
      description: "Call down lightning on your enemies",
      damage: 40,
      mpCost: 25,
      unlockLevel: 7
    },
    {
      id: "dragon_slash",
      name: "Dragon Slash",
      description: "A powerful attack with dragon energy",
      damage: 60,
      mpCost: 35,
      unlockLevel: 10
    }
  ],
  monsters: [
    {
      id: "slime",
      name: "Slime",
      hp: 50,
      attack: 8,
      defense: 5,
      xpReward: 20,
      description: "A basic blue slime bouncing around."
    },
    {
      id: "goblin",
      name: "Goblin",
      hp: 80,
      attack: 12,
      defense: 8,
      xpReward: 35,
      description: "A small green goblin with a crude dagger."
    },
    {
      id: "wolf",
      name: "Dire Wolf",
      hp: 100,
      attack: 18,
      defense: 10,
      xpReward: 50,
      description: "A fierce wolf with glowing red eyes."
    },
    {
      id: "orc",
      name: "Orc Warrior",
      hp: 150,
      attack: 22,
      defense: 15,
      xpReward: 75,
      description: "A muscular orc wielding a heavy axe."
    },
    {
      id: "troll",
      name: "Forest Troll",
      hp: 200,
      attack: 25,
      defense: 20,
      xpReward: 100,
      description: "A large troll with regenerative abilities."
    },
    {
      id: "griffin",
      name: "Griffin",
      hp: 250,
      attack: 30,
      defense: 25,
      xpReward: 150,
      description: "A majestic creature with the body of a lion and head of an eagle."
    },
    {
      id: "dragon",
      name: "Young Dragon",
      hp: 400,
      attack: 40,
      defense: 35,
      xpReward: 300,
      description: "A fearsome dragon with gleaming scales."
    },
    {
      id: "demon_general",
      name: "Demon General",
      hp: 500,
      attack: 45,
      defense: 40,
      xpReward: 500,
      description: "One of the Demon King's most trusted generals."
    },
    {
      id: "demon_king",
      name: "Demon King",
      hp: 1000,
      attack: 60,
      defense: 50,
      xpReward: 1000,
      description: "The ruler of this world's demons, emanating dark power."
    }
  ]
};

// Character class
class Character {
  constructor(name) {
    this.name = name;
    this.level = GAME_DATA.initialStats.level;
    this.hp = GAME_DATA.initialStats.hp;
    this.maxHp = GAME_DATA.initialStats.maxHp;
    this.mp = GAME_DATA.initialStats.mp;
    this.maxMp = GAME_DATA.initialStats.maxMp;
    this.strength = GAME_DATA.initialStats.strength;
    this.intelligence = GAME_DATA.initialStats.intelligence;
    this.agility = GAME_DATA.initialStats.agility;
    this.xp = GAME_DATA.initialStats.xp;
    this.xpToNextLevel = GAME_DATA.initialStats.xpToNextLevel;
    this.unlockedSkills = ['slash'];
  }

  gainXp(amount) {
    this.xp += amount;
    let leveledUp = false;
    
    while (this.xp >= this.xpToNextLevel) {
      this.xp -= this.xpToNextLevel;
      this.levelUp();
      leveledUp = true;
    }
    
    return leveledUp;
  }

  levelUp() {
    this.level++;
    const hpIncrease = 20 + Math.floor(this.level * 5);
    const mpIncrease = 10 + Math.floor(this.level * 3);
    
    this.maxHp += hpIncrease;
    this.hp = this.maxHp; // Full heal on level up
    this.maxMp += mpIncrease;
    this.mp = this.maxMp; // Full MP on level up
    
    this.strength += Math.floor(Math.random() * 3) + 2;
    this.intelligence += Math.floor(Math.random() * 3) + 2;
    this.agility += Math.floor(Math.random() * 3) + 2;
    
    this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
    
    // Unlock new skills
    GAME_DATA.skills.forEach(skill => {
      if (skill.unlockLevel === this.level && !this.unlockedSkills.includes(skill.id)) {
        this.unlockedSkills.push(skill.id);
      }
    });
  }

  attack(target) {
    const baseDamage = this.strength + Math.floor(Math.random() * 10);
    const damage = Math.max(1, baseDamage - target.defense);
    target.hp -= damage;
    return damage;
  }

  useSkill(skillId, target = null) {
    const skill = GAME_DATA.skills.find(s => s.id === skillId);
    if (!skill || this.mp < skill.mpCost) return null;
    
    this.mp -= skill.mpCost;
    
    if (skill.damage) {
      const damage = Math.max(1, skill.damage + Math.floor(this.intelligence / 2) - (target ? target.defense : 0));
      if (target) target.hp -= damage;
      return { type: 'damage', amount: damage };
    }
    
    if (skill.healing) {
      const healing = skill.healing + Math.floor(this.intelligence / 3);
      this.hp = Math.min(this.maxHp, this.hp + healing);
      return { type: 'healing', amount: healing };
    }
    
    return null;
  }

  isAlive() {
    return this.hp > 0;
  }
}

// Monster class
class Monster {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.hp = data.hp;
    this.maxHp = data.hp;
    this.attack = data.attack;
    this.defense = data.defense;
    this.xpReward = data.xpReward;
    this.description = data.description;
  }

  attackPlayer(player) {
    const damage = Math.max(1, this.attack + Math.floor(Math.random() * 8) - Math.floor(player.agility / 3));
    player.hp -= damage;
    return damage;
  }

  isAlive() {
    return this.hp > 0;
  }
}

// Main Game class
class Game {
  constructor() {
    this.character = null;
    this.currentMonster = null;
    this.gameState = 'intro';
    this.storyProgress = {
      metGuildMaster: false,
      exploredForest: false,
      visitedCapital: false,
      defeatedDemonGeneral: false,
      finalChoice: null
    };
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Start adventure
    document.getElementById('start-adventure').addEventListener('click', () => {
      const name = document.getElementById('hero-name').value.trim();
      if (name) {
        this.startGame(name);
      } else {
        alert('Please enter your hero name!');
      }
    });

    // Restart game
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.restartGame();
    });

    // Combat actions
    document.getElementById('attack-btn').addEventListener('click', () => {
      this.playerAttack();
    });

    document.getElementById('skills-btn').addEventListener('click', () => {
      this.showSkillsMenu();
    });

    document.getElementById('back-to-combat').addEventListener('click', () => {
      this.hideSkillsMenu();
    });

    // Level up continue
    document.getElementById('level-up-continue').addEventListener('click', () => {
      this.hideLevelUpNotification();
    });
  }

  startGame(name) {
    this.character = new Character(name);
    document.getElementById('name-input-section').classList.add('hidden');
    document.getElementById('stats-panel').classList.remove('hidden');
    this.updateStatsDisplay();
    this.gameState = 'story';
    this.showFirstChoice();
  }

  restartGame() {
    this.character = null;
    this.currentMonster = null;
    this.gameState = 'intro';
    this.storyProgress = {
      metGuildMaster: false,
      exploredForest: false,
      visitedCapital: false,
      defeatedDemonGeneral: false,
      finalChoice: null
    };
    
    // Reset UI
    document.getElementById('name-input-section').classList.remove('hidden');
    document.getElementById('stats-panel').classList.add('hidden');
    document.getElementById('combat-section').classList.add('hidden');
    document.getElementById('choice-section').classList.add('hidden');
    document.getElementById('hero-name').value = '';
    
    // Reset story
    document.getElementById('story-text').innerHTML = `
      <h2>Welcome to Another World</h2>
      <p>You're walking home from work when suddenly a bright light engulfs you. When your vision clears, you find yourself standing in a vast meadow under an unfamiliar sky with two moons.</p>
      <p>A voice echoes in your mind: "Welcome, Hero! You have been summoned to defeat the Demon King and save our world from eternal darkness."</p>
      <p>What is your name, brave hero?</p>
    `;
  }

  showFirstChoice() {
    document.getElementById('story-text').innerHTML = `
      <h2>The Adventure Begins</h2>
      <p>Welcome, ${this.character.name}! You stand in a vast meadow with three paths before you. A mystical voice guides you:</p>
      <p>"Choose your first destination wisely, young hero. Each path will shape your destiny."</p>
    `;

    this.showChoices([
      {
        text: "Head to the Adventurer's Guild to learn about this world",
        action: () => this.guildPath()
      },
      {
        text: "Venture into the Enchanted Forest to test your strength",
        action: () => this.forestPath()
      },
      {
        text: "Travel to the Royal Capital to seek an audience with the king",
        action: () => this.capitalPath(),
        requirement: this.character.level >= 3,
        requirementText: "Requires Level 3"
      }
    ]);
  }

  guildPath() {
    this.storyProgress.metGuildMaster = true;
    document.getElementById('story-text').innerHTML = `
      <h2>The Adventurer's Guild</h2>
      <p>You enter a bustling tavern filled with warriors, mages, and adventurers of all kinds. The Guild Master, a grizzled veteran, approaches you.</p>
      <p>"Another hero summoned to defeat the Demon King, eh? You'll need to prove yourself first. Here, take this basic training."</p>
      <p>The Guild Master teaches you about combat and gives you some starting equipment.</p>
    `;

    // Give player some XP and start first combat
    this.character.gainXp(50);
    this.updateStatsDisplay();
    
    setTimeout(() => {
      this.startCombat('slime');
    }, 2000);
  }

  forestPath() {
    this.storyProgress.exploredForest = true;
    document.getElementById('story-text').innerHTML = `
      <h2>The Enchanted Forest</h2>
      <p>You step into a mystical forest where the trees seem to whisper ancient secrets. The air crackles with magic, and you feel your powers growing stronger.</p>
      <p>Suddenly, you hear a growl from the bushes nearby...</p>
    `;

    setTimeout(() => {
      this.startCombat('wolf');
    }, 2000);
  }

  capitalPath() {
    if (this.character.level < 3) {
      alert("You need to be at least level 3 to enter the Royal Capital!");
      return;
    }
    
    this.storyProgress.visitedCapital = true;
    document.getElementById('story-text').innerHTML = `
      <h2>The Royal Capital</h2>
      <p>The magnificent capital city spreads before you, with towering spires and bustling streets. Guards escort you to the royal palace where the king awaits.</p>
      <p>"Hero ${this.character.name}! The prophecies spoke of your arrival. The Demon King's forces grow stronger each day. Accept this royal blessing!"</p>
      <p>The king grants you a significant boost to your abilities!</p>
    `;

    // Royal blessing
    this.character.strength += 5;
    this.character.intelligence += 5;
    this.character.agility += 5;
    this.character.gainXp(100);
    this.updateStatsDisplay();

    setTimeout(() => {
      this.showMidGameChoices();
    }, 3000);
  }

  showMidGameChoices() {
    let storyText = `<h2>The Journey Continues</h2>`;
    
    if (this.storyProgress.metGuildMaster && this.storyProgress.exploredForest) {
      storyText += `<p>Having proven yourself at the Guild and survived the Enchanted Forest, you're ready for greater challenges.</p>`;
    } else if (this.storyProgress.visitedCapital) {
      storyText += `<p>With the king's blessing, you feel ready to face the Demon King's forces directly.</p>`;
    } else {
      storyText += `<p>Your adventures have prepared you for what lies ahead.</p>`;
    }
    
    storyText += `<p>Where will you go next?</p>`;
    document.getElementById('story-text').innerHTML = storyText;

    const choices = [
      {
        text: "Challenge the Ancient Ruins where a powerful guardian awaits",
        action: () => this.ruinsPath(),
        requirement: this.character.level >= 5,
        requirementText: "Requires Level 5"
      },
      {
        text: "Seek out the Dragon's Lair for legendary treasures",
        action: () => this.dragonPath(),
        requirement: this.character.level >= 7,
        requirementText: "Requires Level 7"
      },
      {
        text: "Storm the Demon Castle to face the Demon King",
        action: () => this.finalPath(),
        requirement: this.character.level >= 10,
        requirementText: "Requires Level 10"
      }
    ];

    // Add alternative paths based on story progress
    if (!this.storyProgress.metGuildMaster) {
      choices.unshift({
        text: "Visit the Adventurer's Guild for guidance",
        action: () => this.guildPath()
      });
    }

    if (!this.storyProgress.exploredForest) {
      choices.unshift({
        text: "Explore the Enchanted Forest",
        action: () => this.forestPath()
      });
    }

    this.showChoices(choices);
  }

  ruinsPath() {
    document.getElementById('story-text').innerHTML = `
      <h2>The Ancient Ruins</h2>
      <p>You discover crumbling stone structures covered in mystical runes. As you explore deeper, an ancient guardian awakens to test your worthiness.</p>
      <p>The stone Griffin spreads its wings and lets out a mighty roar!</p>
    `;

    setTimeout(() => {
      this.startCombat('griffin');
    }, 2000);
  }

  dragonPath() {
    document.getElementById('story-text').innerHTML = `
      <h2>The Dragon's Lair</h2>
      <p>You climb treacherous mountain paths to reach a cave filled with glittering treasure. Deep within, a young dragon guards its hoard.</p>
      <p>"Who dares disturb my slumber?" the dragon roars, breathing smoke and flame!</p>
    `;

    setTimeout(() => {
      this.startCombat('dragon');
    }, 2000);
  }

  finalPath() {
    document.getElementById('story-text').innerHTML = `
      <h2>The Demon Castle</h2>
      <p>Dark towers pierce the crimson sky as you approach the Demon King's stronghold. This is it - the final battle approaches.</p>
      <p>But first, you must face the Demon General who blocks your path!</p>
    `;

    setTimeout(() => {
      this.startCombat('demon_general');
    }, 2000);
  }

  startCombat(monsterId) {
    const monsterData = GAME_DATA.monsters.find(m => m.id === monsterId);
    this.currentMonster = new Monster(monsterData);
    
    document.getElementById('choice-section').classList.add('hidden');
    document.getElementById('combat-section').classList.remove('hidden');
    
    document.getElementById('enemy-name').textContent = this.currentMonster.name;
    document.getElementById('enemy-hp').textContent = `${this.currentMonster.hp}/${this.currentMonster.maxHp}`;
    document.getElementById('enemy-description').textContent = this.currentMonster.description;
    
    document.getElementById('combat-log').innerHTML = `<p>A ${this.currentMonster.name} appears!</p>`;
    
    this.updateCombatSkillsList();
  }

  playerAttack() {
    if (!this.currentMonster || !this.currentMonster.isAlive()) return;
    
    const damage = this.character.attack(this.currentMonster);
    this.addCombatLog(`You attack for <span class="damage">${damage} damage</span>!`);
    
    this.updateEnemyHp();
    
    if (!this.currentMonster.isAlive()) {
      this.winCombat();
      return;
    }
    
    // Enemy turn
    setTimeout(() => {
      this.enemyTurn();
    }, 1000);
  }

  enemyTurn() {
    if (!this.currentMonster || !this.currentMonster.isAlive()) return;
    
    const damage = this.currentMonster.attackPlayer(this.character);
    this.addCombatLog(`${this.currentMonster.name} attacks you for <span class="damage">${damage} damage</span>!`);
    
    this.updateStatsDisplay();
    
    if (!this.character.isAlive()) {
      this.gameOver();
    }
  }

  useSkillInCombat(skillId) {
    const result = this.character.useSkill(skillId, this.currentMonster);
    if (!result) return;
    
    const skill = GAME_DATA.skills.find(s => s.id === skillId);
    
    if (result.type === 'damage') {
      this.addCombatLog(`You use ${skill.name} for <span class="damage">${result.amount} damage</span>!`);
      this.updateEnemyHp();
      
      if (!this.currentMonster.isAlive()) {
        this.winCombat();
        return;
      }
    } else if (result.type === 'healing') {
      this.addCombatLog(`You use ${skill.name} and recover <span class="healing">${result.amount} HP</span>!`);
    }
    
    this.updateStatsDisplay();
    this.hideSkillsMenu();
    
    // Enemy turn
    setTimeout(() => {
      this.enemyTurn();
    }, 1000);
  }

  winCombat() {
    this.addCombatLog(`<span class="critical">Victory! You defeated the ${this.currentMonster.name}!</span>`);
    
    const xpGained = this.currentMonster.xpReward;
    const leveledUp = this.character.gainXp(xpGained);
    
    this.addCombatLog(`You gained ${xpGained} XP!`);
    this.updateStatsDisplay();
    
    if (leveledUp) {
      setTimeout(() => {
        this.showLevelUpNotification();
      }, 1000);
    } else {
      setTimeout(() => {
        this.postCombatChoice();
      }, 2000);
    }
  }

  postCombatChoice() {
    document.getElementById('combat-section').classList.add('hidden');
    
    if (this.currentMonster.id === 'demon_general') {
      this.storyProgress.defeatedDemonGeneral = true;
      this.showFinalBoss();
    } else if (this.currentMonster.id === 'demon_king') {
      this.showVictoryEnding();
    } else {
      this.showMidGameChoices();
    }
  }

  showFinalBoss() {
    document.getElementById('story-text').innerHTML = `
      <h2>The Final Confrontation</h2>
      <p>With the Demon General defeated, the path to the Demon King's throne room lies open. Dark energy pulses through the air as you approach.</p>
      <p>The Demon King rises from his throne, his eyes burning with malevolent power.</p>
      <p>"So, another hero thinks they can defeat me? Let us end this charade once and for all!"</p>
    `;

    setTimeout(() => {
      this.startCombat('demon_king');
    }, 3000);
  }

  showVictoryEnding() {
    document.getElementById('story-text').innerHTML = `
      <h2>Victory!</h2>
      <p>The Demon King falls, his dark power dissipating into nothingness. Light returns to the world as the curse is broken.</p>
      <p>You, ${this.character.name}, have saved this fantasy world! The people celebrate your heroic deeds.</p>
      <p>As a true hero, you can choose your fate:</p>
    `;

    this.showChoices([
      {
        text: "Return to your original world with newfound powers",
        action: () => this.showEnding('return')
      },
      {
        text: "Stay in this world as its protector and ruler",
        action: () => this.showEnding('stay')
      },
      {
        text: "Explore other dimensions for new adventures",
        action: () => this.showEnding('explore'),
        requirement: this.character.level >= 15,
        requirementText: "Requires Level 15"
      }
    ]);
  }

  showEnding(choice) {
    let endingText = `<h2>The End</h2>`;
    
    switch (choice) {
      case 'return':
        endingText += `
          <p>You choose to return home, but you're forever changed by your adventure. With your new powers and wisdom, you become a legendary figure in both worlds.</p>
          <p>Sometimes, on quiet nights, you look up at the moon and remember your time as a hero in another world.</p>
        `;
        break;
      case 'stay':
        endingText += `
          <p>You decide to stay and become the new ruler of this realm. Under your wise and just leadership, the kingdom enters a golden age of peace and prosperity.</p>
          <p>Your legend grows with each passing year, inspiring new generations of heroes.</p>
        `;
        break;
      case 'explore':
        endingText += `
          <p>With ultimate power at your command, you tear open rifts to other dimensions. Your adventures are far from over - infinite worlds await your exploration!</p>
          <p>You become a interdimensional hero, saving countless worlds across the multiverse.</p>
        `;
        break;
    }
    
    endingText += `
      <p><strong>Final Stats:</strong></p>
      <p>Level: ${this.character.level} | HP: ${this.character.hp}/${this.character.maxHp} | MP: ${this.character.mp}/${this.character.maxMp}</p>
      <p>STR: ${this.character.strength} | INT: ${this.character.intelligence} | AGI: ${this.character.agility}</p>
      <p>Thank you for playing, ${this.character.name}!</p>
    `;
    
    document.getElementById('story-text').innerHTML = endingText;
    document.getElementById('choice-section').classList.add('hidden');
  }

  gameOver() {
    document.getElementById('story-text').innerHTML = `
      <h2>Game Over</h2>
      <p>Your journey ends here, ${this.character.name}. The world mourns the loss of its hero...</p>
      <p>But legends say that heroes never truly die - they return when the world needs them most.</p>
      <p>Click "Start New Adventure" to try again!</p>
    `;
    
    document.getElementById('combat-section').classList.add('hidden');
  }

  showChoices(choices) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    
    choices.forEach(choice => {
      const button = document.createElement('button');
      button.className = 'choice-btn';
      
      if (choice.requirement && !choice.requirement) {
        button.classList.add('locked');
        button.disabled = true;
      }
      
      button.innerHTML = `
        <div class="choice-text">${choice.text}</div>
        ${choice.requirementText ? `<div class="choice-requirement">${choice.requirementText}</div>` : ''}
      `;
      
      if (!button.disabled) {
        button.addEventListener('click', choice.action);
      }
      
      container.appendChild(button);
    });
    
    document.getElementById('choice-section').classList.remove('hidden');
  }

  showSkillsMenu() {
    document.getElementById('combat-actions').classList.add('hidden');
    document.getElementById('skills-menu').classList.remove('hidden');
  }

  hideSkillsMenu() {
    document.getElementById('combat-actions').classList.remove('hidden');
    document.getElementById('skills-menu').classList.add('hidden');
  }

  updateCombatSkillsList() {
    const container = document.getElementById('combat-skills-list');
    container.innerHTML = '';
    
    this.character.unlockedSkills.forEach(skillId => {
      const skill = GAME_DATA.skills.find(s => s.id === skillId);
      const button = document.createElement('button');
      button.className = 'skill-btn';
      
      if (this.character.mp < skill.mpCost) {
        button.disabled = true;
      }
      
      button.innerHTML = `
        <div class="skill-info">
          <div class="skill-name">${skill.name}</div>
          <div class="skill-description">${skill.description}</div>
        </div>
        <div class="skill-cost">${skill.mpCost} MP</div>
      `;
      
      if (!button.disabled) {
        button.addEventListener('click', () => this.useSkillInCombat(skillId));
      }
      
      container.appendChild(button);
    });
  }

  showLevelUpNotification() {
    document.getElementById('level-up-text').textContent = `You reached level ${this.character.level}!`;
    document.getElementById('level-up-notification').classList.remove('hidden');
  }

  hideLevelUpNotification() {
    document.getElementById('level-up-notification').classList.add('hidden');
    this.postCombatChoice();
  }

  updateStatsDisplay() {
    document.getElementById('char-name').textContent = this.character.name;
    document.getElementById('char-level').textContent = this.character.level;
    document.getElementById('char-hp').textContent = `${this.character.hp}/${this.character.maxHp}`;
    document.getElementById('char-mp').textContent = `${this.character.mp}/${this.character.maxMp}`;
    document.getElementById('char-strength').textContent = this.character.strength;
    document.getElementById('char-intelligence').textContent = this.character.intelligence;
    document.getElementById('char-agility').textContent = this.character.agility;
    
    // Update XP bar
    const xpPercentage = (this.character.xp / this.character.xpToNextLevel) * 100;
    document.getElementById('xp-fill').style.width = `${xpPercentage}%`;
    document.getElementById('xp-text').textContent = `${this.character.xp} / ${this.character.xpToNextLevel} XP`;
    
    // Update skills
    this.updateSkillsDisplay();
  }

  updateSkillsDisplay() {
    const container = document.getElementById('skills-list');
    container.innerHTML = '';
    
    this.character.unlockedSkills.forEach(skillId => {
      const skill = GAME_DATA.skills.find(s => s.id === skillId);
      const badge = document.createElement('span');
      badge.className = 'skill-badge';
      badge.textContent = skill.name;
      container.appendChild(badge);
    });
  }

  updateEnemyHp() {
    document.getElementById('enemy-hp').textContent = `${Math.max(0, this.currentMonster.hp)}/${this.currentMonster.maxHp}`;
  }

  addCombatLog(message) {
    const log = document.getElementById('combat-log');
    const p = document.createElement('p');
    p.innerHTML = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});