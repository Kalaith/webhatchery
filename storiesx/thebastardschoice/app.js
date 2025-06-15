// Game of Thrones Choose Your Own Adventure - JavaScript

// Game State
let gameState = {
    currentStory: 'start',
    stats: {
        honor: 50,
        cunning: 50,
        gold: 100
    },
    reputation: {
        stark: 0,
        lannister: 0,
        tully: 20,
        baratheon: 0,
        arryn: 0,
        martell: 0
    },
    location: 'Riverrun',
    notes: [],
    choices: [],
    hasItem: {}
};

// Story Data
const stories = {
    start: {
        title: "The Raven's Message",
        location: "Riverrun",
        text: `<p>The autumn wind howls through the towers of Riverrun as you sit in your modest chambers. As a bastard of House Tully, you've grown accustomed to the cold stone walls and the whispers that follow you through the halls.</p>
               <p>A sharp rap at your window draws your attention. A raven perches outside, its black eyes gleaming in the candlelight. The message it carries bears no seal, but the parchment is of fine quality.</p>
               <p class="dialogue">"War comes to Westeros, Seren Rivers. The old alliances crumble like autumn leaves. Choose your friends wisely, for winter is coming, and bastards who stand alone do not survive the cold. Meet me at the crossroads inn when the moon is full, if you would know more. A friend in shadows."</p>
               <p>You stare at the cryptic message, your heart racing. Tomorrow, your half-brother Edmure returns from King's Landing. Perhaps he brings news of the realm's troubles, or perhaps this mysterious message holds the key to your survival.</p>`,
        choices: [
            {
                text: "Seek out Edmure immediately upon his return to share the message",
                hint: "Honor +10, Tully reputation +5",
                action: () => {
                    modifyStats({ honor: 10 });
                    modifyReputation('tully', 5);
                    addNote("Showed mysterious message to Edmure Tully");
                    setStory('edmure_meeting');
                }
            },
            {
                text: "Keep the message secret and investigate on your own",
                hint: "Cunning +10",
                action: () => {
                    modifyStats({ cunning: 10 });
                    addNote("Decided to investigate the mysterious message alone");
                    setStory('secret_investigation');
                }
            },
            {
                text: "Burn the message and pretend it never arrived",
                hint: "Lose potential allies, but avoid immediate danger",
                action: () => {
                    addNote("Burned the mysterious message without acting");
                    setStory('message_burned');
                }
            }
        ]
    },

    edmure_meeting: {
        title: "Family Counsel",
        location: "Riverrun",
        text: `<p>You find Edmure in the great hall, still mud-splattered from the road. His face is grim as he speaks with Maester Vyman about supplies and defenses. When he sees you approach, his expression softens slightly.</p>
               <p class="dialogue">"Seren, good. I was hoping to speak with you. The realm grows darker by the day."</p>
               <p>You show him the message, watching his face carefully. His eyes widen as he reads, then narrow with concern.</p>
               <p class="dialogue">"This is... troubling. In King's Landing, I heard whispers of Robert's failing health and the queen's ambitions. If someone knows you exist and considers you useful..."</p>
               <p>He looks at you directly, his voice dropping to a whisper.</p>
               <p class="dialogue">"I won't lie to you, brother. War is coming. The question is whether we can trust this mysterious friend, or if this is a trap. What do you counsel?"</p>`,
        choices: [
            {
                text: "Advise Edmure to prepare Riverrun's defenses and ignore the message",
                hint: "Honor +5, Tully reputation +10",
                action: () => {
                    modifyStats({ honor: 5 });
                    modifyReputation('tully', 10);
                    addNote("Advised Edmure to focus on defending Riverrun");
                    setStory('riverrun_defense');
                }
            },
            {
                text: "Suggest meeting the mysterious contact, but with Tully guards",
                hint: "Balanced approach, Cunning +5",
                action: () => {
                    modifyStats({ cunning: 5 });
                    addNote("Planned to meet the mysterious contact with guards");
                    setStory('guarded_meeting');
                }
            },
            {
                text: "Propose going to King's Landing to gather intelligence personally",
                hint: "Dangerous but potentially rewarding",
                action: () => {
                    modifyStats({ cunning: 5 });
                    addNote("Decided to go to King's Landing for intelligence");
                    setStory('kings_landing_journey');
                }
            }
        ]
    },

    secret_investigation: {
        title: "Shadows and Whispers",
        location: "Riverrun",
        text: `<p>You decide to investigate the message alone, moving through Riverrun's corridors like a shadow. Your bastard status has taught you to be observant, to listen at doors and read the signs others miss.</p>
               <p>In the stables, you overhear two guards discussing strange riders seen near the Twins. In the kitchens, servants whisper about ravens flying at odd hours. The pieces of a larger puzzle begin to form in your mind.</p>
               <p>As you explore the castle's forgotten passages, you discover something unexpected: Maester Vyman burns correspondence in the middle of the night, and the ashes smell of expensive parchment.</p>
               <p>You realize that secrets run deeper in Riverrun than you imagined. Perhaps the message wasn't random after all.</p>`,
        choices: [
            {
                text: "Confront Maester Vyman about the burned letters",
                hint: "Direct approach, Honor +5",
                requirement: "Honor >= 55",
                action: () => {
                    modifyStats({ honor: 5 });
                    addNote("Confronted Maester Vyman about secret correspondence");
                    setStory('maester_confrontation');
                }
            },
            {
                text: "Spy on the Maester to learn more before acting",
                hint: "Cunning +10, but risk discovery",
                action: () => {
                    modifyStats({ cunning: 10 });
                    addNote("Began spying on Maester Vyman");
                    setStory('maester_spying');
                }
            },
            {
                text: "Travel to the crossroads inn as the message suggested",
                hint: "Follow the original plan alone",
                action: () => {
                    addNote("Decided to meet the mysterious contact alone");
                    setStory('crossroads_alone');
                }
            }
        ]
    },

    message_burned: {
        title: "The Coward's Path",
        location: "Riverrun",
        text: `<p>You hold the parchment over the candle flame, watching the mysterious words curl and blacken. The ashes drift to the floor like snow, and with them, perhaps, your chance at something greater than your bastard's lot.</p>
               <p>Days pass quietly. Edmure returns and speaks of troubles in the realm, but you say nothing. You go about your daily routines, training with the master-at-arms, studying with the servants, trying to forget the message ever existed.</p>
               <p>But the realm does not forget. A week later, riders arrive at Riverrun's gates bearing the three-headed dragon of House Targaryen. Among them is a woman with silver-gold hair and violet eyes, flanked by Dothraki warriors.</p>
               <p>The message you burned was your only warning. Now Daenerys Targaryen stands before the gates of Riverrun, and you realize that in trying to avoid the game, you may have already lost it.</p>`,
        choices: [
            {
                text: "Present yourself to Daenerys as a loyal bastard of House Tully",
                hint: "Honor +5, but limited options",
                action: () => {
                    modifyStats({ honor: 5 });
                    addNote("Presented yourself to Daenerys Targaryen");
                    setStory('daenerys_meeting');
                }
            },
            {
                text: "Try to flee Riverrun before being noticed",
                hint: "Cunning +5, but risk being caught",
                action: () => {
                    modifyStats({ cunning: 5 });
                    addNote("Attempted to flee Riverrun");
                    setStory('fleeing_riverrun');
                }
            },
            {
                text: "Hide and wait to see what happens",
                hint: "Safe but passive approach",
                action: () => {
                    addNote("Decided to hide and observe");
                    setStory('hiding_watching');
                }
            }
        ]
    },

    crossroads_alone: {
        title: "The Crossroads Inn",
        location: "Crossroads Inn",
        text: `<p>The crossroads inn stands at the meeting of the river road and the kingsroad, a place where travelers from across the realm converge. You arrive as the full moon rises, casting silver light across the wooden sign depicting the two-headed dragon.</p>
               <p>Inside, the common room buzzes with conversation. Merchants, knights, and common folk share tables and stories. You order ale and wait, watching the shadows.</p>
               <p>A figure approaches your table - a woman with sharp eyes and simple clothes, unremarkable except for the way she moves with predatory grace.</p>
               <p class="dialogue">"Seren Rivers, I presume? I am Asha Greyjoy, and I speak for those who would see the realm united under a worthy ruler. Your bloodline may be bastard-born, but your mind is sharp, and sharp minds are valuable in the wars to come."</p>
               <p>She slides a small pouch of gold across the table.</p>
               <p class="dialogue">"This is a token of good faith. Greater rewards await those who choose the winning side."</p>`,
        choices: [
            {
                text: "Accept the gold and hear her full proposal",
                hint: "Gold +50, Cunning +5, but commit to her cause",
                action: () => {
                    modifyStats({ gold: 50, cunning: 5 });
                    addNote("Accepted gold from Asha Greyjoy");
                    setStory('greyjoy_alliance');
                }
            },
            {
                text: "Refuse the gold but offer to trade information",
                hint: "Honor +5, maintain independence",
                action: () => {
                    modifyStats({ honor: 5 });
                    addNote("Refused Greyjoy gold but offered information trade");
                    setStory('information_trade');
                }
            },
            {
                text: "Politely decline and attempt to leave",
                hint: "Safe but miss opportunity",
                action: () => {
                    addNote("Declined Asha Greyjoy's offer");
                    setStory('declined_greyjoy');
                }
            }
        ]
    },

    riverrun_defense: {
        title: "Preparing for War",
        location: "Riverrun",
        text: `<p>Under your counsel, Edmure focuses on strengthening Riverrun's defenses. The walls are reinforced, supplies are stockpiled, and the garrison is doubled. Your decision to prioritize defense over intrigue proves wise when scouts report Lannister forces moving toward the Riverlands.</p>
               <p>As you walk the battlements with Edmure, he speaks of the gathering storm.</p>
               <p class="dialogue">"You were right to urge caution, Seren. Whatever game that message-sender wanted to play, we're better served protecting our own."</p>
               <p>A raven arrives with news that changes everything: King Robert is dead, and Joffrey Baratheon sits the Iron Throne. The realm is fracturing, and neutrality may no longer be possible.</p>`,
        choices: [
            {
                text: "Advise Edmure to declare for Robb Stark",
                hint: "Honor +15, Stark reputation +20, but risk war",
                action: () => {
                    modifyStats({ honor: 15 });
                    modifyReputation('stark', 20);
                    modifyReputation('lannister', -20);
                    addNote("Advised Edmure to declare for Robb Stark");
                    setStory('stark_declaration');
                }
            },
            {
                text: "Counsel neutrality until the situation clarifies",
                hint: "Cunning +10, avoid immediate commitment",
                action: () => {
                    modifyStats({ cunning: 10 });
                    addNote("Counseled neutrality during the succession crisis");
                    setStory('tully_neutrality');
                }
            },
            {
                text: "Secretly negotiate with multiple sides",
                hint: "Cunning +15, but risk exposure",
                action: () => {
                    modifyStats({ cunning: 15 });
                    addNote("Began secret negotiations with multiple factions");
                    setStory('secret_negotiations');
                }
            }
        ]
    },

    stark_declaration: {
        title: "The Young Wolf's Banner",
        location: "Riverrun",
        text: `<p>With your counsel, Edmure declares for Robb Stark, raising the direwolf banners alongside the Tully trout. Ravens fly to every lord in the Riverlands, calling them to war against the Lannisters who murdered Ned Stark.</p>
               <p>The response is swift and decisive. Most river lords answer the call, but some hedge their bets, and a few openly refuse. Walder Frey sends word that the Twins will remain closed to all armies until proper tribute is paid.</p>
               <p>You find yourself elevated to a position of trust, serving as one of Edmure's key advisors. When Robb Stark himself arrives at Riverrun with his army, you're among those presented to the King in the North.</p>
               <p class="dialogue">"So you're the bastard who helped convince my uncle to join our cause,"</p> Robb says, his young face serious despite his youth. <p class="dialogue">"I have need of clever counsel. Will you serve the North?"</p>`,
        choices: [
            {
                text: "Pledge yourself completely to Robb Stark's cause",
                hint: "Honor +20, become trusted advisor",
                action: () => {
                    modifyStats({ honor: 20 });
                    gameState.hasItem.robbsAdvisor = true;
                    addNote("Became one of Robb Stark's trusted advisors");
                    setStory('robbs_advisor');
                }
            },
            {
                text: "Offer to serve as a diplomatic envoy",
                hint: "Cunning +10, Honor +5, maintain flexibility",
                action: () => {
                    modifyStats({ cunning: 10, honor: 5 });
                    addNote("Became a diplomatic envoy for the Stark cause");
                    setStory('stark_envoy');
                }
            },
            {
                text: "Request to lead intelligence operations",
                hint: "Cunning +15, dangerous but influential role",
                action: () => {
                    modifyStats({ cunning: 15 });
                    addNote("Took charge of intelligence operations for Robb Stark");
                    setStory('stark_spymaster');
                }
            }
        ]
    },

    // Ending stories
    ending_honorable_death: {
        title: "The Price of Honor",
        location: "Riverlands",
        text: `<p>Your unwavering commitment to honor and justice has made you a beacon of hope in dark times, but it has also made you enemies. As you ride through the Riverlands, trying to rally support for the righteous cause, you are ambushed by sellswords hired by those who profit from chaos.</p>
               <p>You fight bravely, your sword singing as it cuts through the morning air. Though outnumbered, you stand your ground rather than flee. Songs will be sung of your final charge, of how Seren Rivers, the bastard who chose honor over life, held the crossing against twenty men.</p>
               <p>As you fall, your last sight is of the Tully trout banners on the horizon - Edmure has come, but too late. Your sacrifice, however, is not forgotten. The river lords remember the bastard who died for honor, and your example inspires others to resist tyranny.</p>
               <p>In death, you achieved what few bastards ever could - you became a legend.</p>`,
        isEnding: true,
        endingType: "Honorable Death"
    },

    ending_master_of_whispers: {
        title: "The Spider's Web",
        location: "King's Landing",
        text: `<p>Your cunning and careful maneuvering through the game of thrones has paid off spectacularly. Through a combination of blackmail, strategic alliances, and information brokering, you have become one of the most powerful figures in Westeros.</p>
               <p>From your tower in King's Landing, you orchestrate the rise and fall of lords, the movement of armies, and the fate of kingdoms. Your bastard birth, once a source of shame, has become your greatest asset - no one suspects the bastard of being the true power behind multiple thrones.</p>
               <p>You have agents in every major house, secrets that could topple kingdoms, and the ear of rulers across the known world. Kings and queens seek your counsel, though they never realize how thoroughly you manipulate them.</p>
               <p>You are no longer Seren Rivers, bastard of House Tully. You are the Master of Whispers, the one who truly rules from the shadows while others fight over crowns.</p>`,
        isEnding: true,
        endingType: "Master of Whispers"
    },

    ending_independent_lord: {
        title: "Lord of the Rivers",
        location: "New Holdfast",
        text: `<p>Your careful balance of cunning and honor, your ability to play all sides while maintaining your principles, has earned you something unprecedented - your own lordship. The chaos of war created opportunities, and you seized them masterfully.</p>
               <p>Through strategic marriages, wise investments, and timely interventions, you've acquired lands and titles. The holdfasts along the Trident now fly banners bearing your personal sigil - a silver trout swimming upstream against a field of blue and gold.</p>
               <p>Lord Seren of House Rivers - the title still sounds strange, but the respect it commands is real. You've proven that in Westeros, bastards can rise, but only if they're willing to work twice as hard and think three times as carefully as their trueborn peers.</p>
               <p>From your seat at Riversmeet, you watch as the realm continues to face challenges. But your lands remain prosperous, your people are protected, and your bastard's name is spoken with respect from the Twins to King's Landing.</p>`,
        isEnding: true,
        endingType: "Independent Lord"
    }
};

