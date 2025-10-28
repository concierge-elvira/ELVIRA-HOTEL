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
        return (
          <GuestHome
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/shop":
        return (
          <GuestShop
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/amenities":
      case "/guest/services":
        return (
          <GuestAmenities
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/restaurant":
        return (
          <GuestRestaurant
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/qa":
        return (
          <GuestQA
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/places":
        return (
          <GuestPlaces
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/tours":
        return (
          <GuestTours
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/wellness":
        return (
          <GuestWellness
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/gastronomy":
        return (
          <GuestGastronomy
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      case "/guest/to-visit":
        return (
          <GuestToVisit
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
      default:
        return (
          <GuestHome
            onNavigate={handleNavigate}
            currentPath={currentRoute}
            onClockClick={handleClockClick}
          />
        );
    }
  };

  return (
    <GuestCartProvider>
      <GuestNotificationProvider>
        {renderPage()}

        {/* Request History Bottom Sheet */}
        {guestSession && (
          <RequestHistoryBottomSheet
            isOpen={isRequestHistoryOpen}
            onClose={handleCloseRequestHistory}
            guestId={guestSession.guestData.id}
            hotelId={guestSession.guestData.hotel_id}
          />
        )}
      </GuestNotificationProvider>
    </GuestCartProvider>
  );
};
