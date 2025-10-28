/**
 * Appearance Context
 *
 * Provides appearance configuration to all preview components
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useHotelAppearanceSettings } from "../../../../../../hooks/appearance";
import type { AppearanceConfig } from "../types";
import { defaultAppearanceConfig } from "../types";

interface AppearanceContextType {
  config: AppearanceConfig;
  updateConfig: (updates: Partial<AppearanceConfig>) => void;
  resetConfig: () => void;
  saveConfig: () => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  saving: boolean;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(
  undefined
);

export const AppearanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { settings, loading, saving, saveSettings } =
    useHotelAppearanceSettings();
  const [config, setConfig] = useState<AppearanceConfig>(
    defaultAppearanceConfig
  );

  // Load settings from database when available
  useEffect(() => {
    if (settings) {
      setConfig(settings);
    }
  }, [settings]);

  const updateConfig = (updates: Partial<AppearanceConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev };

      // Deep merge for nested objects
      if (updates.typography) {
        newConfig.typography = {
          ...prev.typography,
          ...updates.typography,
          fontSize: {
            ...prev.typography.fontSize,
            ...(updates.typography.fontSize || {}),
          },
          fontWeight: {
            ...prev.typography.fontWeight,
            ...(updates.typography.fontWeight || {}),
          },
        };
      }

      if (updates.colors) {
        newConfig.colors = {
          ...prev.colors,
          ...updates.colors,
          text: {
            ...prev.colors.text,
            ...(updates.colors.text || {}),
          },
        };
      }

      if (updates.stayCard) {
        newConfig.stayCard = {
          ...prev.stayCard,
          ...updates.stayCard,
        };
      }

      if (updates.aboutUs) {
        newConfig.aboutUs = {
          ...prev.aboutUs,
          ...updates.aboutUs,
        };
      }

      if (updates.icons) {
        newConfig.icons = {
          ...prev.icons,
          ...updates.icons,
        };
      }

      if (updates.shapes) {
        newConfig.shapes = {
          ...prev.shapes,
          ...updates.shapes,
        };
      }

      return newConfig;
    });
  };

  const resetConfig = () => {
    setConfig(defaultAppearanceConfig);
  };

  const saveConfig = async () => {
    return await saveSettings(config);
  };

  return (
    <AppearanceContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        saveConfig,
        loading,
        saving,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return context;
};

// Utility functions to convert config values to CSS
export const getIconSizeClass = (size: AppearanceConfig["icons"]["size"]) => {
  switch (size) {
    case "small":
      return "w-4 h-4";
    case "medium":
      return "w-5 h-5";
    case "large":
      return "w-6 h-6";
    default:
      return "w-5 h-5";
  }
};

export const getBorderRadiusClass = (
  radius: AppearanceConfig["shapes"]["borderRadius"]
) => {
  switch (radius) {
    case "none":
      return "rounded-none";
    case "small":
      return "rounded-sm";
    case "medium":
      return "rounded-lg";
    case "large":
      return "rounded-xl";
    default:
      return "rounded-lg";
  }
};

export const getCardStyleClass = (
  style: AppearanceConfig["shapes"]["cardStyle"]
) => {
  switch (style) {
    case "flat":
      return "shadow-none";
    case "elevated":
      return "shadow-md hover:shadow-lg";
    case "outlined":
      return "shadow-none border-2";
    default:
      return "shadow-md";
  }
};
