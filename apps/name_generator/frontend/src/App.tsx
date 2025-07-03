import React, { useState } from 'react';
import TabPanel from './components/TabPanel';
import PeopleForm from './components/PeopleForm';
import PlacesForm from './components/PlacesForm';
import EventsForm from './components/EventsForm';
import TitlesForm from './components/TitlesForm';
import BatchForm from './components/BatchForm';
import ResultsGrid from './components/ResultsGrid';
import { fetchPeopleNames, fetchPlaceNames, fetchEventNames, fetchTitleNames, fetchBatchResults } from './utils/api';
import type { PersonNameResult } from './types';
import type { PeopleParams, TitleParams, PlaceParams } from './utils/api';

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

  const [placesResults, setPlacesResults] = useState<string[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [eventsResults, setEventsResults] = useState<string[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [titlesResults, setTitlesResults] = useState<string[]>([]);
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [batchResults, setBatchResults] = useState<Record<string, string[]>>({});
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

  const handlePlacesGenerate = async (params: PlaceParams) => {
    setPlacesLoading(true);
    try {
      const results = await fetchPlaceNames(params);
      setPlacesResults(results);
    } catch (e) {
      setPlacesResults([]);
    } finally {
      setPlacesLoading(false);
    }
  };

  const handleEventsGenerate = async (params: { count: number; type: string; theme: string; tone: string; }) => {
    setEventsLoading(true);
    try {
      const results = await fetchEventNames(params);
      setEventsResults(results);
    } catch (e) {
      setEventsResults([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleTitlesGenerate = async (params: TitleParams) => {
    setTitlesLoading(true);
    try {
      const results = await fetchTitleNames(params);
      setTitlesResults(results);
    } catch (e) {
      setTitlesResults([]);
    } finally {
      setTitlesLoading(false);
    }
  };

  const handleBatchGenerate = async (params: { count: number; types: string[] }) => {
    setBatchLoading(true);
    try {
      const results = await fetchBatchResults(params);
      setBatchResults(results);
    } catch (e) {
      setBatchResults({});
    } finally {
      setBatchLoading(false);
    }
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
          <ResultsGrid results={peopleResults} type="people" />
        </TabPanel>
        <TabPanel name="places" active={activeTab}>
          <PlacesForm onGenerate={handlePlacesGenerate} loading={placesLoading} />
          <ResultsGrid results={placesResults} type="places" />
        </TabPanel>
        <TabPanel name="events" active={activeTab}>
          <EventsForm onGenerate={handleEventsGenerate} loading={eventsLoading} />
          <ResultsGrid results={eventsResults} type="events" />
        </TabPanel>
        <TabPanel name="titles" active={activeTab}>
          <TitlesForm onGenerate={handleTitlesGenerate} loading={titlesLoading} />
          <ResultsGrid results={titlesResults} type="titles" />
        </TabPanel>
        <TabPanel name="batch" active={activeTab}>
          <BatchForm onGenerate={handleBatchGenerate} loading={batchLoading} />
          <div className="space-y-6 mt-6">
            {['people', 'places', 'events', 'titles'].map(type => (
              batchResults[type] && (
                <div key={type}>
                  <h3 className="text-lg font-bold mb-2 capitalize">{type}</h3>
                  <ResultsGrid results={batchResults[type]} type={type as any} />
                </div>
              )
            ))}
          </div>
        </TabPanel>
      </main>
    </div>
  );
};

export default App;
