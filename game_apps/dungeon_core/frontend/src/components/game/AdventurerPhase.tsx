import React from "react";
// This component is deprecated - AdventurerSystem now handles all adventurer logic
// in the new room/floor-based system. Keeping this file for compatibility
// but it should not be used.

export interface AdventurerPhaseProps {
  running: boolean;
  onEnd?: (log: { message: string; type: string }[]) => void;
  addLog?: (entry: { message: string; type: string }) => void;
}

export const AdventurerPhase: React.FC<AdventurerPhaseProps> = ({ onEnd }) => {
  // This component is deprecated in favor of AdventurerSystem
  React.useEffect(() => {
    if (onEnd) {
      onEnd([{ message: "AdventurerPhase is deprecated. Use AdventurerSystem instead.", type: "system" }]);
    }
  }, [onEnd]);

  return null;
};
