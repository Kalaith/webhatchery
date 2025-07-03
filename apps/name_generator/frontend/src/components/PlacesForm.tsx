import React, { useState, useEffect } from 'react';
import FormSelectField from './FormSelectField';
import { fetchSelectOptions } from '../utils/api';
import type { Option } from '../types';

interface PlacesFormProps {
  onGenerate: (params: {
    count: number;
    genre: string;
    location_type: string;
    tone: string;
    climate: string;
    size: string;
  }) => void;
  loading?: boolean;
}

const fields = ['genre', 'location_type', 'tone', 'climate', 'size'] as const;
type Field = typeof fields[number];

const PlacesForm: React.FC<PlacesFormProps> = ({ onGenerate, loading }) => {
  const [count, setCount] = useState(5);
  const [genre, setGenre] = useState('fantasy');
  const [locationType, setLocationType] = useState('water');
  const [tone, setTone] = useState('mystical');
  const [climate, setClimate] = useState('cold');
  const [size, setSize] = useState('large');

  const [options, setOptions] = useState<Record<Field, Option[]>>({
    genre: [], location_type: [], tone: [], climate: [], size: []
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all(fields.map(field => fetchSelectOptions(field)))
      .then(results => {
        if (!isMounted) return;
        setOptions({
          genre: results[0],
          location_type: results[1],
          tone: results[2],
          climate: results[3],
          size: results[4],
        });
      })
      .catch(() => {
        if (isMounted) console.error('Failed to fetch options');
      });
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ count, genre, location_type: locationType, tone, climate, size });
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100 dark:border-gray-700">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Generate Place Names</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base">Fill out the options below to generate unique place names. All fields are customizable for your needs.</p>
        </header>
        <form onSubmit={handleSubmit} aria-labelledby="places-form-title" className="space-y-8">
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
                className="input input-bordered w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-400 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                aria-describedby="count-help"
              />
              <span id="count-help" className="text-xs text-gray-500 mt-1">Choose between 1 and 20 names.</span>
            </div>
            <FormSelectField
              label="Genre"
              name="genre"
              value={genre}
              onChange={setGenre}
              options={options.genre}
              className="flex flex-col"
            />
            <FormSelectField
              label="Location Type"
              name="location_type"
              value={locationType}
              onChange={setLocationType}
              options={options.location_type}
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
              label="Climate"
              name="climate"
              value={climate}
              onChange={setClimate}
              options={options.climate}
              className="flex flex-col"
            />
            <FormSelectField
              label="Size"
              name="size"
              value={size}
              onChange={setSize}
              options={options.size}
              className="flex flex-col"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-2 rounded-lg font-semibold shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
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

export default PlacesForm;