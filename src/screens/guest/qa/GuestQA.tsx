import React, { useMemo } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { useGuestQARecommendations } from "../../../hooks/guest-management/qa";
import { QACategoryAccordion, AskQuestion } from "./components";

interface GuestQAProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onClockClick?: () => void;
}

export const GuestQA: React.FC<GuestQAProps> = ({
  onNavigate,
  currentPath = "/guest/qa",
  onClockClick,
}) => {
  const { guestSession } = useGuestAuth();

  // Fetch Q&A recommendations
  const { data: qaRecommendations = [], isLoading } = useGuestQARecommendations(
    guestSession?.guestData?.hotel_id
  );

  // Group Q&A by category
  const groupedQA = useMemo(() => {
    const groups: Record<string, typeof qaRecommendations> = {};

    qaRecommendations.forEach((qa) => {
      const category = qa.category || "GENERAL INFO";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(qa);
    });

    return groups;
  }, [qaRecommendations]);

  if (!guestSession) {
    return null;
  }

  const { guestData, hotelData } = guestSession;

  const handleBackClick = () => {
    if (onNavigate) {
      onNavigate("/guest/home");
    }
  };

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
      {/* Ask Question Section - Full width, no margins */}
      <AskQuestion hotelId={guestData.hotel_id} onBackClick={handleBackClick} />

      <div className="px-4 py-6">
        {/* Browse Common Questions Header */}
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Or browse common questions:
          </h3>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">Loading questions...</p>
          </div>
        ) : Object.keys(groupedQA).length === 0 ? (
          /* Empty State */
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              No common questions available at the moment.
            </p>
          </div>
        ) : (
          /* Q&A Categories */
          <div className="space-y-2 pb-20">
            {Object.entries(groupedQA).map(([category, items]) => (
              <QACategoryAccordion
                key={category}
                category={category}
                items={items}
              />
            ))}
          </div>
        )}
      </div>
    </GuestPageLayout>
  );
};
