# Appearance Customization System

## Overview

The appearance system allows hotels to customize their guest dashboard with real-time preview updates.

## Architecture

### State Management

Uses React Context (`AppearanceContext`) to share configuration between:

- **Settings Panel** (left side) - controls to modify appearance
- **Preview Panel** (right side) - live preview of changes

### Components Structure

```
appearance/
├── contexts/
│   └── AppearanceContext.tsx       # Context provider & hook
├── settings/
│   ├── AppearanceSettings.tsx      # Main settings container
│   └── sections/
│       ├── TypographySettings.tsx  # Font family & sizes
│       ├── ColorSettings.tsx       # Brand & UI colors
│       ├── StayCardSettings.tsx    # Stay card appearance
│       ├── IconSettings.tsx        # Icon style & size
│       └── ShapeSettings.tsx       # Border radius & card style
├── preview/
│   ├── GuestDashboardPreview.tsx   # Main preview container
│   └── sections/
│       ├── PreviewHeader.tsx
│       ├── PreviewTicker.tsx
│       ├── PreviewRecommendedSection.tsx
│       ├── PreviewAboutUsSection.tsx
│       ├── PreviewPhotoGallerySection.tsx
│       ├── PreviewEmergencyContactsSection.tsx
│       └── PreviewBottomNav.tsx
└── AppearanceTab.tsx               # Main layout with provider

```

## Configuration Interface

```typescript
interface AppearanceConfig {
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      base: string;
      heading: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      inverse: string;
    };
  };
  stayCard: {
    gradientFrom: string;
    gradientTo: string;
    textColor: string;
    showAccessCode: boolean;
    layout: "compact" | "comfortable" | "spacious";
  };
  icons: {
    style: "outline" | "solid" | "rounded";
    size: "small" | "medium" | "large";
  };
  shapes: {
    borderRadius: "none" | "small" | "medium" | "large" | "full";
    cardStyle: "flat" | "elevated" | "outlined";
  };
}
```

## How It Works

### 1. Context Provider

`AppearanceTab.tsx` wraps everything with `<AppearanceProvider>`:

```tsx
<AppearanceProvider>
  <div className="grid grid-cols-2">
    <AppearanceSettings />
    <GuestDashboardPreview />
  </div>
</AppearanceProvider>
```

### 2. Settings Update Configuration

Settings sections use `useAppearance()` hook:

```tsx
const { config, updateConfig } = useAppearance();

// Update specific section
updateConfig({
  colors: { ...config.colors, primary: "#10b981" },
});
```

### 3. Preview Consumes Configuration

Preview components read from context:

```tsx
const { config } = useAppearance();

<div style={{
  fontFamily: config.typography.fontFamily,
  backgroundColor: config.colors.background,
  background: `linear-gradient(to bottom right,
    ${config.stayCard.gradientFrom},
    ${config.stayCard.gradientTo})`
}}>
```

### 4. Real-Time Updates

Changes flow automatically:

1. User changes setting in sidebar
2. `updateConfig()` updates context state
3. Preview re-renders with new values
4. Styles apply instantly

## Default Configuration

```typescript
const defaultAppearanceConfig: AppearanceConfig = {
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: { small: "0.875rem", base: "1rem", heading: "1.5rem" },
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  },
  colors: {
    primary: "#059669", // Emerald
    secondary: "#2563eb", // Blue
    accent: "#8b5cf6", // Purple
    background: "#f9fafb", // Gray 50
    surface: "#ffffff", // White
    text: {
      primary: "#111827", // Gray 900
      secondary: "#6b7280", // Gray 500
      inverse: "#ffffff", // White
    },
  },
  stayCard: {
    gradientFrom: "#059669", // Emerald 600
    gradientTo: "#047857", // Emerald 700
    textColor: "#ffffff",
    showAccessCode: true,
    layout: "comfortable",
  },
  icons: {
    style: "outline",
    size: "medium",
  },
  shapes: {
    borderRadius: "medium",
    cardStyle: "elevated",
  },
};
```

## Features Implemented

✅ **Typography Settings**

- Font family selection (Inter, Roboto, Open Sans, Poppins, Lato, Montserrat)
- Font sizes (small, base, heading)

✅ **Color Settings**

- Brand colors (primary, secondary, accent) with color pickers
- Background colors (background, surface)
- Text colors (primary, secondary, inverse)

✅ **Stay Card Settings**

- Gradient colors (from/to) with color pickers
- Text color
- Layout options (compact, comfortable, spacious)
- Toggle access code display

✅ **Icon Settings**

- Icon style (outline, solid, rounded)
- Icon size (small, medium, large)

✅ **Shape Settings**

- Border radius (none, small, medium, large, full)
- Card style (flat, elevated, outlined)

✅ **Real-Time Preview**

- Live updates when settings change
- Applied to stay card gradient
- Applied to background colors
- Applied to font family
- Applied to primary color on category cards

## Usage

```tsx
import { useAppearance } from "./contexts/AppearanceContext";

function MyComponent() {
  const { config, updateConfig, resetConfig } = useAppearance();

  // Read configuration
  const primaryColor = config.colors.primary;

  // Update configuration
  updateConfig({
    colors: { ...config.colors, primary: "#10b981" },
  });

  // Reset to defaults
  resetConfig();
}
```

## Next Steps (Future Enhancements)

- [ ] Persist configuration to Supabase database
- [ ] Load hotel-specific configuration on mount
- [ ] Add image upload for logo/background
- [ ] Add preview for different screen sizes
- [ ] Add export/import configuration
- [ ] Add preset themes
- [ ] Add undo/redo functionality
