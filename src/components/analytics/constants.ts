/**
 * Chart configuration and color constants
 */

import { colors } from "../../utils/theme";

// Chart color palette
export const CHART_COLORS = {
  primary: colors.primary[600],
  secondary: colors.primary[400],
  blue: "#3b82f6",
  purple: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
  yellow: "#eab308",
  red: "#ef4444",
  teal: "#14b8a6",
  indigo: "#6366f1",
  green: colors.primary[500],
} as const;

export const DEFAULT_CHART_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.orange,
  CHART_COLORS.pink,
  CHART_COLORS.yellow,
  CHART_COLORS.teal,
  CHART_COLORS.indigo,
];

// Chart grid and axis colors
export const CHART_THEME = {
  gridColor: "#e5e7eb",
  axisColor: colors.text.tertiary,
  tooltipBg: "white",
  tooltipBorder: colors.border.light,
  tooltipShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  labelColor: colors.text.primary,
} as const;
