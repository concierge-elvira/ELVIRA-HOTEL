/**
 * Preview Header Component
 *
 * Shows a placeholder for the guest header
 */

import React from "react";
import { Bell } from "lucide-react";

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
  return (
    <header className="bg-white px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">
            Welcome, {guestName}
          </h1>
          <p className="text-sm text-gray-600">
            {hotelName} • Room {roomNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-600"
            disabled
          >
            <Bell className="w-4 h-4" />
            DND Off
          </button>
        </div>
      </div>
    </header>
  );
};
