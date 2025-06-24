import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GameBoard from './components/GameBoard';
import StorySection from './components/StorySection';
import StoryCard from './components/StoryCard';
import StoryContent from './components/StoryContent';
import StoryLocation from './components/StoryLocation';
import NPCPanel from './components/NPCPanel';
import NPCList from './components/NPCList';
import type { NPC } from './components/NPCList';
import { fetchNPCs } from './api/npcs';
import { fetchStats } from './api/stats';
import StatusMeters from './components/StatusMeters';

const initialEvents: string[] = [
  'Your adventuring party has gathered at the Prancing Pony Tavern to plan their next adventure. The fire crackles warmly as your companions discuss potential quests and share their thoughts on what lies ahead...'
];

const App: React.FC = () => {
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);
  const [events] = useState<string[]>(initialEvents);
  const [location] = useState<string>('The Prancing Pony Tavern');
  const [stats, setStats] = useState<{
    tension: number;
    morale: number;
    gold: number;
    supplies: string;
    reputation: string;
  } | null>(null);

  useEffect(() => {
    fetchNPCs().then(setNpcs);
    fetchStats().then(setStats);
  }, []);

  const handleSelectNPC = (id: string) => setSelectedNPC(id);

  return (
    <div className="game-container">
      <Header />
      <GameBoard>
        <StorySection>
          <StoryCard>
            <div className="card__header">
              <h2>Current Story</h2>
              <StoryLocation location={location} />
            </div>
            <div className="card__body">
              <StoryContent events={events} />
            </div>
          </StoryCard>
        </StorySection>
        <div className="game-content grid grid-cols-1 md:grid-cols-2 gap-6">
          <NPCPanel>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-xl font-semibold">Your Party</h3>
              </div>
              <div className="p-6">
                <NPCList npcs={npcs} onSelect={handleSelectNPC} selectedId={selectedNPC} />
              </div>
            </div>
          </NPCPanel>
          {/* DMPanel and other controls would go here */}
        </div>
      </GameBoard>
      <Footer>
        {stats && (
          <StatusMeters
            tension={stats.tension}
            morale={stats.morale}
            gold={stats.gold}
            supplies={stats.supplies}
            reputation={stats.reputation}
          />
        )}
      </Footer>
    </div>
  );
};

export default App;
