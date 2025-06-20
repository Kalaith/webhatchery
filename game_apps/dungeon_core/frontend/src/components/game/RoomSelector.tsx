import React from "react";
import { useGameStore } from "../../stores/gameStore";
import { GAME_CONSTANTS, getRoomCost } from "../../data/gameData";

export const RoomSelector: React.FC = () => {
  const { mana, addRoom, floors, totalFloors } = useGameStore();
  // Calculate the cost for the next room
  const getNextRoomCost = () => {
    const deepestFloor = floors.find(f => f.isDeepest);
    if (!deepestFloor) return getRoomCost(0, 'normal');

    const nonCoreRooms = deepestFloor.rooms.filter(room => room.type !== 'core');
    
    // Calculate total room count across all floors (excluding entrance and core rooms)
    const totalRoomCount = floors.reduce((total, floor) => {
      return total + floor.rooms.filter(room => room.type !== 'core' && room.type !== 'entrance').length;
    }, 0);
    
    // If the current floor is full, next room will be on a new floor
    if (nonCoreRooms.length >= GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR + 1) {
      return getRoomCost(totalRoomCount, 'normal');
    } else {
      // Next room on current floor
      const nextPosition = nonCoreRooms.length;
      const roomType = nextPosition === GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR ? 'boss' : 'normal';
      return getRoomCost(totalRoomCount, roomType);
    }
  };

  const roomCost = getNextRoomCost();

  const handleAddRoom = () => {
    if (mana >= roomCost) {
      const success = addRoom();
      if (!success) {
        // Could show an error message here
      }
    }
  };

  const canAfford = mana >= roomCost;

  return (
    <aside className="sidebar sidebar-left bg-gray-100 p-4 w-64">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Dungeon Construction</h3>
      
      <div className="construction-options space-y-4">
        <div className="add-room-section">
          <h4 className="font-semibold text-gray-700 mb-2">Add Room</h4>
          <button
            className={`w-full p-3 rounded border-2 transition-all ${
              canAfford 
                ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600' 
                : 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleAddRoom}
            disabled={!canAfford}
          >            <div className="flex justify-between items-center">
              <span className="font-bold">Add New Room</span>
              <span className={`text-sm font-bold ${canAfford ? 'text-blue-200' : 'text-red-500'}`}>
                {roomCost}�
              </span>
            </div>            <div className="text-xs mt-1 opacity-90">
              {(() => {
                const deepestFloor = floors.find(f => f.isDeepest);
                if (!deepestFloor) return "Adds to deepest floor";
                
                const nonCoreRooms = deepestFloor.rooms.filter(room => room.type !== 'core');
                
                if (nonCoreRooms.length >= GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR + 1) {
                  return `Creates floor ${totalFloors + 1}`;
                } else {
                  const nextPosition = nonCoreRooms.length;
                  const roomType = nextPosition === GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR ? 'Boss' : 'Normal';
                  return `${roomType} room on floor ${deepestFloor.number}`;
                }
              })()}
            </div>
          </button>
        </div>

        <div className="room-info bg-blue-50 p-3 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">Room System</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div>• Rooms 1-4: Normal combat</div>
            <div>• Room 5: Boss chamber</div>
            <div>• {GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR + 1} rooms per floor</div>
            <div>• Core room on deepest floor</div>
            <div>• New floor when current is full</div>
          </div>
        </div>

        <div className="scaling-info bg-yellow-50 p-3 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">Floor Scaling</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>• Deeper floors = stronger monsters</div>
            <div>• Higher mana costs per floor</div>
            <div>• Better loot rewards</div>
            <div>• Core bonus: +5% mana/floor</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
        💡 Add rooms to expand your dungeon. When a floor reaches {GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR + 1} rooms, 
        the next room will start a new floor.
      </div>
    </aside>
  );
};
