# Analytics Dashboard System

## Overview

The hotel analytics dashboard provides comprehensive insights into guest behavior, revenue streams, and operational performance using modern, responsive charts and visualizations.

## Architecture

### Folder Structure

```
src/
├── components/
│   └── analytics/
│       ├── charts/           # Reusable chart components
│       │   ├── LineChart.tsx
│       │   ├── BarChart.tsx
│       │   ├── AreaChart.tsx
│       │   ├── PieChart.tsx
│       │   └── index.ts
│       ├── cards/            # Card wrapper components
│       │   ├── AnalyticsCard.tsx
│       │   ├── StatCard.tsx
│       │   └── index.ts
│       ├── constants.ts      # Chart colors and themes
│       └── index.ts
├── hooks/
│   └── analytics/            # Data fetching hooks
│       ├── useGuestAnalytics.ts
│       ├── useRevenueAnalytics.ts
│       ├── useOperationsAnalytics.ts
│       └── index.ts
├── screens/hotel/overview/
│   ├── analytics/            # Analytics sections
│   │   ├── GuestAnalyticsSection.tsx
│   │   ├── RevenueAnalyticsSection.tsx
│   │   ├── OperationsAnalyticsSection.tsx
│   │   └── index.ts
│   └── Overview.tsx          # Main dashboard page
└── types/
    └── analytics.ts          # TypeScript type definitions
```

## Features

### Guest Analytics

- **Metrics**: Total guests, active guests, new registrations, satisfaction scores
- **Visualizations**:
  - Guest growth trend (line chart)
  - Guest distribution (pie chart)
- **Data**: 30-day historical trends, guest demographics

### Revenue Analytics

- **Metrics**: Total revenue, monthly revenue, revenue by source
- **Visualizations**:
  - Revenue trend (area chart)
  - Revenue by source (pie chart)
  - Revenue streams over time (stacked area chart)
- **Sources**: Restaurant, Shop, Amenities

### Operations Analytics

- **Metrics**: Total orders, pending orders, completion rate, processing time
- **Visualizations**:
  - Orders by type (bar chart)
  - Order trends (multi-line chart)
- **Categories**: Restaurant orders, shop orders, amenity requests

## Chart Components

### LineChart

```tsx
<LineChart
  data={trendData}
  dataKeys={[{ key: "value", name: "Guests", color: "#059669" }]}
  xAxisKey="date"
  height={300}
  curved
/>
```

### BarChart

```tsx
<BarChart
  data={orderData}
  dataKeys={[{ key: "count", name: "Orders" }]}
  xAxisKey="type"
  height={300}
  stacked={false}
/>
```

### AreaChart

```tsx
<AreaChart
  data={revenueData}
  dataKeys={[
    { key: "restaurant", name: "Restaurant", color: "#f97316" },
    { key: "shop", name: "Shop", color: "#8b5cf6" },
  ]}
  xAxisKey="date"
  height={350}
  stacked
/>
```

### PieChart

```tsx
<PieChart
  data={[
    { name: "Individual", value: 150, color: "#3b82f6" },
    { name: "Group", value: 50, color: "#8b5cf6" },
  ]}
  height={300}
  donut
/>
```

## Card Components

### StatCard

Displays a single KPI with optional trend indicator:

```tsx
<StatCard
  title="Total Guests"
  value={1234}
  icon={<Users />}
  change={12.5}
  changeLabel="vs last month"
  color="#059669"
/>
```

### AnalyticsCard

Wrapper for charts with title and optional actions:

```tsx
<AnalyticsCard
  title="Guest Growth Trend"
  subtitle="New guests over the last 30 days"
>
  <LineChart {...chartProps} />
</AnalyticsCard>
```

## Data Hooks

### useGuestAnalytics

```tsx
const { data, isLoading } = useGuestAnalytics(hotelId);
// Returns: { analytics, demographics, trends }
```

### useRevenueAnalytics

```tsx
const { data, isLoading } = useRevenueAnalytics(hotelId);
// Returns: { analytics, bySource, trends }
```

### useOperationsAnalytics

```tsx
const { data, isLoading } = useOperationsAnalytics(hotelId);
// Returns: { operations, orders, trends }
```

## Customization

### Chart Colors

Modify `src/components/analytics/constants.ts` to customize chart colors:

```typescript
export const CHART_COLORS = {
  primary: "#059669",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  // ... more colors
};
```

### Adding New Analytics Sections

1. Create data types in `src/types/analytics.ts`
2. Create hook in `src/hooks/analytics/`
3. Create section component in `src/screens/hotel/overview/analytics/`
4. Add tab to Overview.tsx

## Performance

- Uses React Query for caching and automatic refetching
- Configurable stale times (5 minutes default)
- Optimized queries with proper filtering
- Responsive charts that adapt to container size

## Technologies

- **Charts**: Recharts (React charting library)
- **Data Fetching**: React Query (@tanstack/react-query)
- **Database**: Supabase
- **Styling**: CSS-in-JS with theme system
- **Icons**: Lucide React

## Future Enhancements

- [ ] Export analytics data to CSV/PDF
- [ ] Custom date range filters
- [ ] Real-time analytics updates
- [ ] Comparison views (current vs previous period)
- [ ] Predictive analytics
- [ ] Customizable dashboard layouts
