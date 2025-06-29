import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';

const AlienMarketPanel: React.FC = () => {
  const { alienBuyers, currentPlanet, sellPlanet } = useGameContext();
  const [expandedAlien, setExpandedAlien] = useState<number | null>(null);

  const toggleAlienDetails = (alienId: number) => {
    setExpandedAlien(expandedAlien === alienId ? null : alienId);
  };

  const calculateCompatibility = (buyer: any) => {
    const defaultMatches = {
      temperature: false,
      atmosphere: false,
      water: false,
      gravity: false,
      radiation: false
    };
    
    if (!currentPlanet) return { compatibility: 0, canSell: false, price: buyer.currentPrice, matches: defaultMatches };
    
    let score = 0;
    const matches = {
      temperature: currentPlanet.temperature >= (buyer.tempRange?.[0] || 0) && currentPlanet.temperature <= (buyer.tempRange?.[1] || 0),
      atmosphere: currentPlanet.atmosphere >= (buyer.atmoRange?.[0] || 0) && currentPlanet.atmosphere <= (buyer.atmoRange?.[1] || 0),
      water: currentPlanet.water >= (buyer.waterRange?.[0] || 0) && currentPlanet.water <= (buyer.waterRange?.[1] || 0),
      gravity: currentPlanet.gravity >= (buyer.gravRange?.[0] || 0) && currentPlanet.gravity <= (buyer.gravRange?.[1] || 0),
      radiation: currentPlanet.radiation >= (buyer.radRange?.[0] || 0) && currentPlanet.radiation <= (buyer.radRange?.[1] || 0)
    };
    
    score = Object.values(matches).filter(Boolean).length;
    
    const compatibility = score / 5;
    let price = buyer.currentPrice;
    if (compatibility >= 0.8) price = Math.floor(price * 1.2);
    const canSell = compatibility >= 0.6;
    
    return { compatibility, canSell, price, matches };
  };

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 0.8) return 'text-green-400';
    if (compatibility >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <aside className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="p-3 sm:p-6">
        <div className="border-b border-gray-700 pb-3 sm:pb-4 mb-3 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-blue-400">👽 Alien Market</h3>
          <p className="text-xs text-gray-400 mt-1">Tap on a buyer to see details</p>
        </div>
        <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
          {alienBuyers.map(buyer => {
            const { compatibility, canSell, price, matches } = calculateCompatibility(buyer);
            const isExpanded = expandedAlien === buyer.id;
            
            return (
              <div key={buyer.id} className="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
                {/* Compact View - Always Visible */}
                <div 
                  className="p-3 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => toggleAlienDetails(buyer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{buyer.name}</span>
                        {currentPlanet && (
                          <span className={`text-xs font-medium ${getCompatibilityColor(compatibility)}`}>
                            {Math.round(compatibility * 100)}%
                          </span>
                        )}
                      </div>
                      {/* Status Icons - Show requirement compatibility */}
                      {currentPlanet && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className={matches.temperature ? 'text-green-400' : 'text-red-400'} title="Temperature">🌡️</span>
                          <span className={matches.atmosphere ? 'text-green-400' : 'text-red-400'} title="Atmosphere">🌫️</span>
                          <span className={matches.water ? 'text-green-400' : 'text-red-400'} title="Water">💧</span>
                          <span className={matches.gravity ? 'text-green-400' : 'text-red-400'} title="Gravity">⚖️</span>
                          <span className={matches.radiation ? 'text-green-400' : 'text-red-400'} title="Radiation">☢️</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {canSell && (
                        <span className="text-green-400 font-bold text-sm">{price.toLocaleString()}₵</span>
                      )}
                      <span className={`transform transition-transform duration-200 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details - Only when expanded */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-gray-600">
                    <div className="pt-3 space-y-3">
                      {/* Alien Description */}
                      <div className="text-gray-300 text-sm leading-relaxed">
                        {buyer.description}
                      </div>

                      {/* Requirements Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`rounded p-2 border ${matches.temperature ? 'bg-green-900/30 border-green-500' : 'bg-gray-600 border-gray-500'}`}>
                          <div className="text-gray-400">Temperature</div>
                          <div className={`flex items-center gap-1 ${matches.temperature ? 'text-green-300' : 'text-white'}`}>
                            <span className={matches.temperature ? 'text-green-400' : 'text-red-400'}>🌡️</span>
                            {buyer.tempRange?.[0] || 0}°C to {buyer.tempRange?.[1] || 0}°C
                          </div>
                        </div>
                        <div className={`rounded p-2 border ${matches.atmosphere ? 'bg-green-900/30 border-green-500' : 'bg-gray-600 border-gray-500'}`}>
                          <div className="text-gray-400">Atmosphere</div>
                          <div className={`flex items-center gap-1 ${matches.atmosphere ? 'text-green-300' : 'text-white'}`}>
                            <span className={matches.atmosphere ? 'text-green-400' : 'text-red-400'}>🌫️</span>
                            {buyer.atmoRange?.[0] || 0}x to {buyer.atmoRange?.[1] || 0}x
                          </div>
                        </div>
                        <div className={`rounded p-2 border ${matches.water ? 'bg-green-900/30 border-green-500' : 'bg-gray-600 border-gray-500'}`}>
                          <div className="text-gray-400">Water</div>
                          <div className={`flex items-center gap-1 ${matches.water ? 'text-green-300' : 'text-white'}`}>
                            <span className={matches.water ? 'text-green-400' : 'text-red-400'}>💧</span>
                            {Math.round((buyer.waterRange?.[0] || 0)*100)}% to {Math.round((buyer.waterRange?.[1] || 0)*100)}%
                          </div>
                        </div>
                        <div className={`rounded p-2 border ${matches.gravity ? 'bg-green-900/30 border-green-500' : 'bg-gray-600 border-gray-500'}`}>
                          <div className="text-gray-400">Gravity</div>
                          <div className={`flex items-center gap-1 ${matches.gravity ? 'text-green-300' : 'text-white'}`}>
                            <span className={matches.gravity ? 'text-green-400' : 'text-red-400'}>⚖️</span>
                            {buyer.gravRange?.[0] || 0}x to {buyer.gravRange?.[1] || 0}x
                          </div>
                        </div>
                        <div className={`rounded p-2 col-span-2 border ${matches.radiation ? 'bg-green-900/30 border-green-500' : 'bg-gray-600 border-gray-500'}`}>
                          <div className="text-gray-400">Radiation</div>
                          <div className={`flex items-center gap-1 ${matches.radiation ? 'text-green-300' : 'text-white'}`}>
                            <span className={matches.radiation ? 'text-green-400' : 'text-red-400'}>☢️</span>
                            {buyer.radRange?.[0] || 0}x to {buyer.radRange?.[1] || 0}x
                          </div>
                        </div>
                      </div>

                      {/* Current Planet Compatibility */}
                      {currentPlanet && (
                        <div className="bg-gray-600 rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-xs">Compatibility with {currentPlanet.name}</span>
                            <span className={`font-bold ${getCompatibilityColor(compatibility)}`}>
                              {Math.round(compatibility * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                compatibility >= 0.8 ? 'bg-green-400' : 
                                compatibility >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${compatibility * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Sell Button */}
                      <button
                        className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          canSell 
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canSell) sellPlanet(buyer);
                        }}
                        disabled={!canSell}
                      >
                        {currentPlanet ? (canSell ? `💰 Sell for ${price.toLocaleString()}₵` : '❌ Incompatible Planet') : '🪐 No Planet Selected'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default AlienMarketPanel;
