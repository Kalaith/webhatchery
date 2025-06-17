// Game Activities Data - Comprehensive system for all player activities
// Includes training, discovery, facility management, and operations

// Training Activities - Improve Kaiju stats and abilities
export const trainingActivities = [
    { name: 'Combat Drills', category: 'Combat', primary: 'Attack', secondary: 'Special', duration: 2, energy: 30, cost: 500, level: 1, description: 'Basic combat training to improve attack and special abilities' },
    { name: 'Strength Training', category: 'Physical', primary: 'Attack', secondary: 'HP', duration: 3, energy: 40, cost: 750, level: 5, description: 'Heavy conditioning to build raw power and endurance' },
    { name: 'Speed Training', category: 'Physical', primary: 'Speed', secondary: 'Defense', duration: 1, energy: 20, cost: 400, level: 1, description: 'Agility and reflexes training for faster movement' },
    { name: 'Defense Training', category: 'Physical', primary: 'Defense', secondary: 'HP', duration: 2, energy: 35, cost: 600, level: 3, description: 'Defensive techniques and damage resistance training' },
    { name: 'Elemental Mastery', category: 'Special', primary: 'Special', secondary: 'Attack', duration: 4, energy: 50, cost: 1200, level: 10, description: 'Advanced elemental manipulation and control' },
    { name: 'Endurance Training', category: 'Physical', primary: 'HP', secondary: 'Defense', duration: 3, energy: 45, cost: 800, level: 8, description: 'Stamina building and injury resistance' },
    { name: 'Agility Course', category: 'Physical', primary: 'Speed', secondary: 'Attack', duration: 1, energy: 25, cost: 450, level: 3, description: 'Obstacle course for improved mobility and coordination' },
    { name: 'Mental Focus', category: 'Special', primary: 'Special', secondary: 'Defense', duration: 2, energy: 30, cost: 900, level: 15, description: 'Meditation and concentration for enhanced special abilities' },
    { name: 'Team Coordination', category: 'Advanced', primary: 'All', secondary: 'None', duration: 3, energy: 40, cost: 1500, level: 20, description: 'Multi-Kaiju training for synchronized combat' },
    { name: 'Survival Training', category: 'Special', primary: 'HP', secondary: 'Defense', duration: 4, energy: 35, cost: 700, level: 12, description: 'Wilderness survival and adaptation skills' }
];

// Discovery & Capture Activities - Find and acquire new Kaiju
export const discoveryActivities = [
    { name: 'Urban Scouting', category: 'Discovery', location: 'City', rarity: 'Common', duration: 4, cost: 1000, risk: 'Low', successRate: 85, level: 1, description: 'Search metropolitan areas for common Kaiju sightings' },
    { name: 'Forest Expedition', category: 'Discovery', location: 'Forest', rarity: 'Common', duration: 6, cost: 1500, risk: 'Medium', successRate: 70, level: 3, description: 'Explore dense woodlands for nature-type Kaiju' },
    { name: 'Ocean Diving', category: 'Discovery', location: 'Ocean', rarity: 'Uncommon', duration: 8, cost: 3000, risk: 'High', successRate: 60, level: 8, description: 'Deep sea exploration for aquatic Kaiju species' },
    { name: 'Mountain Climbing', category: 'Discovery', location: 'Mountains', rarity: 'Uncommon', duration: 10, cost: 2500, risk: 'High', successRate: 55, level: 10, description: 'Scale treacherous peaks to find rare mountain dwellers' },
    { name: 'Desert Expedition', category: 'Discovery', location: 'Desert', rarity: 'Rare', duration: 12, cost: 4000, risk: 'Extreme', successRate: 40, level: 15, description: 'Survive harsh desert conditions to locate fire-type Kaiju' },
    { name: 'Volcanic Survey', category: 'Discovery', location: 'Volcano', rarity: 'Rare', duration: 8, cost: 5000, risk: 'Extreme', successRate: 35, level: 18, description: 'Dangerous volcanic exploration for legendary fire Kaiju' },
    { name: 'Arctic Research', category: 'Discovery', location: 'Arctic', rarity: 'Rare', duration: 14, cost: 6000, risk: 'Extreme', successRate: 30, level: 20, description: 'Frozen wasteland expedition for ice-type Kaiju' },
    { name: 'Anomaly Investigation', category: 'Discovery', location: 'Anomaly', rarity: 'Legendary', duration: 16, cost: 10000, risk: 'Lethal', successRate: 15, level: 25, description: 'Investigate mysterious energy signatures for legendary Kaiju' }
];

