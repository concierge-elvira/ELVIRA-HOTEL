# Google Analytics Integration for ELVIRA

## Your GA4 Property Details

- **Property ID**: `12352740513`
- **Property Name**: Elvira Digital Concierge
- **Website URL**: https://www.elviradc.com
- **Measurement ID**: G-DEM4BME2YK

## Overview

This document explains how to integrate Google Analytics 4 (GA4) with the ELVIRA Hotel Management System to track user behavior and web analytics metrics.

## Important Note

**Google Analytics Data API is DIFFERENT from Google Places API:**
- **Google Places API**: Used for location services, nearby places, maps (already implemented)
- **Google Analytics Data API**: Used for retrieving web analytics data (needs to be implemented)
- **Google Analytics Admin API**: Used for managing GA4 properties (you already enabled this)

These are separate APIs and require separate credentials and setup.

## Setup Steps

### 1. ✅ Create Google Analytics 4 Property (COMPLETED)

You already have:
- GA4 Property ID: `12352740513`
- Measurement ID: `G-DEM4BME2YK`
- Web stream configured for: https://www.elviradc.com

### 2. Enable Google Analytics Data API (REQUIRED)

**IMPORTANT: This is different from the Admin API you already enabled!**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your "ELVIRA" project
3. Navigate to **APIs & Services > Library**
4. Search for **"Google Analytics Data API"** (not Admin API)
5. Click **Enable**

### 3. Create Service Account (NEXT STEP)

1. In Google Cloud Console, go to **APIs & Services > Credentials**
2. Click **Create Credentials > Service Account**
3. Fill in the details:
   - **Service account name**: `elvira-analytics-reader`
   - **Service account ID**: `elvira-analytics-reader`
   - **Description**: "Read-only access to GA4 data for ELVIRA dashboard"
4. Click **Create and Continue**
5. **Grant this service account access to project**:
   - Select role: **Viewer**
6. Click **Continue** and then **Done**

### 4. Generate Service Account Key

1. Click on the created service account (`elvira-analytics-reader@...`)
2. Go to **Keys** tab
3. Click **Add Key > Create New Key**
4. Choose **JSON** format
5. Click **Create**
6. Download the JSON file
7. **IMPORTANT**: Keep this file secure! Never commit it to Git!

### 5. Grant Analytics Access to Service Account

**This is crucial - the service account needs permission to read your GA4 data:**

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property: **Elvira Digital Concierge**
3. Click **Admin** (gear icon in bottom left)
4. Under **Property** column, click **Property Access Management**
5. Click the **+** button or **Add users**
6. Enter the service account email (will be like: `elvira-analytics-reader@elvira-xxxxxx.iam.gserviceaccount.com`)
7. Select role: **Viewer**
8. Click **Add**

### 6. Configure Environment Variables

Create/update your `.env.local` file:

```bash
# Google Analytics Configuration
VITE_GA4_PROPERTY_ID=12352740513
VITE_GA4_MEASUREMENT_ID=G-DEM4BME2YK

# Service Account Credentials (paste the entire JSON content here)
VITE_GA4_CREDENTIALS={"type":"service_account","project_id":"elvira-xxxxxx","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"elvira-analytics-reader@elvira-xxxxxx.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Security Note**: Add `.env.local` to your `.gitignore` file!

### 7. Install Required Packages

```bash
npm install @google-analytics/data
```

### 8. Verify GA4 Tracking is Active

⚠️ **Important Notice**: Your screenshot shows "La recogida de datos en tu sitio web no está activada" (Data collection is not activated)

You need to install the GA4 tracking code in your application:

#### Option A: Using gtag.js (Recommended)

Add this to your `index.html` in the `<head>` section:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DEM4BME2YK"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-DEM4BME2YK');
</script>
```

#### Option B: Using react-ga4 library

```bash
npm install react-ga4
```

Then in your `src/main.tsx`:

