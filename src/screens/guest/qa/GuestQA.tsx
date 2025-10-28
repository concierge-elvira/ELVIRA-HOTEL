import React from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";

interface GuestQAProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const GuestQA: React.FC<GuestQAProps> = ({
  onNavigate,
  currentPath = "/guest/qa",
}) => {
  const { guestSession } = useGuestAuth();
  const { data: announcements } = useAnnouncements(
    guestSession?.guestData?.hotel_id
  );

  if (!guestSession) {
    return null;
  }

  const { guestData, hotelData } = guestSession;

  // Format announcements for ticker
  const activeAnnouncements =
    announcements
      ?.filter((a) => a.is_active)
      .map((a) => ({
        id: a.id,
        message: `${a.title} • ${a.description}`,
      })) || [];

  return (
    <GuestPageLayout
      guestName={guestData.guest_name}
      hotelName={hotelData.name}
      roomNumber={guestData.room_number}
      guestId={guestData.id}
      dndStatus={guestData.dnd_status}
      announcements={activeAnnouncements}
      currentPath={currentPath}
      onNavigate={onNavigate}
    >
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Q&A</h2>
        {/* Add your Q&A content here */}
      </div>
    </GuestPageLayout>
  );
};
