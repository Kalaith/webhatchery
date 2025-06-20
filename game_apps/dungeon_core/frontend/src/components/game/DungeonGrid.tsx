import React from "react";
import { roomTypes, monsterTypes, adventurerClasses } from "../../data/gameData";
import { useGameStore } from "../../stores/gameStore";

export interface DungeonGridProps {
  onCellClick?: (x: number, y: number) => void;
}

export const GRID_SIZE = 10;

export const DungeonGrid: React.FC<DungeonGridProps> = ({ onCellClick }) => {
  const { grid, adventurerParties } = useGameStore();

  const handleCellClick = (x: number, y: number) => {
    if (onCellClick) {
      onCellClick(x, y);
    }
  };

  return (
    <div
      className="overflow-auto w-full flex justify-center"
      style={{ maxWidth: '100vw', paddingBottom: 16 }}
    >
      <div
        className="grid grid-cols-10 gap-0.5 bg-gray-300 rounded overflow-visible"
        style={{ width: 400, height: 400, minWidth: 400, minHeight: 400, boxSizing: 'content-box' }}
      >
        {grid.flat().map((cell) => {
          // Find adventurers in this cell
          const adventurersHere = adventurerParties
            .filter(party => party.currentX === cell.x && party.currentY === cell.y)
            .flatMap(party => party.members.filter(member => member.alive));

          return (
            <div
              key={`${cell.x},${cell.y}`}
              className="relative w-10 h-10 flex items-center justify-center border border-gray-400 bg-gray-100 cursor-pointer hover:bg-blue-100"
              onClick={() => handleCellClick(cell.x, cell.y)}
              style={{ boxSizing: 'border-box' }}
            >
              {cell.isEntrance && (
                <span className="absolute left-0 top-0 text-green-600 text-xs font-bold" title="Entrance">E</span>
              )}
              {cell.isExit && (
                <span className="absolute right-0 bottom-0 text-purple-700 text-xs font-bold" title="Exit">X</span>
              )}
              {cell.roomType !== null && (
                <div
                  className="absolute inset-1 rounded"
                  style={{ background: roomTypes[cell.roomType].color, opacity: 0.4 }}
                  title={`${roomTypes[cell.roomType].name} - ${roomTypes[cell.roomType].description}`}
                />
              )}
              {cell.monsters.length > 0 && (
                <div className="z-10 text-xs flex flex-wrap" title={`${cell.monsters.length} monsters`}>                  {cell.monsters.slice(0, 4).map((monster) => (
                    <span 
                      key={monster.id} 
                      style={{ color: monsterTypes[monster.type].color }}
                      className={monster.alive ? "" : "opacity-50"}
                    >
                      🐲
                    </span>
                  ))}
                  {cell.monsters.length > 4 && (
                    <span className="text-red-600 font-bold">+</span>
                  )}
                </div>
              )}
              {adventurersHere.length > 0 && (
                <div className="z-20 text-xs flex flex-wrap" title={`${adventurersHere.length} adventurers`}>                  {adventurersHere.slice(0, 4).map((adventurer) => (
                    <span 
                      key={adventurer.id} 
                      style={{ color: adventurerClasses[adventurer.classIdx].color }}
                    >
                      🧑‍🎤
                    </span>
                  ))}
                  {adventurersHere.length > 4 && (
                    <span className="text-blue-600 font-bold">+</span>
                  )}
                </div>
              )}
              {cell.loot && cell.loot > 0 && (
                <span className="absolute top-0 right-0 text-yellow-500 text-xs" title={`${cell.loot} gold`}>
                  💰
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
