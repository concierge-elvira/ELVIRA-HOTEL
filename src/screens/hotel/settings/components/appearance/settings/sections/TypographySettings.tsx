/**
 * Typography Settings Section
 *
 * Controls for font family, sizes, and weights
 */

import React from "react";

interface TypographyConfig {
  fontFamily: string;
  fontSize: {
    base: string;
    heading: string;
    small: string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

interface TypographySettingsProps {
  config: TypographyConfig;
  onChange: (config: TypographyConfig) => void;
}

const fontFamilies = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
];

export const TypographySettings: React.FC<TypographySettingsProps> = ({
  config,
  onChange,
}) => {
  const updateFontFamily = (fontFamily: string) => {
    onChange({ ...config, fontFamily });
  };

  const updateFontSize = (
    key: keyof TypographyConfig["fontSize"],
    value: string
  ) => {
    onChange({
      ...config,
      fontSize: { ...config.fontSize, [key]: value },
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
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <h3 className="text-base font-semibold text-gray-900">Typography</h3>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={config.fontFamily}
          onChange={(e) => updateFontFamily(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Sizes */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Small Text
          </label>
          <input
            type="text"
            value={config.fontSize.small}
            onChange={(e) => updateFontSize("small", e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="12px"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Base Text
          </label>
          <input
            type="text"
            value={config.fontSize.base}
            onChange={(e) => updateFontSize("base", e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="14px"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Heading
          </label>
          <input
            type="text"
            value={config.fontSize.heading}
            onChange={(e) => updateFontSize("heading", e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="18px"
          />
        </div>
      </div>
    </div>
  );
};
