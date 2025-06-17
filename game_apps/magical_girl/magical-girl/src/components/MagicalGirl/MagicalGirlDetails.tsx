import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Zap, 
  Heart, 
  Shield, 
  Wind, 
  Brain, 
  Sparkles, 
  Target,
  Plus,
  TrendingUp,
  Award
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { MagicalGirl } from '../../types';

interface MagicalGirlDetailsProps {
  girl: MagicalGirl;
}

const statIcons = {
  power: Zap,
  defense: Shield,
  speed: Wind,
  magic: Sparkles,
  wisdom: Brain,
  charm: Heart,
  courage: Award,
  luck: Star,
  endurance: TrendingUp,
  focus: Target
};

const statColors = {
  power: 'text-red-500',
  defense: 'text-blue-500',
  speed: 'text-green-500',
  magic: 'text-purple-500',
  wisdom: 'text-indigo-500',
  charm: 'text-pink-500',
  courage: 'text-orange-500',
  luck: 'text-yellow-500',
  endurance: 'text-teal-500',
  focus: 'text-gray-500'
};

export const MagicalGirlDetails: React.FC<MagicalGirlDetailsProps> = ({ girl }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'abilities' | 'equipment'>('stats');
  const { levelUpMagicalGirl, addNotification } = useGameStore();

  const handleLevelUp = () => {
    const result = levelUpMagicalGirl(girl.id);
    if (result) {
      addNotification({
        type: 'success',
        title: 'Level Up!',
        message: `${girl.name} reached level ${girl.level + 1}!`
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Cannot Level Up',
        message: 'Not enough experience points!'
      });
    }
  };

  const canLevelUp = girl.experience >= girl.experienceToNext;
  const rarityStars = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'].indexOf(girl.rarity) + 1;

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6">
        {/* Avatar */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <span className="text-white text-3xl font-bold">
            {girl.name.charAt(0)}
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-2">{girl.name}</h2>
        
        {/* Element and Level */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            {girl.element}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Level {girl.level}
          </span>
        </div>

        {/* Rarity Stars */}
        <div className="flex justify-center mb-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rarityStars 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Experience and Level Up */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Experience</span>
            <span>{girl.experience}/{girl.experienceToNext}</span>
          </div>
          <div className="stat-bar mb-3">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${(girl.experience / girl.experienceToNext) * 100}%` }}
            />
          </div>
          {canLevelUp && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleLevelUp}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Level Up!
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        {(['stats', 'abilities', 'equipment'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-3">Base Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(girl.stats).map(([statName, value]) => {
                const IconComponent = statIcons[statName as keyof typeof statIcons];
                const colorClass = statColors[statName as keyof typeof statColors];
                
                return (
                  <Card key={statName} className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className={`w-4 h-4 ${colorClass}`} />
                      <span className="font-medium capitalize">{statName}</span>
                    </div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="stat-bar mt-2">
                      <div 
                        className="stat-bar-fill" 
                        style={{ width: `${Math.min((value / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'abilities' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-3">Abilities ({girl.abilities?.length || 0})</h3>
            {girl.abilities && girl.abilities.length > 0 ? (
              <div className="space-y-3">
                {girl.abilities.map((ability) => (
                  <Card key={ability.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{ability.name}</h4>
                      <span className="text-sm text-gray-500">Lv.{ability.level}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ability.description}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {ability.type}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                        {ability.element}
                      </span>
                      {ability.cost.magicalEnergy && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
                          {ability.cost.magicalEnergy} Energy
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No abilities learned yet</p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Learn Abilities
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-3">Equipment</h3>
            {girl.equipment && Object.keys(girl.equipment).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(girl.equipment).map(([slot, item]) => (
                  <Card key={slot} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold capitalize">{slot}</h4>
                        <p className="text-sm text-gray-600">{item.name}</p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Change
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No equipment equipped</p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Equip Items
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
