import React from "react";
import { GuestHeader } from "../header";
import { GuestBottomNav } from "../navigation";
import { AnnouncementTicker } from "../announcements";
import { FloatingWidgetMenu } from "../../../../components/guest/floating-widget";

interface GuestPageLayoutProps {
  guestName: string;
  hotelName: string;
  roomNumber: string;
  guestId: string;
  dndStatus: boolean;
  announcements?: Array<{ id: string; message: string }>;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  children: React.ReactNode;
  headerSlot?: React.ReactNode; // Optional slot for search bar or other sticky elements
  onClockClick?: () => void; // Callback for clock/room service button
  onMessageClick?: () => void; // Callback for message button
  hasNotifications?: boolean; // Show notification badge on bell
}

export const GuestPageLayout: React.FC<GuestPageLayoutProps> = ({
  guestName,
  hotelName,
  roomNumber,
  guestId,
  dndStatus,
  announcements = [],
  currentPath,
  onNavigate,
  children,
  headerSlot,
  onClockClick,
  onMessageClick,
  hasNotifications = false,
}) => {
  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Fixed Header Section (Header + Ticker + Optional Search/Filter) */}
      <div className="shrink-0 z-50 bg-white shadow-sm">
        {/* Header */}
        <GuestHeader
          guestName={guestName}
          hotelName={hotelName}
          roomNumber={roomNumber}
          guestId={guestId}
          dndStatus={dndStatus}
        />

        {/* Announcements Ticker */}
        {announcements.length > 0 && (
          <AnnouncementTicker announcements={announcements} />
        )}

        {/* Optional Header Slot (e.g., Search Bar) */}
        {headerSlot}
      </div>

      {/* Main Content - Scrollable area with padding for fixed bottom nav */}
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>

      {/* Floating Widget Menu - Bell with Clock and Message buttons */}
      <FloatingWidgetMenu
        onClockClick={onClockClick}
        onMessageClick={onMessageClick}
        hasNotifications={hasNotifications}
      />

      {/* Bottom Navigation - Fixed at bottom */}
      <GuestBottomNav currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  );
};