// Facility Management Activities - Expand and upgrade your lab
export const facilityActivities = [
    { name: 'Research Lab Upgrade', category: 'Facility', type: 'Lab', tier: 1, cost: 5000, duration: 24, benefit: 'Unlock advanced breeding options', level: 5, description: 'Expand research capabilities with new equipment' },
    { name: 'Training Facility', category: 'Facility', type: 'Training', tier: 1, cost: 8000, duration: 36, benefit: '+20% training efficiency', level: 8, description: 'Build dedicated training grounds for Kaiju' },
    { name: 'Medical Bay', category: 'Facility', type: 'Medical', tier: 1, cost: 6000, duration: 18, benefit: 'Faster injury recovery', level: 10, description: 'Advanced medical facility for Kaiju healthcare' },
    { name: 'Containment Upgrade', category: 'Facility', type: 'Housing', tier: 1, cost: 4000, duration: 12, benefit: '+5 Kaiju capacity', level: 3, description: 'Expand Kaiju housing capacity' },
    { name: 'Combat Arena', category: 'Facility', type: 'Arena', tier: 1, cost: 15000, duration: 48, benefit: 'Enable combat training', level: 15, description: 'Professional arena for combat practice and tournaments' },
    { name: 'Advanced Lab', category: 'Facility', type: 'Lab', tier: 2, cost: 20000, duration: 72, benefit: 'Genetic manipulation unlock', level: 20, description: 'State-of-the-art genetic research facility' },
    { name: 'Hydroponics Bay', category: 'Facility', type: 'Support', tier: 1, cost: 7000, duration: 24, benefit: 'Reduced feeding costs', level: 12, description: 'Sustainable food production for Kaiju' },
    { name: 'Energy Plant', category: 'Facility', type: 'Power', tier: 1, cost: 12000, duration: 60, benefit: 'Reduced facility energy costs', level: 18, description: 'Independent power generation facility' }
];

// Security & Staff Activities - Protect your facility and hire personnel
export const securityActivities = [
    { name: 'Basic Security System', category: 'Security', type: 'Technology', cost: 3000, duration: 12, benefit: 'Prevents basic intrusions', level: 1, description: 'Install cameras and motion sensors' },
    { name: 'Hire Security Guard', category: 'Staff', type: 'Security', cost: 2000, monthlyCost: 1500, benefit: '24/7 human security presence', level: 5, description: 'Professional security personnel' },
    { name: 'Containment Protocol', category: 'Security', type: 'Procedure', cost: 5000, duration: 8, benefit: 'Prevent Kaiju escapes', level: 8, description: 'Emergency containment procedures and equipment' },
    { name: 'Hire Veterinarian', category: 'Staff', type: 'Medical', cost: 8000, monthlyCost: 4000, benefit: 'Improved Kaiju health management', level: 10, description: 'Specialized Kaiju medical care' },
    { name: 'Advanced Security', category: 'Security', type: 'Technology', cost: 10000, duration: 24, benefit: 'Military-grade protection', level: 15, description: 'Laser grids and automated defenses' },
    { name: 'Hire Researcher', category: 'Staff', type: 'Research', cost: 12000, monthlyCost: 6000, benefit: '+15% research speed', level: 12, description: 'PhD-level genetic researcher' },
    { name: 'Emergency Response Team', category: 'Staff', type: 'Emergency', cost: 15000, monthlyCost: 8000, benefit: 'Rapid incident response', level: 18, description: 'Specialized Kaiju incident response team' },
    { name: 'Hire Trainer', category: 'Staff', type: 'Training', cost: 6000, monthlyCost: 3000, benefit: '+10% training effectiveness', level: 8, description: 'Professional Kaiju training specialist' },
    { name: 'Biometric Security', category: 'Security', type: 'Technology', cost: 20000, duration: 36, benefit: 'Unbreachable access control', level: 22, description: 'DNA and retinal scanning security system' },
    { name: 'Hire Director', category: 'Staff', type: 'Management', cost: 25000, monthlyCost: 12000, benefit: '+20% all facility efficiency', level: 25, description: 'Executive facility management' }
];

// All activities combined for easy access
export const allActivities = {
    training: trainingActivities,
    discovery: discoveryActivities,
    facility: facilityActivities,
    security: securityActivities
};

// Legacy export for backward compatibility
export const trainingData = trainingActivities;
