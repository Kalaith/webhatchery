// Game State
let gameState = {
    tension: 50,
    morale: 78,
    gold: 150,
    supplies: 'High',
    reputation: 'Neutral',
    location: 'The Prancing Pony Tavern',
    selectedNPC: null,
    storyEvents: [],
    turnCount: 0
};

// NPC Data
const npcs = [
    {
        id: 'gareth',
        name: "Gareth the Bold",
        class: "Fighter",
        personality: "Aggressive",
        mood: 75,
        description: "A brave warrior who always wants to charge headfirst into danger",
        currentRequest: "I say we venture forth and find some real adventure! This tavern talk is making me restless.",
        portraitClass: "fighter",
        commonRequests: [
            "Let's attack those monsters before they see us!",
            "I want to kick down that door!",
            "We should challenge them to single combat!",
            "I'll lead the charge against our enemies!"
        ]
    },
    {
        id: 'luna',
        name: "Luna the Wise",
        class: "Wizard",
        personality: "Cautious",
        mood: 80,
        description: "A scholarly mage who prefers careful planning and research",
        currentRequest: "Perhaps we should gather more information about potential dangers before rushing into anything.",
        portraitClass: "wizard",
        commonRequests: [
            "Let me examine this with a detect magic spell first",
            "We should research this area before proceeding",
            "I think we need more information before acting",
            "Can we set up camp and prepare our spells?"
        ]
    },
    {
        id: 'pip',
        name: "Pip the Curious",
        class: "Rogue",
        personality: "Impulsive",
        mood: 85,
        description: "A sneaky rogue who can't resist investigating every mystery",
        currentRequest: "I heard whispers about a hidden treasure in the old ruins nearby. We should investigate!",
        portraitClass: "rogue",
        commonRequests: [
            "I want to sneak ahead and scout the area",
            "Let me try to pick that lock!",
            "What's in that chest over there?",
            "I'll slip into the shadows and listen in"
        ]
    },
    {
        id: 'marcus',
        name: "Brother Marcus",
        class: "Cleric",
        personality: "Helpful",
        mood: 90,
        description: "A kind healer who always wants to help others in need",
        currentRequest: "I've heard there are villagers in need near the crossroads. We should offer our assistance.",
        portraitClass: "cleric",
        commonRequests: [
            "I should heal the wounded party member",
            "Let's help these villagers with their problem",
            "We should bless our weapons before the fight",
            "I want to tend to the injured innocent"
        ]
    },
    {
        id: 'kara',
        name: "Kara the Ranger",
        class: "Archer",
        personality: "Practical",
        mood: 70,
        description: "A tactical ranger who always suggests the most sensible approach",
        currentRequest: "We should stock up on supplies and plan our route carefully before leaving town.",
        portraitClass: "archer",
        commonRequests: [
            "I'll track the enemies' movements",
            "We should take the high ground for better position",
            "Let me gather supplies before we continue",
            "I think we should split up to cover more ground"
        ]
    }
];

// Scenarios and Events
const scenarios = [
    {
        title: "The Mysterious Cave",
        description: "Your party discovers a dark cave entrance with strange sounds echoing from within",
        tensionLevel: "medium"
    },
    {
        title: "Bandit Ambush",
        description: "Bandits have blocked the road ahead and are demanding payment",
        tensionLevel: "high"
    },
    {
        title: "Village in Need",
        description: "A small village asks for your help with a local monster problem",
        tensionLevel: "low"
    },
    {
        title: "Ancient Ruins",
        description: "You've discovered mysterious ruins covered in strange symbols",
        tensionLevel: "medium"
    }
];

const randomEvents = [
    "A sudden thunderstorm forces the party to seek shelter",
    "You encounter a mysterious traveler on the road",
    "Strange magical energies fill the air",
    "A wild animal appears and seems distressed",
    "You find an old treasure map buried in the dirt"
];

