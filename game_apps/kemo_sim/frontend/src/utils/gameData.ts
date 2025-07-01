import type { KemonomimiType, JobCategory, Stat } from '../types/game';

export const KEMONOMIMI_TYPES: KemonomimiType[] = [
  {
    name: 'Nekomimi',
    animal: 'Cat',
    traits: ['Curious', 'Agile', 'Independent'],
    jobBonuses: { stealth: 20, entertainment: 15, athletic: 10 },
    baseStats: { strength: 40, agility: 70, intelligence: 60, charisma: 55, endurance: 50, loyalty: 45 },
    emoji: '🐱',
  },
  {
    name: 'Inumimi',
    animal: 'Dog',
    traits: ['Loyal', 'Brave', 'Friendly'],
    jobBonuses: { security: 25, athletic: 15, entertainment: 10 },
    baseStats: { strength: 65, agility: 60, intelligence: 55, charisma: 70, endurance: 70, loyalty: 85 },
    emoji: '🐶',
  },
  {
    name: 'Kitsunemimi',
    animal: 'Fox',
    traits: ['Cunning', 'Intelligent', 'Mysterious'],
    jobBonuses: { magical: 30, scholarly: 25, stealth: 15 },
    baseStats: { strength: 45, agility: 65, intelligence: 85, charisma: 60, endurance: 55, loyalty: 40 },
    emoji: '🦊',
  },
  {
    name: 'Usagimimi',
    animal: 'Rabbit',
    traits: ['Quick', 'Cautious', 'Gentle'],
    jobBonuses: { athletic: 20, stealth: 10, entertainment: 15 },
    baseStats: { strength: 35, agility: 80, intelligence: 65, charisma: 50, endurance: 60, loyalty: 60 },
    emoji: '🐰',
  },
  {
    name: 'Ookami',
    animal: 'Wolf',
    traits: ['Strong', 'Pack-oriented', 'Leadership'],
    jobBonuses: { security: 20, physical: 25, leadership: 30 },
    baseStats: { strength: 80, agility: 70, intelligence: 70, charisma: 75, endurance: 75, loyalty: 70 },
    emoji: '🐺',
  },
  {
    name: 'Nezumimi',
    animal: 'Mouse',
    traits: ['Small', 'Sneaky', 'Resourceful'],
    jobBonuses: { stealth: 25, scholarly: 15, infiltration: 30 },
    baseStats: { strength: 25, agility: 75, intelligence: 70, charisma: 40, endurance: 45, loyalty: 55 },
    emoji: '🐭',
  },
];

export const JOB_CATEGORIES: JobCategory[] = [
  {
    name: 'Physical Labor',
    description: 'Construction, farming, mining work',
    requiredStats: ['strength', 'endurance'],
    trainingCost: 100,
    trainingTime: 3,
    salaryMultiplier: 1.5,
  },
  {
    name: 'Athletic Performance',
    description: 'Sports, dancing, acrobatics',
    requiredStats: ['agility', 'endurance'],
    trainingCost: 150,
    trainingTime: 4,
    salaryMultiplier: 2.0,
  },
  {
    name: 'Scholarly Work',
    description: 'Research, teaching, accounting',
    requiredStats: ['intelligence'],
    trainingCost: 200,
    trainingTime: 5,
    salaryMultiplier: 2.5,
  },
  {
    name: 'Entertainment',
    description: 'Singing, acting, hosting',
    requiredStats: ['charisma', 'agility'],
    trainingCost: 175,
    trainingTime: 4,
    salaryMultiplier: 3.0,
  },
  {
    name: 'Security Work',
    description: 'Bodyguard, police, military',
    requiredStats: ['strength', 'loyalty'],
    trainingCost: 125,
    trainingTime: 4,
    salaryMultiplier: 2.2,
  },
  {
    name: 'Stealth Operations',
    description: 'Spy work, investigation',
    requiredStats: ['agility', 'intelligence'],
    trainingCost: 250,
    trainingTime: 6,
    salaryMultiplier: 3.5,
  },
  {
    name: 'Magical Arts',
    description: 'Spellcasting, potion-making',
    requiredStats: ['intelligence', 'charisma'],
    trainingCost: 300,
    trainingTime: 7,
    salaryMultiplier: 4.0,
  },
];

export const HAIR_COLORS = [
  'Black', 'Brown', 'Blonde', 'Red', 'Silver', 'White', 'Blue', 'Purple', 'Pink', 'Green',
];

export const EYE_COLORS = [
  'Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Purple', 'Gold', 'Red', 'Silver',
];

export const PERSONALITY_TRAITS = [
  'Playful', 'Serious', 'Shy', 'Outgoing', 'Calm', 'Energetic', 'Mischievous', 'Gentle', 'Bold', 'Wise',
]; 