export interface Adventurer {
  id: string;
  name: string;
  class: string;
  rank: number;
  level: number;
  experience: number;
  experienceToNext: number;
  stats: {
    hp: number;
    attack: number;
    magic: number;
    speed: number;
    defense: number;
  };
  status: 'available' | 'on_quest' | 'injured';
  questsCompleted: number;
  cost: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  reward: number;
  duration: number;
  requirements: {
    minLevel: number;
    preferredClasses: string[];
  };
  assignedAdventurers?: string[];
}