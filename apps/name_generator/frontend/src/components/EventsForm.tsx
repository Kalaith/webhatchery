import React, { useState, useEffect } from 'react';
import FormSelectField from './FormSelectField';
import { fetchSelectOptions } from '../utils/api';
import type { Option } from '../types';

interface EventsFormProps {
  onGenerate: (params: {
    count: number;
    type: string;
    theme: string;
    tone: string;
  }) => void;
  loading?: boolean;
}

const fields = ['type', 'theme', 'tone'] as const;
type Field = typeof fields[number];

const EventsForm: React.FC<EventsFormProps> = ({ onGenerate, loading }) => {
  const [count, setCount] = useState(5);
  const [type, setType] = useState('conference');
  const [theme, setTheme] = useState('technology');
  const [tone, setTone] = useState('professional');

  const [options, setOptions] = useState<Record<Field, Option[]>>({
    type: [], theme: [], tone: []
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all(fields.map(field => fetchSelectOptions(field)))
      .then(results => {
        if (!isMounted) return;
        setOptions({
          type: results[0],
          theme: results[1],
          tone: results[2],
        });
      })
      .catch(() => {
        if (isMounted) console.error('Failed to fetch options');
      });
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ count, type, theme, tone });
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-br from-yellow-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100 dark:border-gray-700">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Generate Event Names</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base">Fill out the options below to generate unique event names. All fields are customizable for your needs.</p>
        </header>
        <form onSubmit={handleSubmit} aria-labelledby="events-form-title" className="space-y-8">
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
                className="input input-bordered w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                aria-describedby="count-help"
              />
              <span id="count-help" className="text-xs text-gray-500 mt-1">Choose between 1 and 20 names.</span>
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
              label="Theme"
              name="theme"
              value={theme}
              onChange={setTheme}
              options={options.theme}
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
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white px-8 py-2 rounded-lg font-semibold shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
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

export default EventsForm;