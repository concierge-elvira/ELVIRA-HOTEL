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
  | "/guest/services";

export const GuestRouter: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<GuestRoute>("/guest/home");

  const handleNavigate = (path: string) => {
    setCurrentRoute(path as GuestRoute);
  };

  const renderPage = () => {
    switch (currentRoute) {
      case "/guest/home":
        return (
          <GuestHome onNavigate={handleNavigate} currentPath={currentRoute} />
        );
      case "/guest/shop":
        return (
          <GuestShop onNavigate={handleNavigate} currentPath={currentRoute} />
        );
      case "/guest/amenities":
      case "/guest/services":
        return (
          <GuestAmenities
            onNavigate={handleNavigate}
            currentPath={currentRoute}
          />
        );
      case "/guest/restaurant":
        return (
          <GuestRestaurant
            onNavigate={handleNavigate}
            currentPath={currentRoute}
          />
        );
      case "/guest/qa":
        return (
          <GuestQA onNavigate={handleNavigate} currentPath={currentRoute} />
        );
      case "/guest/places":
        return (
          <GuestPlaces onNavigate={handleNavigate} currentPath={currentRoute} />
        );
      case "/guest/tours":
        return (
          <GuestTours onNavigate={handleNavigate} currentPath={currentRoute} />
        );
      case "/guest/wellness":
        return (
          <GuestWellness
            onNavigate={handleNavigate}
            currentPath={currentRoute}
          />
        );
      case "/guest/gastronomy":
        return (
          <GuestGastronomy
            onNavigate={handleNavigate}
            currentPath={currentRoute}
          />
        );
      default:
        return (
          <GuestHome onNavigate={handleNavigate} currentPath={currentRoute} />
        );
    }
  };

  return <>{renderPage()}</>;
};
