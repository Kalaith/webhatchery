// Achievement filters component - Single Responsibility Principle
import React from 'react';
import { Search, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { AchievementFilters as AchievementFiltersType } from '../../types/achievements';
import { achievementCategories, achievementRarities } from '../../data/achievements';

interface AchievementFiltersProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  selectedCategory: AchievementFiltersType['category'];
  onCategoryChange: (category: AchievementFiltersType['category']) => void;
  selectedRarity: AchievementFiltersType['rarity'];
  onRarityChange: (rarity: AchievementFiltersType['rarity']) => void;
  selectedStatus: AchievementFiltersType['status'];
  onStatusChange: (status: AchievementFiltersType['status']) => void;
  showHidden: boolean;
  onShowHiddenChange: (showHidden: boolean) => void;
  onClearFilters: () => void;
}

export const AchievementFilters: React.FC<AchievementFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedRarity,
  onRarityChange,
  selectedStatus,
  onStatusChange,
  showHidden,
  onShowHiddenChange,
  onClearFilters
}) => {
  const hasActiveFilters = 
    searchTerm.length > 0 || 
    selectedCategory !== 'all' || 
    selectedRarity !== 'all' || 
    selectedStatus !== 'all' ||
    showHidden;

  return (
    <Card className="p-4">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search achievements..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as AchievementFiltersType['category'])}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {Object.entries(achievementCategories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rarity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rarity
          </label>          <select
            value={selectedRarity}
            onChange={(e) => onRarityChange(e.target.value as AchievementFiltersType['rarity'])}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Rarities</option>
            {Object.entries(achievementRarities).map(([key, rarity]) => (
              <option key={key} value={key}>
                {rarity.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as AchievementFiltersType['status'])}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="unlocked">Unlocked</option>
            <option value="in-progress">In Progress</option>
            <option value="locked">Locked</option>
          </select>
        </div>

        {/* Additional Options */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => onShowHiddenChange(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            Show Hidden
          </label>
          
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              Search: "{searchTerm}"
              <button 
                onClick={() => onSearchChange('')}
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Category: {achievementCategories[selectedCategory as keyof typeof achievementCategories]?.name}
              <button 
                onClick={() => onCategoryChange('all')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {selectedRarity !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              Rarity: {achievementRarities[selectedRarity as keyof typeof achievementRarities]?.name}
              <button 
                onClick={() => onRarityChange('all')}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
              Status: {selectedStatus}
              <button 
                onClick={() => onStatusChange('all')}
                className="hover:bg-orange-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {showHidden && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              Show Hidden
              <button 
                onClick={() => onShowHiddenChange(false)}
                className="hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
