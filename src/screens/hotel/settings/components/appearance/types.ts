/**
 * Appearance Configuration Types
 *
 * Shared types for appearance customization
 */

export interface AppearanceConfig {
  typography: {
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
  };
  colors: {
    primary: string;
    text: {
      primary: string;
      secondary: string;
      inverse: string;
    };
  };
  stayCard: {
    gradientFrom: string;
    gradientTo: string;
  };
  aboutUs: {
    backgroundColor: string;
  };
  icons: {
    size: "small" | "medium" | "large";
  };
  shapes: {
    borderRadius: "none" | "small" | "medium" | "large";
    cardStyle: "flat" | "elevated" | "outlined";
  };
}

export const defaultAppearanceConfig: AppearanceConfig = {
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: {
      base: "14px", // text-sm (0.875rem = 14px)
      heading: "16px", // text-base (1rem = 16px)
      small: "12px", // text-xs (0.75rem = 12px)
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  colors: {
    primary: "#2563eb", // blue-600 - used in category menu, bottom nav, links
    text: {
      primary: "#111827", // gray-900 - main text
      secondary: "#6b7280", // gray-600 - secondary text
      inverse: "#ffffff", // white - text on dark backgrounds
    },
  },
  stayCard: {
    gradientFrom: "#3b82f6", // blue-500 - start of gradient
    gradientTo: "#9333ea", // purple-600 - end of gradient
  },
  aboutUs: {
    backgroundColor: "#111827", // gray-900 - dark background
  },
  icons: {
    size: "medium", // w-5 h-5 (20px)
  },
  shapes: {
    borderRadius: "large", // rounded-xl for stay card
    cardStyle: "elevated", // shadow-sm hover:shadow-md
  },
};
