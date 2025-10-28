/**
 * Color Settings Section
 *
 * Controls for theme colors and color palette
 */

import React from "react";

interface ColorConfig {
  primary: string;
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
}

interface ColorSettingsProps {
  config: ColorConfig;
  onChange: (config: ColorConfig) => void;
}

export const ColorSettings: React.FC<ColorSettingsProps> = ({
  config,
  onChange,
}) => {
  const updateColor = (value: string) => {
    onChange({ ...config, primary: value });
  };

  const updateTextColor = (key: keyof ColorConfig["text"], value: string) => {
    onChange({
      ...config,
      text: { ...config.text, [key]: value },
    });
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
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <h3 className="text-base font-semibold text-gray-900">Colors</h3>
      </div>

      {/* Brand Colors */}
      <div>
        <p className="text-xs font-medium text-gray-700 mb-3">Brand Colors</p>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Primary</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={config.primary}
              onChange={(e) => updateColor(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={config.primary}
              onChange={(e) => updateColor(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Text Colors */}
      <div>
        <p className="text-xs font-medium text-gray-700 mb-3">Text Colors</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Primary Text
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.text.primary}
                onChange={(e) => updateTextColor("primary", e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.text.primary}
                onChange={(e) => updateTextColor("primary", e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Secondary
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.text.secondary}
                onChange={(e) => updateTextColor("secondary", e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.text.secondary}
                onChange={(e) => updateTextColor("secondary", e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Inverse</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.text.inverse}
                onChange={(e) => updateTextColor("inverse", e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.text.inverse}
                onChange={(e) => updateTextColor("inverse", e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