// Utility Functions
function setStory(storyKey) {
    if (!stories[storyKey]) {
        console.error('Story not found:', storyKey);
        return;
    }
    gameState.currentStory = storyKey;
    gameState.choices.push(storyKey);
    renderStory();
    checkForEndings();
}

function modifyStats(changes) {
    Object.keys(changes).forEach(stat => {
        if (gameState.stats.hasOwnProperty(stat)) {
            gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + changes[stat]));
        }
    });
    updateStatsDisplay();
}

function modifyReputation(house, change) {
    if (gameState.reputation.hasOwnProperty(house)) {
        gameState.reputation[house] = Math.max(-50, Math.min(50, gameState.reputation[house] + change));
        updateReputationDisplay();
    }
}

function addNote(note) {
    gameState.notes.push(note);
}

function updateStatsDisplay() {
    const honorValue = document.getElementById('honor-value');
    const cunningValue = document.getElementById('cunning-value');
    const goldValue = document.getElementById('gold-value');
    const honorFill = document.getElementById('honor-fill');
    const cunningFill = document.getElementById('cunning-fill');
    
    if (honorValue) honorValue.textContent = gameState.stats.honor;
    if (cunningValue) cunningValue.textContent = gameState.stats.cunning;
    if (goldValue) goldValue.textContent = gameState.stats.gold;
    if (honorFill) honorFill.style.width = gameState.stats.honor + '%';
    if (cunningFill) cunningFill.style.width = gameState.stats.cunning + '%';
}

