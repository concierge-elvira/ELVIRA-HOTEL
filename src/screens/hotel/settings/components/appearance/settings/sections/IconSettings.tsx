/**
 * Icon Settings Section
 *
 * Controls for icon size
 */

import React from "react";

interface IconConfig {
  size: "small" | "medium" | "large";
}

interface IconSettingsProps {
  config: IconConfig;
  onChange: (config: IconConfig) => void;
}

export const IconSettings: React.FC<IconSettingsProps> = ({
  config,
  onChange,
}) => {
  const updateSize = (size: IconConfig["size"]) => {
    onChange({ ...config, size });
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
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-base font-semibold text-gray-900">Icons</h3>
      </div>

      {/* Icon Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateSize("small")}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
              config.size === "small"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Small
          </button>
          <button
            onClick={() => updateSize("medium")}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
              config.size === "medium"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => updateSize("large")}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
              config.size === "large"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Large
          </button>
        </div>
      </div>
    </div>
  );
};
