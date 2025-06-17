import React from 'react';
import { Zap, Star, Clock, TrendingUp } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { StatDisplay } from '../ui/StatDisplay';

export const ResourceDisplay: React.FC = () => {
  const { player } = useGameStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
      <StatDisplay
        label="Mana"
        value={player.resources.magicalEnergy}
        maxValue={player.resources.maxMagicalEnergy}
        icon={<Star className="w-5 h-5" />}
        color="purple"
        showBar={true}
      />
      
      <StatDisplay
        label="Energy"
        value={player.resources.magicalEnergy}
        maxValue={player.resources.maxMagicalEnergy}
        icon={<Zap className="w-5 h-5" />}
        color="orange"
        showBar={true}
      />
      
      <StatDisplay
        label="Experience"
        value={player.resources.experience}
        icon={<TrendingUp className="w-5 h-5" />}
        color="green"
      />
      
      <StatDisplay
        label="Sparkles"
        value={player.resources.sparkles}
        icon={<Clock className="w-5 h-5" />}
        color="blue"
      />
    </div>
  );
};
