// Combat System Data - Comprehensive battle mechanics and modes

// Core Combat Phases
export const combatPhases = [
    { name: 'Initiative', details: 'Turn order is determined. Factors: Speed stat, random element. Player Influence: None.' },
    { name: 'Action', details: 'Player or AI selects an attack or ability. Factors: Available moves, energy. Player Influence: Full.' },
    { name: 'Resolution', details: 'Damage and effects are calculated. Factors: Attack/Special stats, Defense, Type Effectiveness, Critical Hits. Player Influence: Low.' },
    { name: 'Status', details: 'Status effects like Burn, Poison, Freeze are applied. Factors: Ability effects, resistances. Player Influence: Low.' },
    { name: 'Environment', details: 'Arena effects trigger. Factors: Weather, Terrain, Hazards. Player Influence: None.' }
];

// Battle Modes and Arena Types
export const battleModes = [
    {
        name: '1v1 Duels',
        category: 'Classic',
        description: 'Traditional kaiju showdowns between two competitors',
        teamSize: 1,
        duration: '5-15 minutes',
        rewards: { credits: 1000, xp: 500, prestige: 50 },
        requirements: { level: 1, entry_fee: 200 },
        special_rules: ['Standard type effectiveness', 'No environmental hazards', 'Best of 3 rounds']
    },
    {
        name: 'Team Battles (3v3)',
        category: 'Team',
        description: 'Strategic team combat with kaiju switching and coordination',
        teamSize: 3,
        duration: '15-30 minutes',
        rewards: { credits: 3000, xp: 1200, prestige: 150 },
        requirements: { level: 10, entry_fee: 800 },
        special_rules: ['Switch kaiju between rounds', 'Team synergy bonuses', 'Elimination format']
    },
    {
        name: 'Team Battles (5v5)',
        category: 'Team',
        description: 'Large-scale team warfare with complex tactical options',
        teamSize: 5,
        duration: '25-45 minutes',
        rewards: { credits: 5000, xp: 2000, prestige: 300 },
        requirements: { level: 20, entry_fee: 1500 },
        special_rules: ['Formation tactics', 'Multi-kaiju combos', 'Battlefield control points']
    },
    {
        name: 'Survival Mode',
        category: 'Endurance',
        description: 'Fight endless waves of increasingly powerful opponents',
        teamSize: 1,
        duration: 'Until defeat',
        rewards: { credits: '100 per wave', xp: '50 per wave', prestige: '10 per wave' },
        requirements: { level: 5, entry_fee: 300 },
        special_rules: ['Escalating difficulty', 'Limited healing between waves', 'Bonus rewards every 10 waves']
    },
    {
        name: 'Destruction Mode',
        category: 'Rampage',
        description: 'Demolish city districts for points while fighting military forces',
        teamSize: 1,
        duration: '10-20 minutes',
        rewards: { credits: 2000, xp: 800, prestige: 100 },
        requirements: { level: 15, entry_fee: 1000 },
        special_rules: ['Destruction multipliers', 'Military escalation', 'Civilian evacuation timer']
    }
];

// Tournament System
export const tournaments = [
    {
        name: 'Rookie League',
        tier: 'Beginner',
        level_range: '1-10',
        entry_fee: 500,
        prize_pool: 10000,
        duration: '3 days',
        format: 'Single Elimination',
        participants: 16,
        rewards: {
            champion: { credits: 5000, rare_genetic_sample: 1, prestige: 500 },
            runner_up: { credits: 2500, genetic_sample: 2, prestige: 250 },
            semi_finalist: { credits: 1000, genetic_sample: 1, prestige: 100 }
        }
    },
    {
        name: 'Champion Circuit',
        tier: 'Advanced',
        level_range: '20-40',
        entry_fee: 2000,
        prize_pool: 50000,
        duration: '1 week',
        format: 'Double Elimination',
        participants: 32,
        rewards: {
            champion: { credits: 25000, legendary_genetic_sample: 1, prestige: 2000 },
            runner_up: { credits: 12500, rare_genetic_sample: 2, prestige: 1000 },
            semi_finalist: { credits: 5000, rare_genetic_sample: 1, prestige: 500 }
        }
    },
    {
        name: 'Masters Tournament',
        tier: 'Elite',
        level_range: '40+',
        entry_fee: 5000,
        prize_pool: 150000,
        duration: '2 weeks',
        format: 'Round Robin + Finals',
        participants: 64,
        rewards: {
            champion: { credits: 75000, mythic_genetic_sample: 1, prestige: 5000 },
            runner_up: { credits: 37500, legendary_genetic_sample: 2, prestige: 2500 },
            semi_finalist: { credits: 15000, legendary_genetic_sample: 1, prestige: 1000 }
        }
    }
];

