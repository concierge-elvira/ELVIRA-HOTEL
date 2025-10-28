# Stat Cards Components

Reusable statistic card components for displaying key metrics and data.

## Components

### StatCard

A flexible card component for displaying a single statistic with an icon.

**Props:**

- `title`: string - The title/label for the stat
- `value`: string | number - The value to display
- `icon`: React.ReactNode - Icon component to display
- `variant?`: "default" | "primary" | "success" | "warning" | "danger" | "info" - Color variant (default: "default")
- `loading?`: boolean - Show loading skeleton (default: false)

**Example:**

```tsx
import { StatCard, MapPinIcon } from "@/components/shared/stat-cards";

<StatCard
  title="Total Places"
  value={125}
  icon={<MapPinIcon className="w-6 h-6 text-gray-600" />}
  variant="primary"
/>;
```

### CategoryBreakdownCard

A card component for displaying multiple category items with values.

**Props:**

- `title`: string - The card title
- `categories`: CategoryItem[] - Array of category items
  - `label`: string - Category name
  - `value`: number - Category count
  - `icon`: React.ReactNode - Category icon
  - `color`: string - Tailwind text color class (e.g., "text-blue-600")
- `loading?`: boolean - Show loading skeleton (default: false)

**Example:**

```tsx
import { CategoryBreakdownCard } from "@/components/shared/stat-cards";

<CategoryBreakdownCard
  title="By Category"
  categories={[
    {
      label: "Gastronomy",
      value: 45,
      icon: <ForkKnifeIcon />,
      color: "text-purple-600",
    },
    {
      label: "Tours",
      value: 32,
      icon: <MapIcon />,
      color: "text-blue-600",
    },
  ]}
/>;
```

### StatCardsGrid

A responsive grid container for stat cards.

**Props:**

- `children`: React.ReactNode - Card components to display
- `columns?`: 2 | 3 | 4 - Number of columns on desktop (default: 4)

**Example:**

```tsx
import { StatCardsGrid, StatCard } from "@/components/shared/stat-cards";

<StatCardsGrid columns={4}>
  <StatCard {...} />
  <StatCard {...} />
  <CategoryBreakdownCard {...} />
</StatCardsGrid>
```

## Icons

Pre-built SVG icons for common use cases:

- `MapPinIcon` - Location/place marker
- `CheckCircleIcon` - Success/approved state
- `ClockIcon` - Pending/time-related
- `ChartBarIcon` - Analytics/statistics

All icons accept a `className` prop for styling.

**Example:**

```tsx
import { CheckCircleIcon } from "@/components/shared/stat-cards";

<CheckCircleIcon className="w-6 h-6 text-emerald-600" />;
```

## Color Variants

StatCard supports these color variants for the value text:

- `default` - gray-900
- `primary` - emerald-600 (brand color)
- `success` - green-600
- `warning` - orange-600
- `danger` - red-600
- `info` - blue-600

## Complete Example

```tsx
import {
  StatCard,
  CategoryBreakdownCard,
  StatCardsGrid,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@/components/shared/stat-cards";

export function DashboardStats() {
  const stats = {
    total: 150,
    approved: 120,
    pending: 30,
    byCategory: {
      gastronomy: 50,
      tours: 40,
      wellness: 30,
    },
  };

  return (
    <StatCardsGrid columns={4}>
      <StatCard
        title="Total"
        value={stats.total}
        icon={<MapPinIcon className="w-6 h-6 text-gray-600" />}
      />

      <StatCard
        title="Approved"
        value={stats.approved}
        icon={<CheckCircleIcon className="w-6 h-6 text-emerald-600" />}
        variant="primary"
      />

      <StatCard
        title="Pending"
        value={stats.pending}
        icon={<ClockIcon className="w-6 h-6 text-orange-600" />}
        variant="warning"
      />

      <CategoryBreakdownCard
        title="By Category"
        categories={[
          {
            label: "Gastronomy",
            value: stats.byCategory.gastronomy,
            icon: <svg>...</svg>,
            color: "text-purple-600",
          },
          {
            label: "Tours",
            value: stats.byCategory.tours,
            icon: <svg>...</svg>,
            color: "text-blue-600",
          },
          {
            label: "Wellness",
            value: stats.byCategory.wellness,
            icon: <svg>...</svg>,
            color: "text-pink-600",
          },
        ]}
      />
    </StatCardsGrid>
  );
}
```

## Usage in Third-Party Management

See `ThirdPartyStatsCards.tsx` for a complete implementation example that:

- Fetches stats using a custom hook
- Shows loading states
- Displays total, approved, pending, and category breakdown
- Uses modern SVG icons instead of emojis

## File Structure

```
components/shared/stat-cards/
├── StatCard.tsx              # Main stat card component
├── CategoryBreakdownCard.tsx # Category breakdown component
├── StatCardsGrid.tsx         # Grid container
├── index.ts                  # Exports
└── icons/
    ├── MapPinIcon.tsx
    ├── CheckCircleIcon.tsx
    ├── ClockIcon.tsx
    ├── ChartBarIcon.tsx
    └── index.ts
```
