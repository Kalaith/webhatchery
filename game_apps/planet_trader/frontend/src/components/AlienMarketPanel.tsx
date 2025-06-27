
import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import RequirementGrid from './RequirementGrid';
import RequirementStatusCell from './RequirementStatusCell';
import { TOOL_CATEGORIES } from '../types/entities';

const AlienMarketPanel: React.FC = () => {
  const { alienBuyers, currentPlanet, sellPlanet } = useGameContext();
  const [expandedAlien, setExpandedAlien] = useState<number | null>(null);

  const toggleAlienDetails = (alienId: number) => {
    setExpandedAlien(expandedAlien === alienId ? null : alienId);
  };

  const calculateCompatibility = (buyer: any) => {
    if (!currentPlanet) return { compatibility: 0, canSell: false, price: buyer.currentPrice };
    
    let score = 0;
    if (currentPlanet.temperature >= (buyer.tempRange?.[0] || 0) && currentPlanet.temperature <= (buyer.tempRange?.[1] || 0)) score += 1;
    if (currentPlanet.atmosphere >= (buyer.atmoRange?.[0] || 0) && currentPlanet.atmosphere <= (buyer.atmoRange?.[1] || 0)) score += 1;
    if (currentPlanet.water >= (buyer.waterRange?.[0] || 0) && currentPlanet.water <= (buyer.waterRange?.[1] || 0)) score += 1;
    if (currentPlanet.gravity >= (buyer.gravRange?.[0] || 0) && currentPlanet.gravity <= (buyer.gravRange?.[1] || 0)) score += 1;
    if (currentPlanet.radiation >= (buyer.radRange?.[0] || 0) && currentPlanet.radiation <= (buyer.radRange?.[1] || 0)) score += 1;
    
    const compatibility = score / 5;
    
    // Calculate price based on compatibility percentage
    // Perfect fit (100%) should sell for 4,000-6,000₵
    // Base price starts at buyer's current price and scales up significantly with compatibility
    let price = buyer.currentPrice;
    
    if (compatibility >= 1.0) {
      // Perfect fit: 4,000-6,000₵ range
      price = Math.floor(4000 + Math.random() * 2000);
    } else if (compatibility >= 0.8) {
      // Very good fit: 2,500-4,000₵ range
      price = Math.floor(2500 + (compatibility - 0.8) * 0.2 * 7500 + Math.random() * 500);
    } else if (compatibility >= 0.6) {
      // Good fit: 1,500-2,500₵ range
      price = Math.floor(1500 + (compatibility - 0.6) * 0.2 * 5000 + Math.random() * 300);
    } else {
      // Poor fit: base price with small bonus
      price = Math.floor(buyer.currentPrice * (1 + compatibility * 0.5));
    }
    
    const canSell = compatibility >= 0.6;
    
    return { compatibility, canSell, price };
  };

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 0.8) return 'text-green-400';
    if (compatibility >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCardStyle = (compatibility: number, canSell: boolean) => {
    if (!currentPlanet) return 'bg-gray-700 border-gray-600';
    if (canSell) return 'bg-green-900/30 border-green-600/50';
    if (compatibility >= 0.4) return 'bg-yellow-900/20 border-yellow-600/30';
    return 'bg-red-900/20 border-red-600/30';
  };

  const getHoverStyle = (compatibility: number, canSell: boolean) => {
    if (!currentPlanet) return 'hover:bg-gray-600';
    if (canSell) return 'hover:bg-green-900/50';
    if (compatibility >= 0.4) return 'hover:bg-yellow-900/30';
    return 'hover:bg-red-900/30';
  };



  return (
    <aside className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="p-3 sm:p-6">
        <div className="border-b border-gray-700 pb-3 sm:pb-4 mb-3 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-blue-400">👽 Alien Market</h3>
          <div className="text-xs text-gray-400 mt-1">
            {currentPlanet ? (
              <div>Planet: <span className="text-green-400">{currentPlanet.name}</span></div>
            ) : (
              <div>Select a planet to see buyer compatibility</div>
            )}
          </div>
        </div>
        <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto scrollbar-custom pr-1">
          {alienBuyers.map(buyer => {
            const { compatibility, canSell, price } = calculateCompatibility(buyer);
            const isExpanded = expandedAlien === buyer.id;
            
            return (
              <div key={buyer.id} className={`${getCardStyle(compatibility, canSell)} border rounded-lg overflow-hidden transition-all duration-200`}>
                {/* Compact View - Always Visible */}
                <div 
                  className={`p-3 cursor-pointer ${getHoverStyle(compatibility, canSell)} transition-colors duration-200`}
                  onClick={() => toggleAlienDetails(buyer.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-white text-sm">{buyer.name}</span>
                        {currentPlanet && (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            canSell ? 'bg-green-900/50 text-green-300' : 
                            compatibility >= 0.4 ? 'bg-yellow-900/50 text-yellow-300' : 
                            'bg-red-900/50 text-red-300'
                          }`}>
                            {Math.round(compatibility * 100)}%
                          </span>
                        )}
                      </div>
                      {/* Requirement Icons Row */}
                      {currentPlanet && (
                        <div className="ml-0">
                          <div className="inline-block border border-gray-600 rounded bg-gray-700/50">
                            <table className="text-sm">
                              <tr>
                                {TOOL_CATEGORIES.map(cat => (
                                  <td
                                    key={cat.id}
                                    className={`px-2 py-1 text-center ${cat.colorClass || ''}`}
                                  >
                                    {cat.icon}
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                {TOOL_CATEGORIES.map((cat) => (
                                  <RequirementStatusCell key={cat.id} buyer={buyer} currentPlanet={currentPlanet} categoryId={cat.id} />
                                ))}
                              </tr>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      {canSell && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sellPlanet(buyer);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded transition-colors duration-200"
                        >
                          💰 Sell {price.toLocaleString()}₵
                        </button>
                      )}
                      {!canSell && currentPlanet && (
                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                          {compatibility >= 0.4 ? 'Partial match' : 'Incompatible'}
                        </span>
                      )}
                      {!currentPlanet && (
                        <span className="text-gray-500 text-xs">Select planet</span>
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
                      {/* Buyer Description */}
                      <div className="text-sm text-gray-300 bg-gray-700/50 rounded p-2">
                        {buyer.description}
                      </div>

                      {/* Requirements Grid with Met/Unmet Status */}
                      <RequirementGrid buyer={buyer} currentPlanet={currentPlanet} />

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

                      {/* Improvement Suggestions - Only show if not sellable but planet selected */}
                      {!canSell && currentPlanet && (
                        <div className="bg-blue-900/20 border border-blue-600/30 rounded p-3">
                          <div className="text-xs font-semibold text-blue-400 mb-2">🔧 Terraform to improve compatibility:</div>
                          <div className="space-y-1 text-xs">
                            {currentPlanet.temperature < (buyer.tempRange?.[0] || 0) && (
                              <div className="text-orange-400">• Increase temperature by {((buyer.tempRange?.[0] || 0) - currentPlanet.temperature).toFixed(1)}°C</div>
                            )}
                            {currentPlanet.temperature > (buyer.tempRange?.[1] || 0) && (
                              <div className="text-blue-400">• Decrease temperature by {(currentPlanet.temperature - (buyer.tempRange?.[1] || 0)).toFixed(1)}°C</div>
                            )}
                            {currentPlanet.atmosphere < (buyer.atmoRange?.[0] || 0) && (
                              <div className="text-green-400">• Increase atmosphere by {((buyer.atmoRange?.[0] || 0) - currentPlanet.atmosphere).toFixed(2)}x</div>
                            )}
                            {currentPlanet.atmosphere > (buyer.atmoRange?.[1] || 0) && (
                              <div className="text-red-400">• Decrease atmosphere by {(currentPlanet.atmosphere - (buyer.atmoRange?.[1] || 0)).toFixed(2)}x</div>
                            )}
                            {currentPlanet.water < (buyer.waterRange?.[0] || 0) && (
                              <div className="text-blue-400">• Increase water by {((buyer.waterRange?.[0] || 0) - currentPlanet.water).toFixed(2)}</div>
                            )}
                            {currentPlanet.water > (buyer.waterRange?.[1] || 0) && (
                              <div className="text-orange-400">• Decrease water by {(currentPlanet.water - (buyer.waterRange?.[1] || 0)).toFixed(2)}</div>
                            )}
                            {currentPlanet.gravity < (buyer.gravRange?.[0] || 0) && (
                              <div className="text-purple-400">• Increase gravity by {((buyer.gravRange?.[0] || 0) - currentPlanet.gravity).toFixed(2)}x</div>
                            )}
                            {currentPlanet.gravity > (buyer.gravRange?.[1] || 0) && (
                              <div className="text-purple-400">• Decrease gravity by {(currentPlanet.gravity - (buyer.gravRange?.[1] || 0)).toFixed(2)}x</div>
                            )}
                            {currentPlanet.radiation < (buyer.radRange?.[0] || 0) && (
                              <div className="text-yellow-400">• Increase radiation by {((buyer.radRange?.[0] || 0) - currentPlanet.radiation).toFixed(2)}x</div>
                            )}
                            {currentPlanet.radiation > (buyer.radRange?.[1] || 0) && (
                              <div className="text-green-400">• Decrease radiation by {(currentPlanet.radiation - (buyer.radRange?.[1] || 0)).toFixed(2)}x</div>
                            )}
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
