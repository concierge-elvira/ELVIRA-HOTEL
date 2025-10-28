/**
 * Recommended Badge Component
 *
 * Displays a heart icon in the top-left corner of cards to indicate recommended items
 * Used across all guest-facing cards (places, amenities, menu items, products)
 */

import React from "react";
import { Heart } from "lucide-react";

interface RecommendedBadgeProps {
  show: boolean;
}

export const RecommendedBadge: React.FC<RecommendedBadgeProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute top-2 left-2 z-10">
      <div className="bg-red-500 rounded-full p-1.5 shadow-md">
        <Heart size={16} className="text-white fill-white" />
      </div>
    </div>
  );
};
