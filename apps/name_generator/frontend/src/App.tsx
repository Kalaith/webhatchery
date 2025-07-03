import React, { useState } from 'react';
import TabPanel from './components/TabPanel';
import PeopleForm from './components/PeopleForm';
import PlacesForm from './components/PlacesForm';
import EventsForm from './components/EventsForm';
import TitlesForm from './components/TitlesForm';
import BatchForm from './components/BatchForm';
import ResultsGrid from './components/ResultsGrid';
import { fetchPeopleNames } from './utils/api';
import type { PersonNameResult } from './types';
import type { PeopleParams } from './utils/api';

const tabs = [
  { label: 'People', value: 'people' },
  { label: 'Places', value: 'places' },
  { label: 'Events', value: 'events' },
  { label: 'Titles', value: 'titles' },
  { label: 'Batch', value: 'batch' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('people');
  const [peopleResults, setPeopleResults] = useState<PersonNameResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder handlers for new forms
  const [placesResults, setPlacesResults] = useState<any[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [eventsResults, setEventsResults] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [titlesResults, setTitlesResults] = useState<any[]>([]);
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  const handlePeopleGenerate = async (params: PeopleParams) => {
    setLoading(true);
    try {
      const results = await fetchPeopleNames(params);
      setPeopleResults(results);
    } catch (e) {
      setPeopleResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlacesGenerate = async (params: any) => {
    setPlacesLoading(true);
    // TODO: Call API for places
    setTimeout(() => {
      setPlacesResults([]);
      setPlacesLoading(false);
    }, 600);
  };

  const handleEventsGenerate = async (params: any) => {
    setEventsLoading(true);
    // TODO: Call API for events
    setTimeout(() => {
      setEventsResults([]);
      setEventsLoading(false);
    }, 600);
  };

  const handleTitlesGenerate = async (params: any) => {
    setTitlesLoading(true);
    // TODO: Call API for titles
    setTimeout(() => {
      setTitlesResults([]);
      setTitlesLoading(false);
    }, 600);
  };

  const handleBatchGenerate = async (params: any) => {
    setBatchLoading(true);
    // TODO: Call API for batch
    setTimeout(() => {
      setBatchResults([]);
      setBatchLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-2xl font-bold">Name Generator</h1>
      </header>
      <nav className="flex space-x-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded font-medium focus:outline-none transition-colors ${activeTab === tab.value ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="p-4 max-w-3xl mx-auto">
        <TabPanel name="people" active={activeTab}>
          <PeopleForm onGenerate={handlePeopleGenerate} loading={loading} />
          <ResultsGrid results={peopleResults} />
        </TabPanel>
        <TabPanel name="places" active={activeTab}>
          <PlacesForm onGenerate={handlePlacesGenerate} loading={placesLoading} />
          <ResultsGrid results={placesResults} />
        </TabPanel>
        <TabPanel name="events" active={activeTab}>
          <EventsForm onGenerate={handleEventsGenerate} loading={eventsLoading} />
          <ResultsGrid results={eventsResults} />
        </TabPanel>
        <TabPanel name="titles" active={activeTab}>
          <TitlesForm onGenerate={handleTitlesGenerate} loading={titlesLoading} />
          <ResultsGrid results={titlesResults} />
        </TabPanel>
        <TabPanel name="batch" active={activeTab}>
          <BatchForm onGenerate={handleBatchGenerate} loading={batchLoading} />
          <ResultsGrid results={batchResults} />
        </TabPanel>
      </main>
    </div>
  );
};

export default App;
