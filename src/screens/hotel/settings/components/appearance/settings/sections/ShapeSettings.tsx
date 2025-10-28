/**
 * Shape Settings Section
 *
 * Controls for border radius and card styles
 */

import React from "react";

interface ShapeConfig {
  borderRadius: "none" | "small" | "medium" | "large";
  cardStyle: "flat" | "elevated" | "outlined";
}

interface ShapeSettingsProps {
  config: ShapeConfig;
  onChange: (config: ShapeConfig) => void;
}

export const ShapeSettings: React.FC<ShapeSettingsProps> = ({
  config,
  onChange,
}) => {
  const updateBorderRadius = (borderRadius: ShapeConfig["borderRadius"]) => {
    onChange({ ...config, borderRadius });
  };

  const updateCardStyle = (cardStyle: ShapeConfig["cardStyle"]) => {
    onChange({ ...config, cardStyle });
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
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
          />
        </svg>
        <h3 className="text-base font-semibold text-gray-900">
          Shapes & Borders
        </h3>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Border Radius
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: "none" as const, label: "None" },
            { value: "small" as const, label: "Small" },
            { value: "medium" as const, label: "Medium" },
            { value: "large" as const, label: "Large" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateBorderRadius(option.value)}
              className={`px-3 py-2 text-xs rounded-lg border-2 transition-all ${
                config.borderRadius === option.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateCardStyle("flat")}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
              config.cardStyle === "flat"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Flat
          </button>
          <button
            onClick={() => updateCardStyle("elevated")}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
              config.cardStyle === "elevated"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Elevated
          </button>
          <button
            onClick={() => updateCardStyle("outlined")}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
              config.cardStyle === "outlined"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Outlined
          </button>
        </div>
      </div>
    </div>
  );
};
