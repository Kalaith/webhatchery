import React from 'react';

const Header: React.FC = () => (
  <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
    <div className="container flex h-16 items-center justify-between">
      <h1 className="text-xl font-semibold text-[rgb(var(--color-primary))] tracking-tight">
        WebHatchery Project Tracker
      </h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            className="input w-64 text-sm placeholder:text-gray-500" 
            placeholder="Search projects..." 
          />
        </div>
        <button className="btn btn-primary">
          Suggest New Project
        </button>
      </div>
    </div>
  </header>
);

export default Header;
