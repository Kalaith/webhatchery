// Mission Control main view - Clean Architecture with component composition

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Map,
  Users,
  AlertCircle,
  BookOpen,
  Compass,
  Filter
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MissionCard } from '../Mission/MissionCard';
import { MissionStats } from '../Mission/MissionStats';
import { MissionFilters } from '../Mission/MissionFilters';
import { ActiveMission } from '../Mission/ActiveMission';
import { useMissions } from '../../hooks/useMissions';

export const MissionsView: React.FC = () => {  const {
    missionsByType,
    activeMission,
    missionStats,
    availableMagicalGirls,
    filters,
    handleStartMission,
    handleCompleteMission,
    canStartMission,
    setSearchTerm,
    setSelectedType,
    setSelectedDifficulty,
    setSelectedCategory,
    setShowOnlyAvailable,
    setShowCompleted
  } = useMissions();

  const [selectedGirlIds, setSelectedGirlIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleMissionStart = (missionId: string) => {
    if (availableMagicalGirls.length === 0) {
      return;
    }

    // Use selected girls or default to first available
    const teamIds = selectedGirlIds.length > 0 
      ? selectedGirlIds 
      : [availableMagicalGirls[0].id];

    handleStartMission(missionId, teamIds);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
    setShowOnlyAvailable(false);
    setShowCompleted(true);
  };

  // Group missions for display
  const priorityTypes = ['Story', 'Daily', 'Weekly', 'Event'];
  const sortedTypes = Object.keys(missionsByType).sort((a, b) => {
    const aIndex = priorityTypes.indexOf(a);
    const bIndex = priorityTypes.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Map className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
            Mission Control
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 px-4">
          Send your magical girls on exciting missions to protect the world
        </p>
      </div>      {/* Quick Info */}
      {availableMagicalGirls.length === 0 && (
        <Card className="p-3 sm:p-4 border-amber-200 bg-amber-50 mx-2 sm:mx-0">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 text-sm sm:text-base">No Available Magical Girls</h3>
              <p className="text-xs sm:text-sm text-amber-700">
                You need to unlock at least one magical girl to start missions.
              </p>
            </div>
          </div>
        </Card>
      )}      {/* Active Mission */}
      {activeMission && (
        <div className="px-2 sm:px-0">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Compass className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold">Active Mission</h2>
          </div>
          <ActiveMission 
            mission={activeMission}
            onComplete={() => handleCompleteMission(true)}
            onCancel={() => handleCompleteMission(false)}
          />
        </div>
      )}      {/* Team Selection */}
      {availableMagicalGirls.length > 0 && !activeMission && (
        <Card className="p-3 sm:p-4 mx-2 sm:mx-0">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <label className="text-sm font-medium text-gray-700">
                Select Team (optional):
              </label>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableMagicalGirls.map(girl => (
                  <label key={girl.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={selectedGirlIds.includes(girl.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGirlIds(prev => [...prev, girl.id]);
                        } else {
                          setSelectedGirlIds(prev => prev.filter(id => id !== girl.id));
                        }
                      }}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      {girl.name} (Lv.{girl.level})
                    </span>
                  </label>
                ))}
              </div>
              {selectedGirlIds.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  If no team is selected, the first available magical girl will be used.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}      {/* Mission Statistics */}
      <div className="px-2 sm:px-0">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <BookOpen className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg sm:text-xl font-semibold">Mission Progress</h2>
        </div>
        <MissionStats {...missionStats} />
      </div>

      {/* Filters */}
      <div className="px-2 sm:px-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Available Missions</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 min-h-[44px]"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            <span className="sm:hidden">{showFilters ? 'Hide' : 'Filters'}</span>
          </Button>
        </div>
        
        {showFilters && (
          <MissionFilters
            searchTerm={filters.searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={filters.selectedType}
            onTypeChange={setSelectedType}
            selectedDifficulty={filters.selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            selectedCategory={filters.selectedCategory}
            onCategoryChange={setSelectedCategory}
            showOnlyAvailable={filters.showOnlyAvailable}
            onShowOnlyAvailableChange={setShowOnlyAvailable}
            showCompleted={filters.showCompleted}
            onShowCompletedChange={setShowCompleted}
          />
        )}
      </div>      {/* Mission Groups */}
      {sortedTypes.length > 0 ? (
        <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
          {sortedTypes.map((type) => (
            <div key={type}>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-600" />
                {type} Missions ({missionsByType[type].length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {missionsByType[type].map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onStart={handleMissionStart}
                    disabled={!canStartMission(mission.id) || !!activeMission}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-6 sm:p-8 text-center mx-2 sm:mx-0">
          <Map className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No Missions Found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Try adjusting your search criteria or filters.
          </p>
          <Button 
            variant="secondary" 
            onClick={clearAllFilters}
            className="min-h-[44px]"
          >
            Clear All Filters
          </Button>
        </Card>
      )}
    </motion.div>
  );
};
