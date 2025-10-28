# Appearance Settings - Project Structure

## Overview

The appearance settings system allows hotel administrators to customize the guest dashboard's visual appearance through an intuitive interface with live preview.

## Folder Structure

```
appearance/
├── settings/                          # Settings components
│   ├── AppearanceSettings.tsx        # Main settings container
│   └── sections/                     # Individual setting sections
│       ├── TypographySettings.tsx    # Font family, sizes, weights
│       ├── ColorSettings.tsx         # Brand colors, backgrounds, text colors
│       ├── StayCardSettings.tsx      # Stay details card customization
│       ├── IconSettings.tsx          # Icon style and size
│       ├── ShapeSettings.tsx         # Border radius, card styles
│       └── index.ts                  # Section exports
├── preview/                          # Preview components (existing)
│   ├── PreviewHeader.tsx
│   ├── PreviewTicker.tsx
│   ├── PreviewBottomNav.tsx
│   ├── PreviewRecommendedSection.tsx
│   ├── PreviewAboutUsSection.tsx
│   ├── PreviewPhotoGallerySection.tsx
│   └── PreviewEmergencyContactsSection.tsx
├── AppearanceTab.tsx                 # Main tab component (split view)
├── GuestDashboardPreview.tsx         # Preview container
└── index.ts                          # Main exports
```

## Component Descriptions

### Settings Components

#### `AppearanceSettings.tsx`

Main container for all appearance customization options. Manages the complete appearance configuration state and provides callbacks for updates.

**Features:**

- Centralized configuration management
- Reset to default functionality
- Apply changes button
- Organized into logical sections

#### Setting Sections

1. **TypographySettings.tsx**

   - Font family selection (Inter, Roboto, Open Sans, etc.)
   - Font sizes (small, base, heading)
   - Font weights (normal, medium, semibold, bold)

2. **ColorSettings.tsx**

   - Brand colors (primary, secondary, accent)
   - Background colors (background, surface/cards)
   - Text colors (primary, secondary, inverse)
   - Color picker + hex input for each

3. **StayCardSettings.tsx**

   - Gradient background (from/to colors)
   - Text color customization
   - Layout options (compact, comfortable, spacious)
   - Show/hide access code toggle

4. **IconSettings.tsx**

   - Icon style (outline, solid, rounded)
   - Icon size (small, medium, large)

5. **ShapeSettings.tsx**
   - Border radius (none, small, medium, large, full)
   - Card style (flat, elevated, outlined)

### Preview Components

Located in the preview folder (to be organized):

- Header preview with DND button
- Announcement ticker with scrolling animation
- Bottom navigation with badges
- Section previews (recommended, about us, photo gallery, emergency contacts)

## Configuration Interface

```typescript
interface AppearanceConfig {
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

## Usage

```tsx
import { AppearanceTab } from "./components/appearance";

// In your settings component
<AppearanceTab hotelName="Your Hotel Name" />;
```

The component automatically handles:

- Split-screen layout (settings left, preview right)
- Independent scrolling for each side
- Sticky preview title
- Real-time preview updates (to be connected)

## Future Enhancements

- [ ] Connect settings to preview in real-time
- [ ] Save configuration to database
- [ ] Load hotel-specific configuration
- [ ] Export/import themes
- [ ] Preset theme templates
- [ ] Advanced CSS customization
- [ ] Animation settings
- [ ] Spacing/padding controls
- [ ] Shadow customization