// Initialize Game
function initializeGame() {
    renderNPCs();
    updateGameStatus();
    addStoryEvent("Your adventuring party has gathered at the Prancing Pony Tavern to plan their next adventure. The fire crackles warmly as your companions discuss potential quests and share their thoughts on what lies ahead...");
}

// Render NPCs
function renderNPCs() {
    const npcList = document.getElementById('npc-list');
    npcList.innerHTML = '';
    
    npcs.forEach(npc => {
        const npcCard = document.createElement('div');
        npcCard.className = `npc-card ${gameState.selectedNPC === npc.id ? 'selected' : ''}`;
        npcCard.onclick = () => selectNPC(npc.id);
        npcCard.tabIndex = 0;
        npcCard.setAttribute('role', 'button');
        npcCard.setAttribute('aria-label', `Select ${npc.name}`);
        
        const moodLevel = npc.mood >= 70 ? 'high' : npc.mood >= 40 ? 'medium' : 'low';
        
        npcCard.innerHTML = `
            <div class="npc-portrait ${npc.portraitClass}">
                ${npc.name.charAt(0)}
            </div>
            <div class="npc-info">
                <h4 class="npc-name">${npc.name}</h4>
                <p class="npc-class">${npc.class} • ${npc.personality}</p>
                <div class="npc-mood">
                    <div class="mood-bar">
                        <div class="mood-fill ${moodLevel}" style="width: ${npc.mood}%"></div>
                    </div>
                    <span class="mood-value">${npc.mood}</span>
                </div>
            </div>
        `;
        
        npcList.appendChild(npcCard);
    });
}

// Select NPC
function selectNPC(npcId) {
    gameState.selectedNPC = npcId;
    const selectedNPC = npcs.find(npc => npc.id === npcId);
    
    if (selectedNPC) {
        document.getElementById('request-text').textContent = selectedNPC.currentRequest;
        document.getElementById('request-npc').textContent = `— ${selectedNPC.name}`;
        document.getElementById('response-options').style.display = 'block';
    }
    
    renderNPCs();
}

// Respond to NPC
function respondToNPC(responseType) {
    if (!gameState.selectedNPC) return;
    
    const selectedNPC = npcs.find(npc => npc.id === gameState.selectedNPC);
    if (!selectedNPC) return;
    
    let response = '';
    let moodChange = 0;
    let tensionChange = 0;
    
    switch (responseType) {
        case 'approve':
            response = `You approve ${selectedNPC.name}'s suggestion. `;
            moodChange = Math.floor(Math.random() * 10) + 5;
            tensionChange = selectedNPC.personality === 'Aggressive' ? 15 : 
                          selectedNPC.personality === 'Cautious' ? -10 : 5;
            response += generateApprovalOutcome(selectedNPC);
            break;
            
        case 'deny':
            response = `You politely decline ${selectedNPC.name}'s suggestion. `;
            moodChange = -(Math.floor(Math.random() * 8) + 3);
            tensionChange = -5;
            response += generateDenialOutcome(selectedNPC);
            break;
            
        case 'modify':
            response = `You suggest a modification to ${selectedNPC.name}'s idea. `;
            moodChange = Math.floor(Math.random() * 5) + 1;
            tensionChange = Math.floor(Math.random() * 10) - 5;
            response += generateModificationOutcome(selectedNPC);
            break;
            
        case 'alternative':
            response = `You propose an alternative to ${selectedNPC.name}. `;
            moodChange = Math.floor(Math.random() * 6) - 2;
            tensionChange = Math.floor(Math.random() * 8) - 4;
            response += generateAlternativeOutcome(selectedNPC);
            break;
    }
    
    // Update NPC mood
    selectedNPC.mood = Math.max(0, Math.min(100, selectedNPC.mood + moodChange));
    
    // Update game state
    gameState.tension = Math.max(0, Math.min(100, gameState.tension + tensionChange));
    updateMorale();
    
    // Generate new request for NPC
    generateNewRequest(selectedNPC);
    
    // Add story event
    addStoryEvent(response);
    
    // Clear selection
    gameState.selectedNPC = null;
    document.getElementById('response-options').style.display = 'none';
    document.getElementById('request-text').textContent = 'Select an NPC to see their request';
    document.getElementById('request-npc').textContent = '';
    
    // Update displays
    renderNPCs();
    updateGameStatus();
    
    gameState.turnCount++;
    
    // Random chance for events
    if (Math.random() < 0.3) {
        setTimeout(() => triggerRandomEvent(), 2000);
    }
}

