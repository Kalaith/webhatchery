import React from 'react';

const Header: React.FC = () => (
  <header className="w-full px-6 py-4 bg-white border-b border-gray-200 text-center shadow-sm sticky top-0 z-10">
    <h1 className="text-4xl font-bold text-primary mb-2">Dungeon Master's Tale</h1>
    <p className="text-gray-500 text-base">Guide your party through their adventure</p>
  </header>
);

export default Header;
