import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Heart, Shield } from 'lucide-react';
import type { MagicalGirl } from '../../types';

interface MagicalGirlCardProps {
  girl: MagicalGirl;
  onClick: () => void;
}

const rarityColors = {
  Common: 'border-gray-300 bg-gray-50',
  Uncommon: 'border-green-300 bg-green-50',
  Rare: 'border-blue-300 bg-blue-50',
  Epic: 'border-purple-300 bg-purple-50',
  Legendary: 'border-yellow-300 bg-yellow-50',
  Mythical: 'border-pink-300 bg-pink-50'
};

const elementColors = {
  Light: 'text-yellow-600',
  Darkness: 'text-purple-800',
  Fire: 'text-red-600',
  Water: 'text-blue-600',
  Earth: 'text-green-600',
  Air: 'text-gray-600',
  Ice: 'text-cyan-600',
  Lightning: 'text-yellow-500',
  Nature: 'text-green-500',
  Celestial: 'text-indigo-600',
  Void: 'text-gray-800',
  Crystal: 'text-pink-600'
};

export const MagicalGirlCard: React.FC<MagicalGirlCardProps> = ({ girl, onClick }) => {
  const rarityStars = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'].indexOf(girl.rarity) + 1;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`magical-girl-card cursor-pointer p-4 rounded-xl border-2 ${rarityColors[girl.rarity]} hover:shadow-xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="text-center mb-3">
        <h3 className="font-bold text-lg truncate">{girl.name}</h3>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className={`font-medium ${elementColors[girl.element]}`}>
            {girl.element}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">Level {girl.level}</span>
        </div>
      </div>

      {/* Rarity Stars */}
      <div className="flex justify-center mb-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rarityStars 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Avatar Placeholder */}
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">
          {girl.name.charAt(0)}
        </span>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-red-500" />
          <span className="text-gray-600">Power:</span>
          <span className="font-semibold">{girl.stats.power}</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-blue-500" />
          <span className="text-gray-600">Defense:</span>
          <span className="font-semibold">{girl.stats.defense}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-500" />
          <span className="text-gray-600">Magic:</span>
          <span className="font-semibold">{girl.stats.magic}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-purple-500" />
          <span className="text-gray-600">Charm:</span>
          <span className="font-semibold">{girl.stats.charm}</span>
        </div>
      </div>

      {/* Experience Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>EXP</span>
          <span>{girl.experience}/{girl.experienceToNext}</span>
        </div>
        <div className="stat-bar">
          <div 
            className="stat-bar-fill" 
            style={{ width: `${(girl.experience / girl.experienceToNext) * 100}%` }}
          />
        </div>
      </div>

      {/* Abilities Count */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-600">
          {girl.abilities?.length || 0} Abilities • {girl.specialization || 'No Specialization'}
        </div>
      </div>
    </motion.div>
  );
};
