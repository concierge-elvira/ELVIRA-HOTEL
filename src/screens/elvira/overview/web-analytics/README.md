# Web Analytics Structure

This directory contains all web analytics related components and logic for the ELVIRA dashboard.

## Directory Structure

```
web-analytics/
├── WebAnalyticsSection.tsx    # Main web analytics display component
├── index.ts                    # Exports
├── charts/                     # Analytics charts (to be created)
│   ├── UserTrendChart.tsx
│   ├── SessionsChart.tsx
│   └── TrafficSourcesChart.tsx
└── cards/                      # Metric cards (to be created)
    ├── UserMetricsCard.tsx
    ├── SessionMetricsCard.tsx
    └── BehaviorMetricsCard.tsx
```

## Related Directories

### Hooks (`src/hooks/web-analytics/`)

Custom React hooks for fetching analytics data:

- `useWebAnalytics.ts` - Main analytics data hook
- `usePageViews.ts` - Page views metrics
- `useUserMetrics.ts` - User engagement metrics
- `useSessionData.ts` - Session analytics

### Services (`src/services/web-analytics/`)

Google Analytics API integration:

- `googleAnalytics.ts` - GA4 client setup
- `analyticsQueries.ts` - Reusable GA4 queries
- `types.ts` - TypeScript types for analytics data

## Setup Required

See `docs/GOOGLE_ANALYTICS_SETUP.md` for complete setup instructions.

## Usage

```tsx
import { WebAnalyticsSection } from "./web-analytics";

<WebAnalyticsSection hotelId={selectedHotelId} />;
```

## Next Steps

1. ✅ Create folder structure
2. ✅ Create placeholder component
3. ✅ Add documentation
4. ⏳ Set up Google Analytics 4
5. ⏳ Implement analytics service
6. ⏳ Create data fetching hooks
7. ⏳ Build analytics charts
8. ⏳ Add real-time data display
