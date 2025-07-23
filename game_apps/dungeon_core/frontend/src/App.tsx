import { useEffect } from "react";
import { ResourceBar } from "./components/layout/ResourceBar";
import { RoomSelector } from "./components/game/RoomSelector";
import { MonsterSelector } from "./components/game/MonsterSelector";
import { GameControls } from "./components/game/GameControls";
import { GameModal } from "./components/ui/GameModal";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { DungeonView } from "./components/game/DungeonView";
import { AdventurerSystem } from "./components/game/AdventurerSystemFloor";
import { TimeSystem } from "./components/game/TimeSystem";
import { BackendMonsterPlacement } from "./components/game/BackendMonsterPlacement";
import { useBackendGameStore } from "./stores/backendGameStore";

function App() {
  const { 
    gameData,
    loading,
    error,
    selectedMonster,
    initializeGame,
    refreshGameState,
    selectMonster,
    placeMonster
  } = useBackendGameStore();

  // Initialize game on mount only - run once
  useEffect(() => {
    console.log('App initialization effect running');
    initializeGame();
  }, [initializeGame]);

  // Auto-refresh game state every 5 seconds (preserves floors)
  useEffect(() => {
    // Only start auto-refresh if we have game data
    if (gameData && gameData.floors && gameData.floors.length > 0) {
      console.log('Setting up auto-refresh interval');
      const interval = setInterval(() => {
        console.log('Auto-refreshing game state...');
        refreshGameState();
      }, 5000);
      return () => {
        console.log('Clearing auto-refresh interval');
        clearInterval(interval);
      };
    }
  }, [refreshGameState, gameData?.floors?.length]); // Only depend on floors length, not entire gameData

  const handleRoomClick = async (roomId: number): Promise<void> => {
    if (selectedMonster !== null) {
      try {
        const success = await placeMonster(roomId, selectedMonster);
        if (success) {
          selectMonster(null);
        }
      } catch (error) {
        console.error('Error placing monster:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-white text-xl">No game data</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="game-container min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col">
      {/* UI Components */}
      <ResourceBar gameData={gameData} />
      
      <main className="game-main flex flex-1 max-h-screen overflow-hidden">
        <RoomSelector />
        
        <section className="dungeon-area flex-1 flex flex-col items-center justify-start p-4 overflow-auto">
          <GameControls />
          
          <BackendMonsterPlacement />
          
          <div className="dungeon-view-container mb-4 w-full">
            <DungeonView floors={gameData.floors || []} onRoomClick={handleRoomClick} />
          </div>
          
          <div className="dungeon-view-container mb-4 w-full">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-white mb-4">Monsters</h2>
              {gameData.monsters.length === 0 ? (
                <p className="text-gray-400">No monsters placed yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameData.monsters.map((monster: { id: number; type: string; hp: number; maxHp: number; roomId: number; alive: boolean }) => (
                    <div key={monster.id} className="bg-gray-700 p-3 rounded">
                      <div className="text-white font-bold">{monster.type}</div>
                      <div className="text-gray-300 text-sm">
                        HP: {monster.hp}/{monster.maxHp}
                      </div>
                      <div className="text-gray-300 text-sm">
                        Room: {monster.roomId}
                      </div>
                      <div className={`text-sm ${
                        monster.alive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {monster.alive ? 'Alive' : 'Dead'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          
        </section>
        
        <MonsterSelector />
      </main>

      

      </div>
    </ErrorBoundary>
  );
}

export default App;