// Generate outcome text
function generateApprovalOutcome(npc) {
    const outcomes = {
        'Aggressive': [
            "Gareth charges forward with enthusiasm, leading the party boldly into action!",
            "The fighter's bold approach inspires the others, though it raises the stakes.",
            "Gareth's aggressive tactics prove effective, but danger lurks ahead."
        ],
        'Cautious': [
            "Luna's careful approach reveals important details others might have missed.",
            "The wizard's methodical planning helps the party avoid potential pitfalls.",
            "Luna's research uncovers valuable information that guides the party safely."
        ],
        'Impulsive': [
            "Pip's curiosity leads to an unexpected discovery!",
            "The rogue's investigation reveals hidden secrets and opportunities.",
            "Pip's bold exploration pays off, though it attracts some attention."
        ],
        'Helpful': [
            "Brother Marcus's compassion strengthens the party's reputation with locals.",
            "The cleric's aid creates positive relationships that may help later.",
            "Marcus's healing and help boost everyone's spirits significantly."
        ],
        'Practical': [
            "Kara's sensible approach keeps the party well-prepared and organized.",
            "The ranger's tactical thinking gives the party a strategic advantage.",
            "Kara's practical planning prevents potential problems down the road."
        ]
    };
    
    const options = outcomes[npc.personality] || ["The party moves forward with the plan."];
    return options[Math.floor(Math.random() * options.length)];
}

function generateDenialOutcome(npc) {
    return `${npc.name} accepts your decision, though they seem a bit disappointed. The party considers other options.`;
}

function generateModificationOutcome(npc) {
    return `${npc.name} considers your suggestion and agrees to the modified approach. The party adapts their plan accordingly.`;
}

function generateAlternativeOutcome(npc) {
    return `${npc.name} listens to your alternative idea. After some discussion, the party decides to try this new approach.`;
}

// Generate new NPC request
function generateNewRequest(npc) {
    const requests = npc.commonRequests;
    let newRequest;
    
    do {
        newRequest = requests[Math.floor(Math.random() * requests.length)];
    } while (newRequest === npc.currentRequest);
    
    npc.currentRequest = newRequest;
}

// Submit custom response
function submitCustomResponse() {
    const customInput = document.getElementById('custom-input');
    const customText = customInput.value.trim();
    
    if (!customText) return;
    
    // Add custom story event
    addStoryEvent(`DM: ${customText}`);
    
    // Small random changes to game state
    gameState.tension += Math.floor(Math.random() * 10) - 5;
    gameState.tension = Math.max(0, Math.min(100, gameState.tension));
    
    // Clear input
    customInput.value = '';
    
    // Generate NPC reactions to custom response
    setTimeout(() => {
        const reactingNPC = npcs[Math.floor(Math.random() * npcs.length)];
        generateNPCReaction(reactingNPC, customText);
    }, 1500);
    
    updateGameStatus();
    gameState.turnCount++;
}

