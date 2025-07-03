import React from 'react';
import type { Option } from '../types';

export interface FormSelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
  } 

const FormSelectField: React.FC<FormSelectFieldProps> = ({ label, name, value, onChange, options, className }) => (
  <div className={className}>
    <label className="block text-base font-semibold text-gray-800 dark:text-gray-100 mb-2" htmlFor={name}>
      {label}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

export default FormSelectField; 