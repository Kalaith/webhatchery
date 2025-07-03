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
    <label className="block text-sm font-medium" htmlFor={name}>{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="input input-bordered"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default FormSelectField; 