// Generate NPC reaction
function generateNPCReaction(npc, dmAction) {
    const reactions = {
        'Aggressive': [
            `${npc.name} nods approvingly: "Now that's more like it! Let's get moving!"`,
            `${npc.name} pounds his fist: "Finally, some action! I'm ready for whatever comes!"`,
            `${npc.name} grins: "That's the spirit! No more sitting around!"`
        ],
        'Cautious': [
            `${npc.name} strokes her chin thoughtfully: "Interesting approach. We should consider all implications."`,
            `${npc.name} nods slowly: "A measured response. I appreciate the careful consideration."`,
            `${npc.name} adjusts her robes: "Wisdom guides us. Let's proceed with caution."`
        ],
        'Impulsive': [
            `${npc.name} bounces excitedly: "Ooh, I wonder what we'll find! This is getting interesting!"`,
            `${npc.name} rubs hands together: "Now we're talking! I can't wait to see what happens!"`,
            `${npc.name} grins mischievously: "This should be fun! I have a few ideas of my own..."`
        ],
        'Helpful': [
            `${npc.name} smiles warmly: "A compassionate choice. The gods smile upon such decisions."`,
            `${npc.name} bows his head: "Your guidance brings hope to those in need."`,
            `${npc.name} clasps hands in prayer: "May our path be blessed with righteousness."`
        ],
        'Practical': [
            `${npc.name} nods efficiently: "Solid reasoning. I'll adjust our supplies and tactics accordingly."`,
            `${npc.name} checks her equipment: "A practical approach. I'll make sure we're prepared."`,
            `${npc.name} studies the area: "Good call. I'll scout ahead and secure our flanks."`
        ]
    };
    
    const reactionOptions = reactions[npc.personality] || [`${npc.name} acknowledges your decision.`];
    const reaction = reactionOptions[Math.floor(Math.random() * reactionOptions.length)];
    
    addStoryEvent(reaction);
}

// Story progression functions
function advanceTime() {
    const timeEvents = [
        "Several hours pass as the party travels along the winding road...",
        "The sun begins to set, casting long shadows across the landscape...",
        "Night falls, and the party sets up camp under the starlit sky...",
        "Dawn breaks, and the party prepares for a new day of adventure...",
        "The party rests briefly, sharing stories and planning their next move..."
    ];
    
    const event = timeEvents[Math.floor(Math.random() * timeEvents.length)];
    addStoryEvent(event);
    
    // Time passage effects
    gameState.tension = Math.max(0, gameState.tension - 10);
    updateMorale();
    updateGameStatus();
    
    // Generate new NPC requests after time passes
    npcs.forEach(npc => {
        if (Math.random() < 0.4) {
            generateNewRequest(npc);
        }
    });
    
    renderNPCs();
}

function introduceEvent() {
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    addStoryEvent(`Random Event: ${event}`);
    
    gameState.tension += Math.floor(Math.random() * 15) + 5;
    gameState.tension = Math.min(100, gameState.tension);
    
    updateGameStatus();
    
    // NPCs react to random events
    setTimeout(() => {
        const reactingNPC = npcs[Math.floor(Math.random() * npcs.length)];
        generateEventReaction(reactingNPC, event);
    }, 1500);
}

function addChallenge() {
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    gameState.location = scenario.title;
    document.getElementById('current-location').textContent = scenario.title;
    
    addStoryEvent(`New Challenge: ${scenario.description}`);
    
    const tensionIncrease = scenario.tensionLevel === 'high' ? 25 : 
                           scenario.tensionLevel === 'medium' ? 15 : 10;
    gameState.tension += tensionIncrease;
    gameState.tension = Math.min(100, gameState.tension);
    
    updateGameStatus();
    
    // All NPCs get new situation-appropriate requests
    setTimeout(() => {
        npcs.forEach(npc => {
            generateSituationalRequest(npc, scenario);
        });
        renderNPCs();
    }, 1000);
}

