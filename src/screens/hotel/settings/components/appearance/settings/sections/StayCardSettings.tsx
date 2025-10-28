/**
 * Stay Display Card Settings Section
 *
 * Controls for the stay details card appearance
 */

import React from "react";

interface StayCardConfig {
  gradientFrom: string;
  gradientTo: string;
}

interface StayCardSettingsProps {
  config: StayCardConfig;
  onChange: (config: StayCardConfig) => void;
}

export const StayCardSettings: React.FC<StayCardSettingsProps> = ({
  config,
  onChange,
}) => {
  const updateGradientFrom = (gradientFrom: string) => {
    onChange({ ...config, gradientFrom });
  };

  const updateGradientTo = (gradientTo: string) => {
    onChange({ ...config, gradientTo });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-white-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <h3 className="text-base font-semibold text-gray-900">
          Stay Details Card
        </h3>
      </div>

      {/* Gradient Colors */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Background Gradient
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">From</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.gradientFrom}
                onChange={(e) => updateGradientFrom(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.gradientFrom}
                onChange={(e) => updateGradientFrom(e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">To</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.gradientTo}
                onChange={(e) => updateGradientTo(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.gradientTo}
                onChange={(e) => updateGradientTo(e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
