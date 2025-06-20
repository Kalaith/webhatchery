// Training filters component - Single Responsibility Principle

import React from 'react';
import { Filter, Search, Target, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import type { TrainingType, TrainingDifficulty, TrainingCategory } from '../../types/training';

interface TrainingFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: TrainingType | 'all';
  onTypeChange: (type: TrainingType | 'all') => void;
  selectedDifficulty: TrainingDifficulty | 'all';
  onDifficultyChange: (difficulty: TrainingDifficulty | 'all') => void;
  selectedCategory: TrainingCategory | 'all';
  onCategoryChange: (category: TrainingCategory | 'all') => void;
  showOnlyUnlocked: boolean;
  onShowOnlyUnlockedChange: (checked: boolean) => void;
}

export const TrainingFilters: React.FC<TrainingFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedCategory,
  onCategoryChange,
  showOnlyUnlocked,
  onShowOnlyUnlockedChange
}) => {
  const trainingTypes: (TrainingType | 'all')[] = [
    'all', 'Basic', 'Combat', 'Magic', 'Physical', 'Mental', 
    'Spiritual', 'Elemental', 'Team', 'Special', 'Advanced'
  ];
  const difficulties: (TrainingDifficulty | 'all')[] = [
    'all', 'Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Legendary'
  ];

  const categories: (TrainingCategory | 'all')[] = [
    'all', 'Stat_Boost', 'Skill_Development', 'Ability_Training', 
    'Endurance', 'Focus', 'Transformation', 'Combat_Technique', 
    'Magic_Control', 'Team_Coordination', 'Leadership'
  ];

  const formatCategoryName = (category: string): string => {
    return category.replace(/_/g, ' ');
  };
  return (
    <Card className="p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search training sessions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Type Filter */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              <label className="text-xs sm:text-sm font-medium text-gray-700">Type</label>
            </div>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as TrainingType | 'all')}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-sm sm:text-base"
            >
              {trainingTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <label className="text-xs sm:text-sm font-medium text-gray-700">Difficulty</label>
            </div>
            <select
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value as TrainingDifficulty | 'all')}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-sm sm:text-base"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <label className="text-xs sm:text-sm font-medium text-gray-700">Category</label>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as TrainingCategory | 'all')}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-sm sm:text-base"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Show Only Unlocked */}
          <div className="flex items-center justify-center sm:justify-start">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 min-h-[44px]">
              <input
                type="checkbox"
                checked={showOnlyUnlocked}
                onChange={(e) => onShowOnlyUnlockedChange(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Available only</span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
};