// Dynamic Combat Interactions
export const combatInteractions = [
    {
        attacker: 'Fire',
        defender: 'Water',
        interaction: 'Steam Cloud',
        effect: 'Fire attack creates steam, reducing visibility for 2 turns (-20% accuracy for all combatants)'
    },
    {
        attacker: 'Lightning',
        defender: 'Water',
        interaction: 'Electrified Water',
        effect: 'Lightning damage increased by 50%, water-type defender takes additional shock damage next turn'
    },
    {
        attacker: 'Ice',
        defender: 'Fire',
        interaction: 'Thermal Shock',
        effect: 'Both kaiju take recoil damage, arena temperature becomes unstable (+/- 25% damage variance)'
    },
    {
        attacker: 'Earth',
        defender: 'Lightning',
        interaction: 'Grounding',
        effect: 'Lightning attacks redirected to ground, no damage dealt but arena becomes charged (next lightning attack affects all combatants)'
    },
    {
        attacker: 'Wind',
        defender: 'Fire',
        interaction: 'Inferno',
        effect: 'Fire attacks spread to adjacent targets, damage increased by 25% but attacker loses control for 1 turn'
    },
    {
        attacker: 'Poison',
        defender: 'Plant',
        interaction: 'Toxic Bloom',
        effect: 'Plant-type grows uncontrollably, gains +50% size but becomes vulnerable to all damage types'
    },
    {
        attacker: 'Metal',
        defender: 'Lightning',
        interaction: 'Conductor',
        effect: 'Metal-type becomes a lightning rod, taking double lightning damage but reflecting 25% back to attacker'
    },
    {
        attacker: 'Psychic',
        defender: 'Dark',
        interaction: 'Mental Void',
        effect: 'Psychic abilities become unpredictable, 50% chance to backfire or double in power'
    }
];

// Arena Environments
export const arenaEnvironments = [
    {
        name: 'Standard Arena',
        effects: 'No special modifiers',
        hazards: 'None',
        size: 'Large',
        terrain: 'Flat concrete'
    },
    {
        name: 'Volcanic Crater',
        effects: '+25% Fire damage, -25% Ice damage',
        hazards: 'Lava eruptions every 5 turns',
        size: 'Medium',
        terrain: 'Rocky, elevated platforms'
    },
    {
        name: 'Underwater Dome',
        effects: '+25% Water damage, -50% Fire damage, +10% movement cost',
        hazards: 'Pressure changes affect non-aquatic kaiju',
        size: 'Large',
        terrain: 'Submerged ruins'
    },
    {
        name: 'Electromagnetic Field',
        effects: '+30% Lightning damage, Metal types gain +1 action per turn',
        hazards: 'Random electrical surges',
        size: 'Medium',
        terrain: 'Tech facility'
    },
    {
        name: 'Toxic Wasteland',
        effects: 'All kaiju take poison damage each turn, Poison types immune',
        hazards: 'Acid pools, toxic gas clouds',
        size: 'Large',
        terrain: 'Contaminated industrial zone'
    },
    {
        name: 'Zero Gravity Station',
        effects: 'Flight-capable kaiju gain advantage, ground attacks miss more often',
        hazards: 'Floating debris, equipment malfunctions',
        size: 'Extra Large',
        terrain: 'Space station interior'
    }
];

// Combat Rankings and Leagues
export const combatRankings = [
    { rank: 'Bronze', min_prestige: 0, max_prestige: 999, benefits: 'Basic tournament access' },
    { rank: 'Silver', min_prestige: 1000, max_prestige: 2999, benefits: 'Intermediate tournaments, 10% prize bonus' },
    { rank: 'Gold', min_prestige: 3000, max_prestige: 6999, benefits: 'Advanced tournaments, 25% prize bonus, special arenas' },
    { rank: 'Platinum', min_prestige: 7000, max_prestige: 14999, benefits: 'Elite tournaments, 50% prize bonus, exclusive genetic samples' },
    { rank: 'Diamond', min_prestige: 15000, max_prestige: 29999, benefits: 'Master tournaments, 75% prize bonus, legendary rewards' },
    { rank: 'Legendary', min_prestige: 30000, max_prestige: 999999, benefits: 'All content, 100% prize bonus, mythic rewards, special titles' }
];
