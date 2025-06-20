import React from "react";
import { monsterTypes, GAME_CONSTANTS, getScaledMonsterStats } from "../../data/gameData";
import { useGameStore } from "../../stores/gameStore";
import type { DungeonFloor, Room } from "../../types/game";

interface DungeonFloorViewProps {
  floor: DungeonFloor;
  onRoomClick: (floorNumber: number, roomPosition: number) => void;
}

const RoomComponent: React.FC<{ 
  room: Room; 
  onClick: () => void;
  isActive: boolean;
}> = ({ room, onClick, isActive }) => {
  const getRoomColor = () => {
    switch (room.type) {
      case 'entrance': return '#4CAF50';
      case 'normal': return '#9E9E9E';
      case 'boss': return '#F44336';
      case 'core': return '#9C27B0';
      default: return '#9E9E9E';
    }
  };

  const getRoomIcon = () => {
    switch (room.type) {
      case 'entrance': return '🚪';
      case 'normal': return '⚔️';
      case 'boss': return '👑';
      case 'core': return '💎';
      default: return '❓';
    }
  };

  const adventurersHere = useGameStore.getState().adventurerParties.filter(
    party => party.currentFloor === room.floorNumber && party.currentRoom === room.position
  );

  return (
    <div
      className={`room-container relative p-4 border-2 rounded-lg cursor-pointer transition-all min-h-[120px] min-w-[100px] ${
        isActive ? 'ring-2 ring-blue-400' : ''
      }`}
      style={{ 
        backgroundColor: getRoomColor(),
        borderColor: isActive ? '#3B82F6' : '#D1D5DB',
        opacity: room.explored ? 1 : 0.8
      }}
      onClick={onClick}
    >
      <div className="room-header text-center mb-2">
        <div className="text-2xl">{getRoomIcon()}</div>
        <div className="text-xs font-bold text-white">
          {room.type === 'core' ? 'Core' : `Room ${room.position}`}
        </div>
      </div>

      {/* Monsters */}
      {room.monsters.length > 0 && (
        <div className="monsters-container flex flex-wrap gap-1 justify-center mb-2">
          {room.monsters.slice(0, 3).map((monster) => {
            const monsterType = monsterTypes[monster.type];
            const scaledStats = getScaledMonsterStats(
              { hp: monsterType.hp, attack: monsterType.attack, defense: monsterType.defense },
              monster.floorNumber,
              monster.isBoss
            );
            
            return (
              <div
                key={monster.id}
                className={`monster-icon relative text-lg ${monster.alive ? '' : 'opacity-50'}`}
                title={`${monsterType.name} ${monster.isBoss ? '(Boss)' : ''} - HP: ${monster.hp}/${scaledStats.hp}`}
                style={{ color: monsterType.color }}
              >
                🐲
                {monster.isBoss && (
                  <div className="absolute -top-1 -right-1 text-xs">👑</div>
                )}
              </div>
            );
          })}
          {room.monsters.length > 3 && (
            <div className="text-xs text-white">+{room.monsters.length - 3}</div>
          )}
        </div>
      )}

      {/* Adventurers */}
      {adventurersHere.length > 0 && (
        <div className="adventurers-container flex gap-1 justify-center mb-1">
          {adventurersHere.map((party) => (
            <div key={party.id} className="text-sm" title={`Party ${party.id} (${party.members.filter(m => m.alive).length} alive)`}>
              🧑‍🎤
            </div>
          ))}
        </div>
      )}

      {/* Room upgrade indicator */}
      {room.roomUpgrade && (
        <div className="absolute top-1 right-1 text-xs">⚡</div>
      )}

      {/* Loot indicator */}
      {room.loot > 0 && (
        <div className="absolute bottom-1 right-1 text-xs">💰</div>
      )}
    </div>
  );
};

export const DungeonFloorView: React.FC<DungeonFloorViewProps> = ({ floor, onRoomClick }) => {
  return (
    <div className="dungeon-floor bg-gray-800 rounded-lg p-4 mb-4">
      <div className="floor-header text-center mb-4">
        <h3 className="text-xl font-bold text-white">
          Floor {floor.number}
          {floor.isDeepest && <span className="text-purple-400 ml-2">(Deepest)</span>}
        </h3>
      </div>

      <div className="rooms-container flex items-center justify-center gap-2 overflow-x-auto">
        {floor.rooms
          .sort((a, b) => a.position - b.position)
          .map((room, index) => (
            <React.Fragment key={room.id}>
              <RoomComponent
                room={room}
                onClick={() => onRoomClick(floor.number, room.position)}
                isActive={false}
              />
              {index < floor.rooms.length - 1 && (
                <div className="connector text-white text-2xl">→</div>
              )}
            </React.Fragment>
          ))}
      </div>

      <div className="floor-stats text-center mt-2 text-sm text-gray-400">
        Rooms: {floor.rooms.length}/{GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR + 1}
        {floor.isDeepest && <span className="ml-4">🔮 Core Room Active</span>}
      </div>
    </div>
  );
};

interface DungeonViewProps {
  floors: DungeonFloor[];
  onRoomClick: (floorNumber: number, roomPosition: number) => void;
}

export const DungeonView: React.FC<DungeonViewProps> = ({ floors, onRoomClick }) => {
  return (
    <div className="dungeon-container bg-gray-900 rounded-lg p-4 max-h-[70vh] overflow-y-auto">
      <div className="dungeon-header text-center mb-4">
        <h2 className="text-2xl font-bold text-white">Dungeon Layout</h2>
        <p className="text-gray-400">Total Floors: {floors.length}</p>
      </div>

      <div className="floors-container space-y-4">
        {floors
          .sort((a, b) => a.number - b.number)
          .map((floor) => (
            <DungeonFloorView
              key={floor.id}
              floor={floor}
              onRoomClick={onRoomClick}
            />
          ))}
      </div>

      {floors.length === 0 && (
        <div className="empty-dungeon text-center text-gray-400 py-8">
          <div className="text-4xl mb-2">🏰</div>
          <p>Your dungeon is empty. Add your first room to get started!</p>
        </div>
      )}
    </div>
  );
};
