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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 text-gray-900 dark:text-gray-100">
      <div className="w-full">
        <header className="relative overflow-hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5"></div>
          <div className="relative px-6 py-8">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                ✨ Name Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                Generate unique names for people, places, events, and titles
              </p>
            </div>
          </div>
        </header>
        
        <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    activeTab === tab.value 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                  {activeTab === tab.value && (
                    <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>
        
        <main className="max-w-6xl mx-auto px-6 py-8">
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
    </div>
  );
};

export default App;
