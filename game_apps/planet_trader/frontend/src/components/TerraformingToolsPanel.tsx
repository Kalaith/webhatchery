import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import type { Tool } from '../types/entities';

interface ToolCategoryProps {
  label: string;
  tools: Tool[];
  useTool: (tool: Tool) => void; // Keep for now but won't be used
  isToolLocked: (tool: Tool) => boolean; // Keep for now but won't be used
}

const ToolCategory: React.FC<ToolCategoryProps> = ({ label, tools }) => (
  <div className="mb-4">
    <h4 className="text-sm font-semibold text-gray-200 mb-2 border-b border-gray-700 pb-1">{label}</h4>
    <div className="space-y-2">
      {tools.map(tool => (
        <ToolButton key={tool.id} tool={tool} useTool={() => {}} isToolLocked={() => false} />
      ))}
    </div>
  </div>
);

interface ToolButtonProps {
  tool: Tool;
  useTool: (tool: Tool) => void;
  isToolLocked: (tool: Tool) => boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ tool }) => {
  const { credits, currentPlanet, useTool: useToolFromContext, isToolLocked: isLockedFromContext, doResearch } = useGameContext();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const locked = isLockedFromContext(tool);
  const canAfford = credits >= tool.cost;
  const hasSelectedPlanet = currentPlanet !== null;
  const canUse = !locked && canAfford && hasSelectedPlanet;
  const researchCost = (tool.tier || 1) * 500;
  const canResearch = locked && credits >= researchCost;

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const getMainEffect = () => {
    if (!tool.effect) return null;
    const [stat, value] = Object.entries(tool.effect)[0];
    return { stat, value };
  };

  const getActionButton = () => {
    if (locked) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canResearch) doResearch(tool.id, researchCost);
          }}
          disabled={!canResearch}
          className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 ${
            canResearch
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canResearch ? `🔬 ${researchCost}₵` : '🔒 Locked'}
        </button>
      );
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (canUse) useToolFromContext(tool);
        }}
        disabled={!canUse}
        className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 ${
          canUse
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {!hasSelectedPlanet ? '🪐' : !canAfford ? '💸' : `🔧 ${tool.cost}₵`}
      </button>
    );
  };

  const mainEffect = getMainEffect();

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
      {/* Compact View - Always Visible */}
      <div 
        className="p-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white text-sm">{tool.name}</span>
              {locked && <span className="text-red-400 text-xs">🔒</span>}
            </div>
            {mainEffect && (
              <div className="text-xs text-gray-300">
                <span className="text-blue-400 capitalize">{mainEffect.stat}:</span>
                <span className={mainEffect.value > 0 ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                  {mainEffect.value > 0 ? '+' : ''}{mainEffect.value}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getActionButton()}
            <span className={`transform transition-transform duration-200 text-gray-400 text-xs ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Details - Only when expanded */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-600">
          <div className="pt-3 space-y-3">
            {/* Description */}
            <div className="text-xs text-gray-300 bg-gray-700 rounded p-2">
              {tool.description}
            </div>

            {/* All Effects */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-200">Effects:</div>
              <div className="grid grid-cols-1 gap-1">
                {tool.effect && Object.entries(tool.effect).map(([stat, value]) => (
                  <div key={stat} className="text-xs flex justify-between bg-gray-700 rounded px-2 py-1">
                    <span className="text-blue-400 capitalize">{stat}:</span>
                    <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                      {value > 0 ? '+' : ''}{value}
                    </span>
                  </div>
                ))}
                {tool.sideEffects && Object.entries(tool.sideEffects).map(([stat, value]) => (
                  <div key={stat} className="text-xs flex justify-between bg-gray-700 rounded px-2 py-1">
                    <span className="text-gray-400 capitalize">{stat} (side):</span>
                    <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                      {value > 0 ? '+' : ''}{value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost and Tier Info */}
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Cost: <span className="text-green-400">{tool.cost}₵</span></span>
              {tool.tier && <span className="text-gray-400">Tier: <span className="text-blue-400">{tool.tier}</span></span>}
            </div>

            {/* Status Messages */}
            {!canUse && !locked && (
              <div className="text-xs text-yellow-400 bg-yellow-900/20 rounded p-2">
                {!hasSelectedPlanet ? '⚠️ Select a planet first' : '⚠️ Insufficient credits'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const categories = [
  { label: '🌡️ Temperature', id: 'temperature' },
  { label: '🌫️ Atmosphere', id: 'atmosphere' },
  { label: '💧 Water', id: 'water' },
  { label: '⚖️ Gravity', id: 'gravity' },
  { label: '☢️ Radiation', id: 'radiation' },
  { label: '🏗️ Infrastructure', id: 'infrastructure' },
];

const TerraformingToolsPanel: React.FC = () => {
  const { gameData, credits, currentPlanet } = useGameContext();

  return (
    <aside className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="p-3 sm:p-6">
        <div className="border-b border-gray-700 pb-2 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-blue-400">🔧 Terraforming Tools</h3>
          <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-2">
            <span>Credits: {credits.toLocaleString()}₵</span>
            {currentPlanet ? (
              <span className="text-green-400">🪐 {currentPlanet.name}</span>
            ) : (
              <span className="text-yellow-400">⚠️ Select planet</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Tap tool to expand details</p>
        </div>
        <div className="max-h-64 sm:max-h-96 overflow-y-auto scrollbar-custom pr-1 space-y-3">
          {categories.map(cat => {
            const categoryTools = gameData.terraformingTools.filter(tool => tool.category === cat.id);
            // Only show categories that have tools
            if (categoryTools.length === 0) return null;
            
            return (
              <ToolCategory
                key={cat.id}
                label={cat.label}
                tools={categoryTools}
                useTool={() => {}} // This will be handled in ToolButton directly
                isToolLocked={() => false} // This will be handled in ToolButton directly
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default TerraformingToolsPanel;