// Generate situational requests based on scenarios
function generateSituationalRequest(npc, scenario) {
    const situationalRequests = {
        'Aggressive': {
            'The Mysterious Cave': "I say we charge into that cave! What's the worst that could happen?",
            'Bandit Ambush': "Let's fight these bandits! I won't pay tribute to common thugs!",
            'Village in Need': "Point me toward the monster! I'll take care of this problem!",
            'Ancient Ruins': "These ruins won't explore themselves! Let's break down that door!"
        },
        'Cautious': {
            'The Mysterious Cave': "We should examine the cave entrance for traps and magical auras first.",
            'Bandit Ambush': "Perhaps we can negotiate or find an alternative route around them.",
            'Village in Need': "Let's gather information about this monster before engaging it.",
            'Ancient Ruins': "I should study these symbols and detect any magical protections."
        },
        'Impulsive': {
            'The Mysterious Cave': "I'll sneak ahead and see what's making those sounds!",
            'Bandit Ambush': "I bet I can pick their pockets while we're 'negotiating'!",
            'Village in Need': "Let me investigate the area where the monster was last seen!",
            'Ancient Ruins': "I wonder what treasures might be hidden in these ruins!"
        },
        'Helpful': {
            'The Mysterious Cave': "If someone is trapped in there, we should help them immediately.",
            'Bandit Ambush': "Perhaps these bandits can be redeemed rather than fought.",
            'Village in Need': "These villagers need our protection. We must answer their call.",
            'Ancient Ruins': "We should ensure these ruins don't pose a danger to nearby settlements."
        },
        'Practical': {
            'The Mysterious Cave': "I'll check our rope and torches before we enter the cave.",
            'Bandit Ambush': "We should assess their numbers and positioning before deciding.",
            'Village in Need': "Let's determine what resources we'll need for this monster hunt.",
            'Ancient Ruins': "I'll scout the perimeter and check for structural integrity."
        }
    };
    
    const requests = situationalRequests[npc.personality];
    npc.currentRequest = requests[scenario.title] || npc.currentRequest;
}

// Generate event reactions
function generateEventReaction(npc, event) {
    const eventReactions = {
        'Aggressive': `${npc.name} readies his weapon: "Whatever this is, I'm ready for it!"`,
        'Cautious': `${npc.name} observes carefully: "We should proceed with extreme caution."`,
        'Impulsive': `${npc.name} perks up with interest: "Now this is getting exciting!"`,
        'Helpful': `${npc.name} looks concerned: "I hope everyone is safe. How can we help?"`,
        'Practical': `${npc.name} assesses the situation: "Let's stay calm and adapt our plans."`
    };
    
    const reaction = eventReactions[npc.personality];
    if (reaction) {
        addStoryEvent(reaction);
    }
}

// Add story event
function addStoryEvent(text) {
    gameState.storyEvents.push(text);
    const storyContent = document.getElementById('story-content');
    
    const newEvent = document.createElement('p');
    newEvent.textContent = text;
    newEvent.className = 'story-update';
    
    storyContent.appendChild(newEvent);
    storyContent.scrollTop = storyContent.scrollHeight;
}

// Update morale based on individual NPC moods
function updateMorale() {
    const totalMood = npcs.reduce((sum, npc) => sum + npc.mood, 0);
    gameState.morale = Math.round(totalMood / npcs.length);
}

// Update game status displays
function updateGameStatus() {
    // Update tension
    document.getElementById('tension-meter').style.width = `${gameState.tension}%`;
    const tensionText = gameState.tension >= 70 ? 'High' : 
                       gameState.tension >= 40 ? 'Medium' : 'Low';
    document.getElementById('tension-value').textContent = tensionText;
    
    // Update morale
    document.getElementById('morale-meter').style.width = `${gameState.morale}%`;
    const moraleText = gameState.morale >= 70 ? 'Great' : 
                      gameState.morale >= 50 ? 'Good' : 
                      gameState.morale >= 30 ? 'Fair' : 'Poor';
    document.getElementById('morale-value').textContent = moraleText;
    
    // Update resources
    document.getElementById('gold-amount').textContent = gameState.gold;
    document.getElementById('supplies-amount').textContent = gameState.supplies;
    document.getElementById('reputation-amount').textContent = gameState.reputation;
}

// Keyboard navigation for NPC cards
document.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('npc-card') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
    }
});

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initializeGame);