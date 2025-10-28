/**
 * Preview Announcement Ticker Component
 *
 * Shows a placeholder for the announcement ticker
 * Ticker styling is fixed - only velocity could be customizable in the future
 */

import React from "react";

export const PreviewTicker: React.FC = () => {
  const mockAnnouncement =
    "Welcome to our hotel! Special offer: 20% off spa services this week  •  Breakfast served 7-10 AM daily  •  Pool hours: 6 AM - 10 PM";

  return (
    <div className="bg-gray-900 py-2.5 overflow-hidden">
      <style>
        {`
          @keyframes ticker-scroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .ticker-animate {
            animation: ticker-scroll 40s linear infinite;
          }
        `}
      </style>
      <div className="relative flex">
        <div className="flex ticker-animate">
          <span className="text-white text-sm font-medium whitespace-nowrap px-4">
            {mockAnnouncement}
          </span>
          <span className="text-white text-sm font-medium whitespace-nowrap px-4">
            {mockAnnouncement}
          </span>
        </div>
      </div>
    </div>
  );
};
