/**
 * Hotel Category Cards Component
 *
 * Displays 4 cards for hotel-related services:
 * - Amenities
 * - Dine In
 * - Hotel Shop
 * - Q&A
 */

import React, { useMemo } from "react";
import { CategoryCard } from "./CategoryCard";
import { useGuestAuth } from "../../../../contexts/guest";
import { useGuestHotelSettings } from "../../../../hooks/guest-management/settings/useGuestHotelSettings";

interface HotelCategoryCardsProps {
  onNavigate?: (path: string) => void;
}

export const HotelCategoryCards: React.FC<HotelCategoryCardsProps> = ({
  onNavigate,
}) => {
  const { guestSession } = useGuestAuth();
  const { data: hotelSettings, isLoading } = useGuestHotelSettings(
    guestSession?.guestData?.hotel_id
  );



  const hotelCards = useMemo(
    () => [
      {
        id: "amenities",
        title: "Amenities",
        description: "Hotel facilities and services",
        path: "/guest/amenities",
        enabled: hotelSettings?.amenitiesEnabled ?? true,
      },
      {
        id: "dine-in",
        title: "Dine In",
        description: "Room service and restaurant",
        path: "/guest/restaurant",
        enabled: hotelSettings?.restaurantEnabled ?? true,
      },
      {
        id: "hotel-shop",
        title: "Hotel Shop",
        description: "Purchase hotel merchandise",
        path: "/guest/shop",
        enabled: hotelSettings?.shopEnabled ?? true,
      },
      {
        id: "qna",
        title: "Q&A",
        description: "Frequently asked questions",
        path: "/guest/qa",
        enabled: true, // Q&A is always enabled
      },
    ],
    [hotelSettings]
  );

  // Filter cards based on settings
  const visibleCards = useMemo(
    () => hotelCards.filter((card) => card.enabled),
    [hotelCards]
  );



  return (
    <div className="grid grid-cols-2 gap-2.5 px-4">
      {visibleCards.map((card) => (
        <CategoryCard
          key={card.id}
          title={card.title}
          description={card.description}
          onClick={() => onNavigate?.(card.path)}
        />
      ))}
    </div>
  );
};
