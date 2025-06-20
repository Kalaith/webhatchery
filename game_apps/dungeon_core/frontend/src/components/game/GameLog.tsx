import React, { useEffect, useRef } from "react";
import { useGameStore } from "../../stores/gameStore";

export const GameLog: React.FC = () => {
  const { log } = useGameStore();
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const getLogEntryStyle = (type: string) => {
    switch (type) {
      case 'system': return 'text-blue-600 font-medium';
      case 'combat': return 'text-red-600';
      case 'economic': return 'text-yellow-600';
      case 'adventurer': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="game-log-container mt-4 bg-white rounded-lg shadow p-4">
      <h4 className="font-bold mb-2 text-gray-800">Dungeon Log</h4>
      <div className="game-log bg-gray-50 p-3 rounded h-40 overflow-y-auto border">
        {log.length === 0 ? (
          <div className="text-gray-400 italic text-center">No activity yet...</div>
        ) : (
          log.map((entry, idx) => (
            <div 
              key={idx} 
              className={`log-entry py-1 text-sm ${getLogEntryStyle(entry.type)}`}
            >
              <span className="text-xs text-gray-400 mr-2">
                {formatTimestamp(entry.timestamp)}
              </span>
              <span className="inline-block w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: getLogEntryStyle(entry.type).split(' ')[0].replace('text-', '') }}>
              </span>
              {entry.message}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
