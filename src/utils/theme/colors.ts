/**
 * Centralized Theme System for ELVIRA Dashboard
 * Modern SaaS design with emerald green primary and gray neutrals
 */

// ==================== COLORS ====================

export const colors = {
  // Primary Brand Colors (Emerald Green)
  primary: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  // Neutral Grays
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Semantic Colors
  success: {
    light: "#d1fae5",
    DEFAULT: "#10b981",
    dark: "#047857",
  },
  warning: {
    light: "#fef3c7",
    DEFAULT: "#f59e0b",
    dark: "#d97706",
  },
  error: {
    light: "#fee2e2",
    DEFAULT: "#ef4444",
    dark: "#dc2626",
  },
  info: {
    light: "#dbeafe",
    DEFAULT: "#3b82f6",
    dark: "#2563eb",
  },

  // Background & Surface
  background: {
    main: "#f9fafb", // gray-50
    card: "#ffffff",
    elevated: "#ffffff",
  },

  // Text Colors
  text: {
    primary: "#111827", // gray-900
    secondary: "#6b7280", // gray-500
    tertiary: "#9ca3af", // gray-400
    inverse: "#ffffff",
  },

  // Border Colors
  border: {
    light: "#f3f4f6", // gray-100
    DEFAULT: "#e5e7eb", // gray-200
    dark: "#d1d5db", // gray-300
  },
} as const;

// ==================== TYPOGRAPHY ====================

export const typography = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

// ==================== SPACING ====================

export const spacing = {
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
} as const;

// ==================== BORDER RADIUS ====================

export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// ==================== SHADOWS ====================

export const shadows = {
  sm: "0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  DEFAULT:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  md: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  "2xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
} as const;

// ==================== TRANSITIONS ====================

export const transitions = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  DEFAULT: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// ==================== COMPONENT-SPECIFIC STYLES ====================

/**
 * Sidebar specific colors and styles
 */
export const sidebarColors = {
  background: "linear-gradient(to bottom, #059669, #047857)", // primary-600 to primary-700
  backgroundRgba: "rgba(5, 150, 105, 0.95)",
  text: "rgba(255, 255, 255, 0.9)",
  textHover: "rgba(255, 255, 255, 1)",
  textMuted: "rgba(255, 255, 255, 0.7)",
  active: "#ffffff",
  activeBg: "#ffffff",
  activeText: "#047857", // primary-700
  hoverBg: "rgba(255, 255, 255, 0.1)",
  border: "rgba(255, 255, 255, 0.1)",
} as const;

/**
 * Card styles
 */
export const cardStyles = {
  background: colors.background.card,
  border: colors.border.DEFAULT,
  borderRadius: borderRadius.xl,
  padding: spacing[6],
  shadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  shadowHover:
    "0 12px 24px -4px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.08)",
} as const;

/**
 * Button base styles
 */
export const buttonStyles = {
  borderRadius: borderRadius.lg,
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  padding: {
    sm: `${spacing[2]} ${spacing[3]}`,
    md: `${spacing[2.5]} ${spacing[4]}`,
    lg: `${spacing[3]} ${spacing[6]}`,
  },
  transition: transitions.DEFAULT,
} as const;

/**
 * Input/Form field styles
 */
export const inputStyles = {
  borderRadius: borderRadius.lg,
  fontSize: typography.fontSize.sm,
  padding: `${spacing[2.5]} ${spacing[3.5]}`,
  border: `1px solid ${colors.border.DEFAULT}`,
  borderFocus: colors.primary[500],
  background: colors.background.card,
  transition: transitions.DEFAULT,
} as const;

/**
 * Table styles
 */
export const tableStyles = {
  headerBg: colors.gray[50],
  headerText: colors.text.secondary,
  headerFontSize: typography.fontSize.xs,
  headerFontWeight: typography.fontWeight.semibold,
  rowBorder: colors.border.DEFAULT,
  rowHoverBg: colors.gray[50],
  cellPadding: `${spacing[4]} ${spacing[6]}`,
  fontSize: typography.fontSize.sm,
} as const;

/**
 * Page header styles
 */
export const pageHeaderStyles = {
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: "-0.025em",
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal,
  },
  marginBottom: spacing[8],
} as const;

// ==================== COMMON CSS-IN-JS HELPERS ====================

/**
 * Helper function to create card styles
 */
export const getCardStyle = (elevated = false): React.CSSProperties => ({
  backgroundColor: cardStyles.background,
  border: `1px solid ${cardStyles.border}`,
  borderRadius: cardStyles.borderRadius,
  padding: cardStyles.padding,
  boxShadow: elevated ? cardStyles.shadowHover : cardStyles.shadow,
  transition: transitions.DEFAULT,
});

/**
 * Helper function to create button styles
 */
export const getButtonStyle = (
  variant: "primary" | "secondary" | "danger" = "primary",
  size: "sm" | "md" | "lg" = "md"
): React.CSSProperties => {
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary[600],
      color: colors.text.inverse,
      border: "none",
    },
    secondary: {
      backgroundColor: colors.background.card,
      color: colors.text.primary,
      border: `1px solid ${colors.border.DEFAULT}`,
    },
    danger: {
      backgroundColor: colors.error.DEFAULT,
      color: colors.text.inverse,
      border: "none",
    },
  };

  return {
    ...variantStyles[variant],
    borderRadius: buttonStyles.borderRadius,
    fontSize: buttonStyles.fontSize,
    fontWeight: buttonStyles.fontWeight,
    padding: buttonStyles.padding[size],
    transition: buttonStyles.transition,
    cursor: "pointer",
  };
};

/**
 * Helper function for page container
 */
export const getPageContainerStyle = (): React.CSSProperties => ({
  padding: spacing[6],
  backgroundColor: colors.background.main,
  minHeight: "100vh",
});

/**
 * Helper function for text styles
 */
export const getTextStyle = (
  variant: "h1" | "h2" | "h3" | "body" | "caption" = "body"
): React.CSSProperties => {
  const variants = {
    h1: {
      fontSize: typography.fontSize["3xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      lineHeight: typography.lineHeight.tight,
    },
    h2: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      lineHeight: typography.lineHeight.tight,
    },
    h3: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      lineHeight: typography.lineHeight.normal,
    },
    body: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      color: colors.text.primary,
      lineHeight: typography.lineHeight.normal,
    },
    caption: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      color: colors.text.secondary,
      lineHeight: typography.lineHeight.normal,
    },
  };

  return {
    ...variants[variant],
    fontFamily: typography.fontFamily.sans,
  };
};
