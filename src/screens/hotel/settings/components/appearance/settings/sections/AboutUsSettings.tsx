/**
 * About Us Settings Section
 *
 * Controls for the About Us section appearance
 */

import React from "react";

interface AboutUsConfig {
  backgroundColor: string;
}

interface AboutUsSettingsProps {
  config: AboutUsConfig;
  onChange: (config: AboutUsConfig) => void;
}

export const AboutUsSettings: React.FC<AboutUsSettingsProps> = ({
  config,
  onChange,
}) => {
  const updateBackgroundColor = (backgroundColor: string) => {
    onChange({ ...config, backgroundColor });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-base font-semibold text-gray-900">
          About Us Section
        </h3>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => updateBackgroundColor(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={config.backgroundColor}
            onChange={(e) => updateBackgroundColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="#111827"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          The dark background color for the About Us section
        </p>
      </div>
    </div>
  );
};