function updateReputationDisplay() {
    const reputationList = document.getElementById('reputation-list');
    if (!reputationList) return;
    
    reputationList.innerHTML = '';
    
    Object.entries(gameState.reputation).forEach(([house, rep]) => {
        if (rep !== 0) {
            const item = document.createElement('div');
            item.className = 'reputation-item';
            
            let status = 'neutral';
            let statusText = 'Neutral';
            if (rep > 10) {
                status = 'friendly';
                statusText = 'Friendly';
            } else if (rep < -10) {
                status = 'hostile';
                statusText = 'Hostile';
            }
            
            item.innerHTML = `
                <span class="reputation-house">${house.charAt(0).toUpperCase() + house.slice(1)}</span>
                <span class="reputation-status ${status}">${statusText}</span>
            `;
            reputationList.appendChild(item);
        }
    });
}

function renderStory() {
    const story = stories[gameState.currentStory];
    if (!story) {
        console.error('Story not found for current state:', gameState.currentStory);
        return;
    }
    
    // Update location
    gameState.location = story.location;
    const locationName = document.getElementById('location-name');
    const storyLocation = document.getElementById('story-location');
    if (locationName) locationName.textContent = gameState.location;
    if (storyLocation) storyLocation.textContent = gameState.location;
    
    // Update story content
    const storyTitle = document.getElementById('story-title');
    const storyText = document.getElementById('story-text');
    if (storyTitle) storyTitle.textContent = story.title;
    if (storyText) storyText.innerHTML = story.text;
    
    // Clear and populate choices
    const choicesContainer = document.getElementById('choices-container');
    if (!choicesContainer) return;
    
    choicesContainer.innerHTML = '';
    
    if (story.isEnding) {
        showEnding(story);
        return;
    }
    
    story.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        
        let disabled = false;
        if (choice.requirement) {
            const [stat, operator, value] = choice.requirement.split(' ');
            const currentValue = gameState.stats[stat.toLowerCase()];
            if (operator === '>=' && currentValue < parseInt(value)) {
                disabled = true;
            }
        }
        
        if (disabled) {
            button.disabled = true;
            button.innerHTML = `
                ${choice.text}
                <span class="choice-requirement">Requires ${choice.requirement}</span>
            `;
        } else {
            button.innerHTML = `
                ${choice.text}
                ${choice.hint ? `<span class="choice-hint">${choice.hint}</span>` : ''}
            `;
            button.addEventListener('click', () => {
                if (choice.action && typeof choice.action === 'function') {
                    choice.action();
                }
            });
        }
        
        choicesContainer.appendChild(button);
    });
}

