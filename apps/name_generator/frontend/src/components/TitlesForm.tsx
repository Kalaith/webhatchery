import React, { useState, useEffect } from 'react';
import FormSelectField from './FormSelectField';
import { fetchSelectOptions } from '../utils/api';
import type { Option } from '../types';

interface TitlesFormProps {
  onGenerate: (params: {
    count: number;
    type: string;
    genre: string;
    tone: string;
    keywords: string;
    setting: string;
    gender: string;
    race: string;
    species: string;
  }) => void;
  loading?: boolean;
}

const fields = ['type', 'genre', 'tone', 'setting', 'gender', 'race', 'species'] as const;
type Field = typeof fields[number];

const TitlesForm: React.FC<TitlesFormProps> = ({ onGenerate, loading }) => {
  const [count, setCount] = useState(5);
  const [type, setType] = useState('book');
  const [genre, setGenre] = useState('fantasy');
  const [tone, setTone] = useState('mysterious');
  const [keywords, setKeywords] = useState('');
  const [setting, setSetting] = useState('medieval');
  const [gender, setGender] = useState('neutral');
  const [race, setRace] = useState('human');
  const [species, setSpecies] = useState('humanoid');

  const [options, setOptions] = useState<Record<Field, Option[]>>({
    type: [], genre: [], tone: [], setting: [], gender: [], race: [], species: []
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all(fields.map(field => fetchSelectOptions(field)))
      .then(results => {
        if (!isMounted) return;
        setOptions({
          type: results[0],
          genre: results[1],
          tone: results[2],
          setting: results[3],
          gender: results[4],
          race: results[5],
          species: results[6],
        });
      })
      .catch(() => {
        if (isMounted) console.error('Failed to fetch options');
      });
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ count, type, genre, tone, keywords, setting, gender, race, species });
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100 dark:border-gray-700">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Generate Titles</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base">Fill out the options below to generate creative titles. All fields are customizable for your needs.</p>
        </header>
        <form onSubmit={handleSubmit} aria-labelledby="titles-form-title" className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="count" className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Count</label>
              <input
                id="count"
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="input input-bordered w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-400 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                aria-describedby="count-help"
              />
              <span id="count-help" className="text-xs text-gray-500 mt-1">Choose between 1 and 20 titles.</span>
            </div>
            <FormSelectField
              label="Type"
              name="type"
              value={type}
              onChange={setType}
              options={options.type}
              className="flex flex-col"
            />
            <FormSelectField
              label="Genre"
              name="genre"
              value={genre}
              onChange={setGenre}
              options={options.genre}
              className="flex flex-col"
            />
            <FormSelectField
              label="Tone"
              name="tone"
              value={tone}
              onChange={setTone}
              options={options.tone}
              className="flex flex-col"
            />
            <FormSelectField
              label="Setting"
              name="setting"
              value={setting}
              onChange={setSetting}
              options={options.setting}
              className="flex flex-col"
            />
            <FormSelectField
              label="Gender"
              name="gender"
              value={gender}
              onChange={setGender}
              options={options.gender}
              className="flex flex-col"
            />
            <FormSelectField
              label="Race"
              name="race"
              value={race}
              onChange={setRace}
              options={options.race}
              className="flex flex-col"
            />
            <FormSelectField
              label="Species"
              name="species"
              value={species}
              onChange={setSpecies}
              options={options.species}
              className="flex flex-col"
            />
            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="keywords" className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Keywords</label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                className="input input-bordered w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-400 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Optional keywords (comma separated)"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-2 rounded-lg font-semibold shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default TitlesForm;