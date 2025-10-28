/**
 * Preview Header Component
 *
 * Shows a placeholder for the guest header
 */

import React from "react";
import { Bell } from "lucide-react";
import { useAppearance } from "./contexts/AppearanceContext";

interface PreviewHeaderProps {
  guestName?: string;
  hotelName?: string;
  roomNumber?: string;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  guestName = "Guest",
  hotelName = "Hotel Name",
  roomNumber = "101",
}) => {
  const { config } = useAppearance();

  return (
    <header className="px-4 py-4 shadow-sm bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1
            className="font-semibold"
            style={{
              fontSize: config.typography.fontSize.heading,
              fontWeight: config.typography.fontWeight.semibold,
              color: config.colors.text.primary,
            }}
          >
            Welcome, {guestName}
          </h1>
          <p
            className="mt-1"
            style={{
              fontSize: config.typography.fontSize.small,
              color: config.colors.text.secondary,
            }}
          >
            {hotelName} • Room {roomNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* DND button keeps original styling - not affected by appearance settings */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
            disabled
          >
            <Bell className="w-4 h-4" />
            <span>DND Off</span>
          </button>
        </div>
      </div>
    </header>
  );
};
