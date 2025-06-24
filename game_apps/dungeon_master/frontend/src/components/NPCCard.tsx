import React from 'react';
import type { NPC } from './NPCList';

interface NPCCardProps {
  npc: NPC;
  onSelect: (id: string) => void;
  selected: boolean;
}

const moodColor = (mood: number) =>
  mood >= 70 ? 'bg-emerald-600' : mood >= 40 ? 'bg-yellow-500' : 'bg-red-600';

const portraitColor = (cls: string) => {
  switch (cls) {
    case 'fighter': return 'bg-[#B4413C]';
    case 'wizard': return 'bg-[#1FB8CD]';
    case 'rogue': return 'bg-[#964325]';
    case 'cleric': return 'bg-[#5D878F]';
    case 'archer': return 'bg-[#944454]';
    default: return 'bg-gray-400';
  }
};

const NPCCard: React.FC<NPCCardProps> = ({ npc, onSelect, selected }) => (
  <div
    className={`flex items-center gap-3 p-3 border rounded-lg bg-white cursor-pointer transition-all duration-150 ${selected ? 'border-primary bg-gray-100' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary`}
    onClick={() => onSelect(npc.id)}
    tabIndex={0}
    role="button"
    aria-label={`Select ${npc.name}`}
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${portraitColor(npc.portraitClass)}`}>{npc.name.charAt(0)}</div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-gray-900 text-base mb-1">{npc.name}</h4>
      <p className="text-sm text-gray-500 mb-2">{npc.class} • {npc.personality}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-200 ${moodColor(npc.mood)}`} style={{ width: `${npc.mood}%` }}></div>
        </div>
        <span className="text-xs text-gray-500 font-medium min-w-[30px]">{npc.mood}</span>
      </div>
    </div>
  </div>
);

export default NPCCard;
