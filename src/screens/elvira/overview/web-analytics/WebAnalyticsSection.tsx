/**
 * Web Analytics Section
 *
 * This component displays Google Analytics metrics for the ELVIRA Hotel Management System.
 * It shows user behavior, page views, sessions, bounce rates, and other web analytics data.
 *
 * NOTE: Google Analytics integration requires:
 * - Google Analytics 4 (GA4) property setup
 * - Google Analytics Data API enabled
 * - Service account with Analytics Data API permissions
 * - This is DIFFERENT from the Google Places API
 */

interface WebAnalyticsSectionProps {
  hotelId: string | undefined;
}

export function WebAnalyticsSection({ hotelId }: WebAnalyticsSectionProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {/* Users Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">-</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Google Analytics integration required
          </p>
        </div>

        {/* Sessions Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">-</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Active user sessions</p>
        </div>

        {/* Page Views Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">-</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Total page views</p>
        </div>

        {/* Bounce Rate Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">-</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Percentage of single-page sessions
          </p>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex gap-4">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Google Analytics Integration Required
            </h3>
            <p className="text-sm text-blue-800 mb-4">
              To display web analytics data for{" "}
              {hotelId ? "this hotel" : "all hotels"}, you need to set up Google
              Analytics 4 (GA4) integration.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Required Setup:
                </h4>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Create a Google Analytics 4 property</li>
                  <li>
                    Enable Google Analytics Data API in Google Cloud Console
                  </li>
                  <li>
                    Create a service account with Analytics Data API permissions
                  </li>
                  <li>Download service account credentials JSON</li>
                  <li>Add GA4 Property ID to environment variables</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-blue-900 mb-1">Note:</h4>
                <p className="text-sm text-blue-800">
                  This requires a <strong>different Google API</strong> than the
                  Google Places API currently used for location services. The
                  Google Analytics Data API is specifically designed for
                  retrieving analytics data programmatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
