/**
 * Menu Item Card Component
 *
 * Reusable card for displaying menu items, products, or services
 * Similar to UberEats card design
 */

import React from "react";
import { Plus } from "lucide-react";
import { RecommendedBadge } from "../RecommendedBadge";

export interface MenuItemCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  onAddClick?: (id: string) => void;
  onCardClick?: (id: string) => void;
  isRecommended?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  title,
  description,
  price,
  imageUrl,
  isRecommended,
  onAddClick,
  onCardClick,
}) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the add button
    if (onAddClick) {
      onAddClick(id);
    }
  };

  return (
    <div
      className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-3">
        {/* Image and Add Button - LEFT SIDE */}
        {imageUrl && (
          <div className="relative shrink-0">
            <div className="w-28 h-28 overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            {/* Add Button - Bottom Right of Image */}
            {onAddClick && (
              <button
                onClick={handleAddClick}
                className="absolute bottom-2 right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 shadow-sm"
                aria-label={`Add ${title}`}
              >
                <Plus size={16} className="text-blue-600" />
              </button>
            )}
          </div>
        )}

        {/* Content - RIGHT SIDE */}
        <div className="flex-1 min-w-0 flex flex-col py-3 pr-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {title}
            </h3>
            <span className="text-base font-bold text-gray-900 shrink-0">
              ${price.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>

      {/* Recommended Badge - Top Left */}
      <RecommendedBadge show={isRecommended || false} />
    </div>
  );
};
