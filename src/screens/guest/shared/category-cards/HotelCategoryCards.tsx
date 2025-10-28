/**
 * Hotel Category Cards Component
 *
 * Displays 4 cards for hotel-related services:
 * - Amenities
 * - Dine In
 * - Hotel Shop
 * - Q&A
 */

import React from "react";
import { CategoryCard } from "./CategoryCard";

interface HotelCategoryCardsProps {
  onNavigate?: (path: string) => void;
}

export const HotelCategoryCards: React.FC<HotelCategoryCardsProps> = ({
  onNavigate,
}) => {
  const hotelCards = [
    {
      id: "amenities",
      title: "Amenities",
      description: "Hotel facilities and services",
      path: "/guest/amenities",
    },
    {
      id: "dine-in",
      title: "Dine In",
      description: "Room service and restaurant",
      path: "/guest/restaurant",
    },
    {
      id: "hotel-shop",
      title: "Hotel Shop",
      description: "Purchase hotel merchandise",
      path: "/guest/shop",
    },
    {
      id: "qna",
      title: "Q&A",
      description: "Frequently asked questions",
      path: "/guest/qa",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 px-4">
      {hotelCards.map((card) => (
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
