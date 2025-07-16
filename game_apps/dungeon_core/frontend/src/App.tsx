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
import { AdventurerChat } from "./components/game/AdventurerChat";
import { useGameStore } from "./stores/gameStore";

function App() {
  const { 
    modalOpen, 
    selectedMonster, 
    floors,
    closeModal, 
    placeMonster,
    addLog,
    ensureCoreRoom
  } = useGameStore();

  // Initialize modal state from session storage
  useEffect(() => {
    const modalSeen = sessionStorage.getItem("dungeoncore_modal_seen") === "1";
    if (modalSeen && modalOpen) {
      closeModal();
    }
  }, [modalOpen, closeModal]);

  // Ensure core room is always present on game load
  useEffect(() => {
    ensureCoreRoom();
  }, [ensureCoreRoom]);

  const handleRoomClick = async (floorNumber: number, roomPosition: number) => {
    if (selectedMonster !== null) {
      try {
        const success = await placeMonster(floorNumber, roomPosition, selectedMonster);
        if (success) {
          // Optionally deselect monster after placing
          // selectMonster(null);
        }
      } catch (error) {
        console.error('Error placing monster:', error);
        addLog({ 
          message: "Failed to place monster. Please try again.", 
          type: "system" 
        });
      }
    } else {
      addLog({ 
        message: "Select a monster first before clicking on a room", 
        type: "system" 
      });
    }
  };

  const handleModalClose = () => {
    closeModal();
  };

  return (
    <ErrorBoundary>
      <div className="game-container min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col">
      {/* System components for game logic */}
      <TimeSystem />
      <AdventurerSystem running={true} />
      
      {/* UI Components */}
      <ResourceBar />
      
      <main className="game-main flex flex-1 max-h-screen overflow-hidden">
        <RoomSelector />
        
        <section className="dungeon-area flex-1 flex flex-col items-center justify-start p-4 overflow-auto">
          <GameControls />
          
          <div className="dungeon-view-container mb-4 w-full">
            <DungeonView floors={floors} onRoomClick={handleRoomClick} />
          </div>
          
          
        </section>
        
        <MonsterSelector />
      </main>
      
      <AdventurerChat />
      
      <GameModal
        open={modalOpen}
        onClose={handleModalClose}
        title="Welcome to Dungeon Core Simulator v1.2"
        onConfirm={handleModalClose}
      >
        <div className="space-y-3 text-gray-700">
          <p>
            You are a newly formed Dungeon Core. Build a <strong>linear dungeon</strong> with 
            multiple floors to challenge brave adventurers!
          </p>
          <p>
            <strong>New Floor-Based System:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Add rooms to expand your dungeon linearly</li>
            <li>Each floor has 5 rooms + entrance (Room 5 becomes Boss)</li>
            <li>When a floor is full, new rooms create deeper floors</li>
            <li>Deeper floors = stronger monsters & higher costs</li>
            <li>Core room automatically appears on deepest floor</li>
            <li>Deep Core Bonus: +5% mana regen per floor</li>
          </ul>
          <p>
            <strong>Getting Started:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click "Add New Room" to expand your dungeon</li>
            <li>Select monsters and click on rooms to place them</li>
            <li>Boss rooms make the first monster a boss (+50% stats)</li>
            <li>Adventurers progress room by room through floors</li>
          </ul>
          <p className="text-sm text-gray-600">
            Good luck, Dungeon Core! Build deep and challenge the brave!
          </p>
        </div>
      </GameModal>
      </div>
    </ErrorBoundary>
  );
}

export default App;
