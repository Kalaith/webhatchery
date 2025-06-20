import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Filter, Search } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MagicalGirlCard } from '../MagicalGirl/MagicalGirlCard';
import { MagicalGirlDetails } from '../MagicalGirl/MagicalGirlDetails';
import { Modal } from '../ui/Modal';
import type { MagicalGirl, MagicalElement, Rarity } from '../../types';

export const MagicalGirlsView: React.FC = () => {
  const { magicalGirls } = useGameStore();
  const [selectedGirl, setSelectedGirl] = useState<MagicalGirl | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterElement, setFilterElement] = useState<MagicalElement | 'all'>('all');
  const [filterRarity, setFilterRarity] = useState<Rarity | 'all'>('all');

  // Filter magical girls based on search and filters
  const filteredGirls = magicalGirls.filter(girl => {
    const matchesSearch = girl.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesElement = filterElement === 'all' || girl.element === filterElement;
    const matchesRarity = filterRarity === 'all' || girl.rarity === filterRarity;
    return matchesSearch && matchesElement && matchesRarity;
  });

  const elements: MagicalElement[] = ['Light', 'Darkness', 'Fire', 'Water', 'Earth', 'Air', 'Ice', 'Lightning', 'Nature', 'Celestial', 'Void', 'Crystal'];
  const rarities: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 lg:space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-gradient mb-2">
          Your Magical Girls
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          Manage and strengthen your team of magical girls
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="p-3 lg:p-4 text-center">
          <div className="text-lg lg:text-2xl font-bold text-purple-600">{magicalGirls.length}</div>
          <div className="text-xs lg:text-sm text-gray-600">Total Girls</div>        </Card>
        <Card className="p-3 lg:p-4 text-center">
          <div className="text-lg lg:text-2xl font-bold text-orange-600">
            {Math.round(magicalGirls.reduce((sum, girl) => sum + girl.level, 0) / magicalGirls.length || 0)}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Average Level</div>
        </Card>
        <Card className="p-3 lg:p-4 text-center">
          <div className="text-lg lg:text-2xl font-bold text-green-600">
            {magicalGirls.filter(girl => girl.rarity === 'Legendary' || girl.rarity === 'Mythical').length}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Rare Girls</div>
        </Card>
        <Card className="p-3 lg:p-4 text-center">
          <div className="text-lg lg:text-2xl font-bold text-blue-600">
            {new Set(magicalGirls.map(girl => girl.element)).size}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Elements</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-3 lg:p-4">
        <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search magical girls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 lg:py-2 text-base lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-target"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
            {/* Element Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={filterElement}
                onChange={(e) => setFilterElement(e.target.value as MagicalElement | 'all')}
                className="flex-1 sm:flex-none px-3 py-3 lg:py-2 text-base lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 touch-target"
              >
                <option value="all">All Elements</option>
                {elements.map(element => (
                  <option key={element} value={element}>{element}</option>
                ))}
              </select>            </div>

            {/* Rarity Filter */}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value as Rarity | 'all')}
                className="flex-1 sm:flex-none px-3 py-3 lg:py-2 text-base lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 touch-target"
              >
                <option value="all">All Rarities</option>
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add New Button */}
          <Button 
            variant="primary"
            size="md"
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
            onClick={() => {/* TODO: Implement summon/recruit */}}
          >
            <Plus className="w-4 h-4" />
            Summon
          </Button>
        </div>
      </Card>

      {/* Magical Girls Grid */}
      {filteredGirls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGirls.map((girl) => (
            <MagicalGirlCard
              key={girl.id}
              girl={girl}
              onClick={() => setSelectedGirl(girl)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No Magical Girls Found</h3>
          <p className="text-gray-600 mb-4">
            {magicalGirls.length === 0 
              ? "You haven't summoned any magical girls yet!"
              : "Try adjusting your search or filters."
            }
          </p>
          {magicalGirls.length === 0 && (
            <Button variant="primary" className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Summon Your First Magical Girl
            </Button>
          )}
        </Card>
      )}

      {/* Details Modal */}
      {selectedGirl && (
        <Modal 
          isOpen={!!selectedGirl} 
          onClose={() => setSelectedGirl(null)}
          title={selectedGirl.name}
        >          <MagicalGirlDetails 
            girl={selectedGirl} 
          />
        </Modal>
      )}
    </motion.div>
  );
};
