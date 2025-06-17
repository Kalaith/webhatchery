// Combat Simulation Module - Expanded combat system showcase
import { combatPhases, battleModes, tournaments, combatInteractions, arenaEnvironments, combatRankings } from '../data/combat-data.js';

export function initCombatSim() {
    setupCombatTabs();
    initializeCombatPhases();
}

function setupCombatTabs() {
    const tabsContainer = document.querySelector('.combat-tabs-container');
    if (!tabsContainer) {
        // Create tabs container if it doesn't exist
        const mainContent = document.querySelector('.bg-white.p-6.rounded-xl.shadow-lg');
        const tabsHTML = `
            <div class="combat-tabs-container mb-6">
                <div class="flex flex-wrap justify-center gap-2 mb-4">
                    <button class="combat-tab-btn active bg-gray-800 text-white px-4 py-2 rounded" data-tab="phases">Combat Flow</button>
                    <button class="combat-tab-btn bg-gray-200 text-gray-700 px-4 py-2 rounded" data-tab="modes">Battle Modes</button>
                    <button class="combat-tab-btn bg-gray-200 text-gray-700 px-4 py-2 rounded" data-tab="tournaments">Tournaments</button>
                    <button class="combat-tab-btn bg-gray-200 text-gray-700 px-4 py-2 rounded" data-tab="interactions">Interactions</button>
                    <button class="combat-tab-btn bg-gray-200 text-gray-700 px-4 py-2 rounded" data-tab="arenas">Arenas</button>
                </div>
            </div>
        `;
        mainContent.insertAdjacentHTML('afterbegin', tabsHTML);
    }

    // Add event listeners for tabs
    document.querySelectorAll('.combat-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchCombatTab(tab);
            
            // Update button states
            document.querySelectorAll('.combat-tab-btn').forEach(b => {
                b.classList.remove('active', 'bg-gray-800', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
            });
            btn.classList.remove('bg-gray-200', 'text-gray-700');
            btn.classList.add('active', 'bg-gray-800', 'text-white');
        });
    });
}

function switchCombatTab(tab) {
    switch(tab) {
        case 'phases':
            initializeCombatPhases();
            break;
        case 'modes':
            initializeBattleModes();
            break;
        case 'tournaments':
            initializeTournaments();
            break;
        case 'interactions':
            initializeCombatInteractions();
            break;
        case 'arenas':
            initializeArenas();
            break;
    }
}

function initializeCombatPhases() {
    updateCombatContent(`
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Combat Phase Flow</h3>
        <p class="text-gray-700 mb-6">Combat unfolds in a series of phases. Click on each phase to learn more about the factors involved and player influence.</p>
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2" id="combat-phases-container">
            <!-- Combat phases will be injected here -->
        </div>
        <div id="combat-phase-details" class="mt-8 bg-gray-50 p-6 rounded-lg min-h-[150px]">
            <p class="text-gray-600">Click on a phase above to see details.</p>
        </div>
    `);

    const container = document.getElementById('combat-phases-container');
    combatPhases.forEach((phase, index) => {
        const phaseEl = document.createElement('div');
        phaseEl.className = 'combat-phase bg-gray-200 p-4 rounded-lg text-center font-semibold w-full md:w-auto cursor-pointer transition-all hover:bg-gray-300';
        phaseEl.textContent = phase.name;
        phaseEl.dataset.index = index;
        phaseEl.addEventListener('click', () => selectCombatPhase(index));
        container.appendChild(phaseEl);

        if (index < combatPhases.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'text-2xl font-bold text-gray-400 transform md:-rotate-90 p-2';
            arrow.textContent = '➡️';
            container.appendChild(arrow);
        }
    });
    selectCombatPhase(0);
}

