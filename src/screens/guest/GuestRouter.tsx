import React, { useState } from "react";
import { GuestHome } from "./home";
import { GuestShop } from "./shop";
import { GuestAmenities } from "./amenities";
import { GuestRestaurant } from "./restaurant";
import { GuestQA } from "./qa";
import { GuestPlaces } from "./places";
import { GuestTours } from "./tours";
import { GuestWellness } from "./wellness";
import { GuestGastronomy } from "./gastronomy";
import { GuestToVisit } from "./to-visit";
import { RequestHistoryBottomSheet } from "./request-history";
import { GuestPageLayout } from "./shared/layout";
import { useGuestAuth } from "../../contexts/guest";
import { GuestNotificationProvider } from "../../contexts/guest/GuestNotificationContext";
import { GuestCartProvider } from "../../contexts/guest/GuestCartContext";

type GuestRoute =
  | "/guest/home"
  | "/guest/shop"
  | "/guest/amenities"
  | "/guest/restaurant"
  | "/guest/qa"
  | "/guest/places"
  | "/guest/tours"
  | "/guest/wellness"
  | "/guest/gastronomy"
  | "/guest/services"
  | "/guest/to-visit";

export const GuestRouter: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<GuestRoute>("/guest/home");
  const [isRequestHistoryOpen, setIsRequestHistoryOpen] = useState(false);
  const { guestSession } = useGuestAuth();

  const handleNavigate = (path: string) => {
    setCurrentRoute(path as GuestRoute);
  };

  const handleClockClick = () => {
    setIsRequestHistoryOpen(true);
  };

  const handleCloseRequestHistory = () => {
    setIsRequestHistoryOpen(false);
  };

  const renderPage = () => {
    switch (currentRoute) {
      case "/guest/home":
        return <GuestHome onNavigate={handleNavigate} />;
      case "/guest/shop":
        return <GuestShop onNavigate={handleNavigate} />;
      case "/guest/amenities":
      case "/guest/services":
        return <GuestAmenities onNavigate={handleNavigate} />;
      case "/guest/restaurant":
        return <GuestRestaurant onNavigate={handleNavigate} />;
      case "/guest/qa":
        return <GuestQA onNavigate={handleNavigate} />;
      case "/guest/places":
        return <GuestPlaces onNavigate={handleNavigate} />;
      case "/guest/tours":
        return <GuestTours onNavigate={handleNavigate} />;
      case "/guest/wellness":
        return <GuestWellness onNavigate={handleNavigate} />;
      case "/guest/gastronomy":
        return <GuestGastronomy onNavigate={handleNavigate} />;
      case "/guest/to-visit":
        return <GuestToVisit onNavigate={handleNavigate} />;
      default:
        return <GuestHome onNavigate={handleNavigate} />;
    }
  };

  if (!guestSession) {
    return null;
  }

  const { guestData, hotelData } = guestSession;

  return (
    <GuestCartProvider>
      <GuestNotificationProvider>
        <GuestPageLayout
          guestName={guestData.guest_name}
          hotelName={hotelData.name}
          roomNumber={guestData.room_number}
          guestId={guestData.id}
          dndStatus={guestData.dnd_status}
          hotelId={guestData.hotel_id}
          currentPath={currentRoute}
          onNavigate={handleNavigate}
          onClockClick={handleClockClick}
        >
          {renderPage()}
        </GuestPageLayout>

        {/* Request History Bottom Sheet */}
        <RequestHistoryBottomSheet
          isOpen={isRequestHistoryOpen}
          onClose={handleCloseRequestHistory}
          guestId={guestData.id}
          hotelId={guestData.hotel_id}
        />
      </GuestNotificationProvider>
    </GuestCartProvider>
  );
};
