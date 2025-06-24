import React from 'react';

interface StatusMetersProps {
  tension: number;
  morale: number;
  gold: number;
  supplies: string;
  reputation: string;
}

const getTensionText = (tension: number) =>
  tension >= 70 ? 'High' : tension >= 40 ? 'Medium' : 'Low';

const getMoraleText = (morale: number) =>
  morale >= 70 ? 'Great' : morale >= 50 ? 'Good' : morale >= 30 ? 'Fair' : 'Poor';

const StatusMeters: React.FC<StatusMetersProps> = ({ tension, morale, gold, supplies, reputation }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto w-full status-meters">
    <div className="flex flex-col gap-2 meter">
      <label className="font-medium text-sm">Story Tension</label>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden progress-bar">
        <div
          className="h-full rounded-full transition-all duration-200 bg-yellow-500 tension-meter"
          style={{ width: `${tension}%` }}
        ></div>
      </div>
      <span className="text-sm" id="tension-value">{getTensionText(tension)}</span>
    </div>
    <div className="flex flex-col gap-2 meter">
      <label className="font-medium text-sm">Party Morale</label>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden progress-bar">
        <div
          className="h-full rounded-full transition-all duration-200 bg-emerald-600 morale-meter"
          style={{ width: `${morale}%` }}
        ></div>
      </div>
      <span className="text-sm" id="morale-value">{getMoraleText(morale)}</span>
    </div>
    <div className="flex flex-col gap-2 items-center resources">
      <div className="flex flex-col items-center resource">
        <span className="text-sm text-gray-500 font-medium resource-label">Gold:</span>
        <span className="font-semibold text-gray-900" id="gold-amount">{gold}</span>
      </div>
      <div className="flex flex-col items-center resource">
        <span className="text-sm text-gray-500 font-medium resource-label">Supplies:</span>
        <span className="font-semibold text-gray-900" id="supplies-amount">{supplies}</span>
      </div>
      <div className="flex flex-col items-center resource">
        <span className="text-sm text-gray-500 font-medium resource-label">Reputation:</span>
        <span className="font-semibold text-gray-900" id="reputation-amount">{reputation}</span>
      </div>
    </div>
  </div>
);

export default StatusMeters;
