import React from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";

interface GuestPlacesProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onClockClick?: () => void;
}

export const GuestPlaces: React.FC<GuestPlacesProps> = ({
  onNavigate,
  currentPath = "/guest/places",
  onClockClick,
}) => {
  const { guestSession } = useGuestAuth();

  if (!guestSession) {
    return null;
  }

  const { guestData, hotelData } = guestSession;

  return (
    <GuestPageLayout
      guestName={guestData.guest_name}
      hotelName={hotelData.name}
      roomNumber={guestData.room_number}
      guestId={guestData.id}
      dndStatus={guestData.dnd_status}
      hotelId={guestData.hotel_id}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onClockClick={onClockClick}
    >
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Places</h2>
        {/* Add your places content here */}
      </div>
    </GuestPageLayout>
  );
};
