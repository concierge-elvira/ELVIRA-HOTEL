/**
 * Appearance Tab Component
 *
 * Settings tab for customizing hotel appearance and branding
 * Shows settings on the left and live preview on the right
 */

import React from "react";
import { GuestDashboardPreview } from "./GuestDashboardPreview";

interface AppearanceTabProps {
  hotelName?: string;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ hotelName }) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Side - Settings (Independent scroll) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Appearance Settings
            </h3>
            <p className="text-gray-600">
              Customize your hotel's appearance and branding
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Guest Dashboard Preview with separate scroll container */}
      <div className="flex-1 flex flex-col border-l border-gray-200 bg-gray-50 h-[calc(100vh-4rem)] overflow-hidden">

        {/* Preview Title - Fixed at top */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
          <h3 className="text-sm font-semibold text-gray-700">
            Guest Dashboard Preview
          </h3>
        </div>

        {/* Scrollable Preview Content */}
        <div className="flex-1 overflow-y-auto">
          <GuestDashboardPreview hotelName={hotelName} />
        </div>
      </div>
    </div>
  );
};