```typescript
import ReactGA from "react-ga4";

ReactGA.initialize("G-DEM4BME2YK");
```

## Implementation Structure

```
src/
├── services/
│   └── web-analytics/
│       ├── googleAnalytics.ts       # GA4 API client
│       └── analyticsQueries.ts      # Common GA4 queries
├── hooks/
│   └── web-analytics/
│       ├── useWebAnalytics.ts       # Main analytics hook
│       ├── usePageViews.ts          # Page views data
│       ├── useUserMetrics.ts        # User metrics
│       └── useSessionData.ts        # Session data
└── screens/
    └── elvira/
        └── overview/
            └── web-analytics/
                ├── WebAnalyticsSection.tsx
                ├── charts/
                └── cards/
```

## Metrics Available

### User Metrics
- Total Users
- New Users
- Active Users
- User Demographics (age, gender, location)

### Engagement Metrics
- Sessions
- Page Views
- Pages per Session
- Average Session Duration
- Bounce Rate

### Traffic Sources
- Organic Search
- Direct Traffic
- Referral Traffic
- Social Media Traffic

### Behavior Flow
- Top Pages
- Entry Pages
- Exit Pages
- User Journey Paths

## API Rate Limits

- **Quota**: 50,000 requests per day per property
- **Concurrent requests**: 10 requests per second
- **Cost**: Free tier covers most use cases

## Security Best Practices

1. ✅ **Never commit** service account credentials to version control
2. ✅ **Use environment variables** for sensitive data
3. ✅ **Restrict service account** to read-only access (Viewer role)
4. ✅ **Rotate credentials** periodically
5. ✅ **Monitor API usage** in Google Cloud Console
6. ✅ **Add `.env.local` to `.gitignore`**

## Example Query

```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: JSON.parse(import.meta.env.VITE_GA4_CREDENTIALS!)
});

const [response] = await analyticsDataClient.runReport({
  property: `properties/12352740513`,
  dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'date' }],
  metrics: [
    { name: 'activeUsers' },
    { name: 'sessions' },
    { name: 'pageviews' }
  ]
});
```

## Hotel-Specific Filtering

To track analytics per hotel in ELVIRA:

1. **Add Custom Dimension in GA4**:
   - Go to GA4 Admin → Data display → Custom definitions
   - Create custom dimension: `hotel_name` or `hotel_id`

2. **Update Tracking Code**:
```typescript
ReactGA.event({
  category: 'hotel',
  action: 'view',
  label: hotelName,
  dimension1: hotelId // Custom dimension
});
```

3. **Filter in Queries**:
```typescript
dimensionFilter: {
  filter: {
    fieldName: 'customEvent:hotel_id',
    stringFilter: { value: selectedHotelId }
  }
}
```

## Checklist

- [ ] Enable Google Analytics Data API in Google Cloud
- [ ] Create service account `elvira-analytics-reader`
- [ ] Download service account JSON key
- [ ] Grant Viewer access to service account in GA4
- [ ] Add credentials to `.env.local`
- [ ] Add `.env.local` to `.gitignore`
- [ ] Install `@google-analytics/data` package
- [ ] Install GA4 tracking code in application (gtag.js or react-ga4)
- [ ] Verify data collection is active in GA4
- [ ] Test API connection with a simple query

## Resources

- [GA4 Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [GA4 Node.js Client Library](https://github.com/googleapis/nodejs-analytics-data)
- [GA4 Metrics & Dimensions](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [React GA4 Library](https://github.com/PriceRunner/react-ga4)

## Next Steps

1. ✅ **Complete Step 2**: Enable Google Analytics Data API
2. ✅ **Complete Step 3-5**: Create and configure service account
3. ✅ **Complete Step 6**: Add credentials to environment variables
4. ✅ **Complete Step 7**: Install required packages
5. ✅ **Complete Step 8**: Install GA4 tracking code
6. ✅ Test the implementation with a simple data fetch