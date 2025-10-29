import React, { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { useToggleDND } from "../../../../hooks/guest-management/useToggleDND";

interface GuestHeaderProps {
  guestName: string;
  hotelName: string;
  roomNumber: string;
  guestId: string;
  dndStatus: boolean;
}

export const GuestHeader: React.FC<GuestHeaderProps> = ({
  guestName,
  hotelName,
  roomNumber,
  guestId,
  dndStatus: initialDndStatus,
}) => {
  const [dndStatus, setDndStatus] = useState(initialDndStatus);
  const toggleDND = useToggleDND();

  const handleDNDToggle = async () => {
    try {
      await toggleDND.mutateAsync({
        guestId,
        currentStatus: dndStatus,
      });
      setDndStatus(!dndStatus);
    } catch (error) {
      console.error("Failed to toggle DND status:", error);
    }
  };

  return (
    <header className="bg-white px-4 py-2.5 shadow-sm">
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
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          ></button>
          <button
            onClick={handleDNDToggle}
            disabled={toggleDND.isPending}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors border border-gray-300 ${
              dndStatus
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {dndStatus ? (
              <>
                <BellOff className="w-4 h-4" />
                DND On
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                DND Off
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
