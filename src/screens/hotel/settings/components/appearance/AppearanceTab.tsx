/**
 * Appearance Tab Component
 *
 * Settings tab for customizing hotel appearance and branding
 * Shows settings on the left and live preview on the right
 */

import React from "react";
import { GuestDashboardPreview } from "./GuestDashboardPreview";
import { AppearanceSettings } from "./settings/AppearanceSettings";

interface AppearanceTabProps {
  hotelName?: string;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ hotelName }) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Side - Settings (Independent scroll) */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-8">
        <AppearanceSettings />
      </div>

      {/* Right Side - Guest Dashboard Preview (only scrollable area) */}
      <div className="flex-1 flex flex-col border-l border-gray-200 bg-gray-50 overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
          <h3 className="text-sm font-semibold text-gray-700">
            Guest Dashboard Preview
          </h3>
        </div>

        {/* Scrollable Preview with hidden scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <GuestDashboardPreview hotelName={hotelName} />
        </div>
      </div>
    </div>
  );
};