function showEnding(story) {
    const gameScreen = document.getElementById('game-screen');
    const endingScreen = document.getElementById('ending-screen');
    
    if (gameScreen) gameScreen.classList.remove('active');
    if (endingScreen) endingScreen.classList.add('active');
    
    const endingTitle = document.getElementById('ending-title');
    const endingText = document.getElementById('ending-text');
    if (endingTitle) endingTitle.textContent = story.title;
    if (endingText) endingText.innerHTML = story.text;
    
    // Show final stats
    const finalStats = document.getElementById('final-stats');
    if (finalStats) {
        finalStats.innerHTML = `
            <div class="final-stat">
                <span>Honor:</span>
                <span>${gameState.stats.honor}</span>
            </div>
            <div class="final-stat">
                <span>Cunning:</span>
                <span>${gameState.stats.cunning}</span>
            </div>
            <div class="final-stat">
                <span>Gold:</span>
                <span>${gameState.stats.gold}</span>
            </div>
            <div class="final-stat">
                <span>Ending:</span>
                <span>${story.endingType}</span>
            </div>
        `;
    }
}

function checkForEndings() {
    const { honor, cunning, gold } = gameState.stats;
    const choices = gameState.choices;
    
    // Check if we've made enough choices for an ending
    if (choices.length >= 6) {
        // Master of whispers ending - high cunning
        if (cunning >= 85) {
            setStory('ending_master_of_whispers');
            return;
        }
        
        // Honorable death ending - very high honor
        if (honor >= 85) {
            setStory('ending_honorable_death');
            return;
        }
        
        // Independent lord ending - balanced stats
        if (honor >= 65 && cunning >= 65 && gold >= 150) {
            setStory('ending_independent_lord');
            return;
        }
    }
}

