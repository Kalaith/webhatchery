import React from 'react';

const HiveCore: React.FC = () => {
  return (
    <div
      className="hive-core flex items-center justify-center relative w-32 h-32 bg-gray-200 rounded-full shadow-lg"
      id="hive-core"
    >
      <div className="hive-pulse absolute w-full h-full bg-blue-300 rounded-full animate-ping"></div>
      <div className="hive-center flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
        <span className="hive-icon text-3xl text-white">🕷️</span>
      </div>
    </div>
  );
};

export default HiveCore;
