/**
 * Place Category Section Component
 *
 * Groups places by category without count badge (for experiences)
 */

import React from "react";
import { PlaceCard } from "./PlaceCard";
import type { PlaceCardProps } from "./PlaceCard";

interface PlaceCategorySectionProps {
  categoryName?: string;
  items: PlaceCardProps[];
  onItemClick?: (id: string) => void;
  showCategoryHeader?: boolean;
}

export const PlaceCategorySection: React.FC<PlaceCategorySectionProps> = ({
  categoryName,
  items,
  onItemClick,
  showCategoryHeader = true,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Category Header */}
      {showCategoryHeader && categoryName && (
        <div className="flex items-center gap-2 mb-3 px-4">
          <h2 className="text-lg font-bold text-gray-900">{categoryName}</h2>
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
      )}

      {/* Items Grid */}
      <div className="space-y-3 px-4">
        {items.map((item) => (
          <PlaceCard key={item.id} {...item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
};