function initializeBattleModes() {
    updateCombatContent(`
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Battle Modes & Arena Types</h3>
        <p class="text-gray-700 mb-6">Choose from various combat formats, each with unique rules and rewards.</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${battleModes.map(mode => `
                <div class="bg-gray-50 p-6 rounded-lg border">
                    <div class="flex items-center mb-3">
                        <span class="text-2xl mr-3">${getCategoryIcon(mode.category)}</span>
                        <h4 class="text-xl font-bold text-gray-800">${mode.name}</h4>
                    </div>
                    <p class="text-gray-600 mb-4">${mode.description}</p>
                    <div class="space-y-2 text-sm">
                        <div><strong>Team Size:</strong> ${mode.teamSize}</div>
                        <div><strong>Duration:</strong> ${mode.duration}</div>
                        <div><strong>Entry Fee:</strong> ${mode.requirements.entry_fee} credits</div>
                        <div><strong>Min Level:</strong> ${mode.requirements.level}</div>
                    </div>
                    <div class="mt-4 p-3 bg-green-100 rounded">
                        <div class="text-sm font-medium text-green-800">Rewards:</div>
                        <div class="text-sm text-green-700">
                            ${typeof mode.rewards.credits === 'string' ? mode.rewards.credits : mode.rewards.credits + ' credits'}<br>
                            ${typeof mode.rewards.xp === 'string' ? mode.rewards.xp : mode.rewards.xp + ' XP'}<br>
                            ${typeof mode.rewards.prestige === 'string' ? mode.rewards.prestige : mode.rewards.prestige + ' prestige'}
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-sm font-medium text-gray-700">Special Rules:</div>
                        <ul class="text-xs text-gray-600 list-disc list-inside">
                            ${mode.special_rules.map(rule => `<li>${rule}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>
    `);
}

function initializeTournaments() {
    updateCombatContent(`
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Tournament System</h3>
        <p class="text-gray-700 mb-6">Compete in organized tournaments to earn prestige, rare genetic samples, and massive prize pools.</p>
        <div class="space-y-6">
            ${tournaments.map(tournament => `
                <div class="bg-gradient-to-r ${getTournamentGradient(tournament.tier)} p-6 rounded-lg border-2 ${getTournamentBorder(tournament.tier)}">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h4 class="text-2xl font-bold text-gray-800">${tournament.name}</h4>
                            <span class="inline-block px-3 py-1 bg-white bg-opacity-75 rounded-full text-sm font-medium">${tournament.tier} Tier</span>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold text-gray-800">💰 ${tournament.prize_pool.toLocaleString()} Credits</div>
                            <div class="text-sm text-gray-600">${tournament.participants} participants</div>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <div class="text-sm space-y-1">
                                <div><strong>Level Range:</strong> ${tournament.level_range}</div>
                                <div><strong>Entry Fee:</strong> ${tournament.entry_fee.toLocaleString()} credits</div>
                                <div><strong>Duration:</strong> ${tournament.duration}</div>
                                <div><strong>Format:</strong> ${tournament.format}</div>
                            </div>
                        </div>
                        <div>
                            <div class="text-sm">
                                <div class="font-medium mb-2">Rewards:</div>
                                <div class="space-y-1">
                                    <div>🥇 <strong>Champion:</strong> ${tournament.rewards.champion.credits.toLocaleString()} credits, ${tournament.rewards.champion.prestige} prestige</div>
                                    <div>🥈 <strong>Runner-up:</strong> ${tournament.rewards.runner_up.credits.toLocaleString()} credits, ${tournament.rewards.runner_up.prestige} prestige</div>
                                    <div>🥉 <strong>Semi-finalist:</strong> ${tournament.rewards.semi_finalist.credits.toLocaleString()} credits, ${tournament.rewards.semi_finalist.prestige} prestige</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="mt-8 bg-gray-50 p-6 rounded-lg">
            <h4 class="text-xl font-bold text-gray-800 mb-4">Combat Rankings</h4>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${combatRankings.map(rank => `
                    <div class="bg-white p-4 rounded border">
                        <div class="text-lg font-bold ${getRankColor(rank.rank)}">${rank.rank}</div>
                        <div class="text-sm text-gray-600">${rank.min_prestige.toLocaleString()} - ${rank.max_prestige.toLocaleString()} prestige</div>
                        <div class="text-sm text-gray-700 mt-2">${rank.benefits}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
}

function initializeCombatInteractions() {
    updateCombatContent(`
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Dynamic Combat Interactions</h3>
        <p class="text-gray-700 mb-6">Elemental types interact in unique ways, creating strategic depth and spectacular effects.</p>
        <div class="grid md:grid-cols-2 gap-4">
            ${combatInteractions.map(interaction => `
                <div class="bg-gray-50 p-4 rounded-lg border">
                    <div class="flex items-center mb-3">
                        <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium mr-2">${interaction.attacker}</span>
                        <span class="text-gray-500">vs</span>
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium ml-2">${interaction.defender}</span>
                    </div>
                    <div class="mb-2">
                        <span class="font-bold text-purple-700">${interaction.interaction}</span>
                    </div>
                    <p class="text-sm text-gray-700">${interaction.effect}</p>
                </div>
            `).join('')}
        </div>
    `);
}

function initializeArenas() {
    updateCombatContent(`
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Battle Arenas & Environments</h3>
        <p class="text-gray-700 mb-6">Each arena provides unique advantages, hazards, and tactical considerations.</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${arenaEnvironments.map(arena => `
                <div class="bg-gray-50 p-6 rounded-lg border">
                    <h4 class="text-xl font-bold text-gray-800 mb-3">${arena.name}</h4>
                    <div class="space-y-2 text-sm">
                        <div><strong>Size:</strong> ${arena.size}</div>
                        <div><strong>Terrain:</strong> ${arena.terrain}</div>
                        <div class="text-green-700"><strong>Effects:</strong> ${arena.effects}</div>
                        <div class="text-red-700"><strong>Hazards:</strong> ${arena.hazards}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `);
}

function updateCombatContent(html) {
    const mainContainer = document.querySelector('.bg-white.p-6.rounded-xl.shadow-lg');
    const tabsContainer = mainContainer.querySelector('.combat-tabs-container');
    
    // Clear content after tabs
    const elementsToRemove = Array.from(mainContainer.children).slice(Array.from(mainContainer.children).indexOf(tabsContainer) + 1);
    elementsToRemove.forEach(el => el.remove());
    
    // Add new content
    mainContainer.insertAdjacentHTML('beforeend', html);
}

function selectCombatPhase(index) {
    document.querySelectorAll('.combat-phase').forEach(p => {
        p.classList.remove('active', 'bg-gray-800', 'text-white');
        p.classList.add('bg-gray-200');
    });
    
    const selectedPhase = document.querySelector(`.combat-phase[data-index="${index}"]`);
    if (selectedPhase) {
        selectedPhase.classList.remove('bg-gray-200');
        selectedPhase.classList.add('active', 'bg-gray-800', 'text-white');
    }

    const detailsContainer = document.getElementById('combat-phase-details');
    const phase = combatPhases[index];
    if (detailsContainer && phase) {
        detailsContainer.innerHTML = `
            <h4 class="text-xl font-bold mb-2">${phase.name} Phase</h4>
            <p class="text-gray-700">${phase.details}</p>
        `;
    }
}

// Helper functions
function getCategoryIcon(category) {
    const icons = {
        'Classic': '⚔️',
        'Team': '👥',
        'Endurance': '🏃',
        'Rampage': '💥'
    };
    return icons[category] || '🎯';
}

function getTournamentGradient(tier) {
    const gradients = {
        'Beginner': 'from-green-100 to-green-200',
        'Advanced': 'from-blue-100 to-blue-200',
        'Elite': 'from-purple-100 to-purple-200'
    };
    return gradients[tier] || 'from-gray-100 to-gray-200';
}

function getTournamentBorder(tier) {
    const borders = {
        'Beginner': 'border-green-300',
        'Advanced': 'border-blue-300',
        'Elite': 'border-purple-300'
    };
    return borders[tier] || 'border-gray-300';
}

function getRankColor(rank) {
    const colors = {
        'Bronze': 'text-yellow-600',
        'Silver': 'text-gray-500',
        'Gold': 'text-yellow-500',
        'Platinum': 'text-blue-400',
        'Diamond': 'text-blue-600',
        'Legendary': 'text-purple-600'
    };
    return colors[rank] || 'text-gray-600';
}
