// Mission filters component - Single Responsibility Principle

import React from 'react';
import { Filter, Search, Target, Map } from 'lucide-react';
import { Card } from '../ui/Card';
import type { MissionType, MissionCategory, Difficulty } from '../../types/missions';

interface MissionFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: MissionType | 'all';
  onTypeChange: (type: MissionType | 'all') => void;
  selectedDifficulty: Difficulty | 'all';
  onDifficultyChange: (difficulty: Difficulty | 'all') => void;
  selectedCategory: MissionCategory | 'all';
  onCategoryChange: (category: MissionCategory | 'all') => void;
  showOnlyAvailable: boolean;
  onShowOnlyAvailableChange: (checked: boolean) => void;
  showCompleted: boolean;
  onShowCompletedChange: (checked: boolean) => void;
}

export const MissionFilters: React.FC<MissionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedCategory,
  onCategoryChange,
  showOnlyAvailable,
  onShowOnlyAvailableChange,
  showCompleted,
  onShowCompletedChange
}) => {
  const missionTypes: (MissionType | 'all')[] = [
    'all', 'Story', 'Daily', 'Weekly', 'Event', 'Challenge', 
    'Training', 'Collection', 'Boss', 'Raid', 'Exploration', 'Tutorial'
  ];
  const difficulties: (Difficulty | 'all')[] = [
    'all', 'Tutorial', 'Easy', 'Normal', 'Hard', 'Expert', 'Master', 'Nightmare', 'Impossible'
  ];

  const categories: (MissionCategory | 'all')[] = [
    'all', 'Combat', 'Rescue', 'Investigation', 'Protection', 
    'Collection', 'Social', 'Stealth', 'Puzzle', 'Escort', 'Survival', 'Training'
  ];

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search missions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as MissionType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {missionTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as MissionCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => onShowOnlyAvailableChange(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Available only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => onShowCompletedChange(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Show completed</span>
          </label>
        </div>
      </div>
    </Card>
  );
};