// Navigation Functions - Make them global
window.startGame = function() {
    console.log('Starting game...');
    
    // Hide title screen, show game screen
    const titleScreen = document.getElementById('title-screen');
    const gameScreen = document.getElementById('game-screen');
    
    if (titleScreen) titleScreen.classList.remove('active');
    if (gameScreen) gameScreen.classList.add('active');
    
    // Reset game state
    gameState = {
        currentStory: 'start',
        stats: { honor: 50, cunning: 50, gold: 100 },
        reputation: { stark: 0, lannister: 0, tully: 20, baratheon: 0, arryn: 0, martell: 0 },
        location: 'Riverrun',
        notes: [],
        choices: [],
        hasItem: {}
    };
    
    // Update displays
    updateStatsDisplay();
    updateReputationDisplay();
    renderStory();
};

window.restartGame = function() {
    console.log('Restarting game...');
    
    // Hide ending and game screens
    const endingScreen = document.getElementById('ending-screen');
    const gameScreen = document.getElementById('game-screen');
    const titleScreen = document.getElementById('title-screen');
    
    if (endingScreen) endingScreen.classList.remove('active');
    if (gameScreen) gameScreen.classList.remove('active');
    if (titleScreen) titleScreen.classList.add('active');
};

window.showTitleScreen = function() {
    console.log('Showing title screen...');
    
    // Hide all screens
    const endingScreen = document.getElementById('ending-screen');
    const gameScreen = document.getElementById('game-screen');
    const titleScreen = document.getElementById('title-screen');
    
    if (endingScreen) endingScreen.classList.remove('active');
    if (gameScreen) gameScreen.classList.remove('active');
    if (titleScreen) titleScreen.classList.add('active');
};

window.showInventory = function() {
    console.log('Showing inventory...');
    
    const modal = document.getElementById('inventory-modal');
    const notesList = document.getElementById('notes-list');
    
    if (!modal || !notesList) return;
    
    notesList.innerHTML = '';
    if (gameState.notes.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No notes recorded yet.';
        notesList.appendChild(li);
    } else {
        gameState.notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            notesList.appendChild(li);
        });
    }
    
    modal.classList.add('active');
};

window.hideInventory = function() {
    console.log('Hiding inventory...');
    const modal = document.getElementById('inventory-modal');
    if (modal) modal.classList.remove('active');
};

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    
    // Make sure title screen is active on load
    const titleScreen = document.getElementById('title-screen');
    const gameScreen = document.getElementById('game-screen');
    const endingScreen = document.getElementById('ending-screen');
    const inventoryModal = document.getElementById('inventory-modal');
    
    if (titleScreen) titleScreen.classList.add('active');
    if (gameScreen) gameScreen.classList.remove('active');
    if (endingScreen) endingScreen.classList.remove('active');
    if (inventoryModal) inventoryModal.classList.remove('active');
    
    console.log('Game initialized successfully');
});