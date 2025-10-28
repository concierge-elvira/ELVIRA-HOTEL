/**
 * Recommended Card Component
 *
 * Displays a recommended item (product, menu item, or amenity)
 * with image, title, description, and price
 */

import React from "react";

interface RecommendedCardProps {
  id: string;
  title: string;
  description: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  onClick?: () => void;
  showPrice?: boolean; // New prop to control price badge visibility
}

export const RecommendedCard: React.FC<RecommendedCardProps> = ({
  title,
  description,
  price,
  imageUrl,
  category,
  onClick,
  showPrice = true, // Default to showing price
}) => {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-40 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden touch-manipulation cursor-pointer flex flex-col"
    >
      {/* Image - Always at top, fixed height */}
      <div className="relative w-full h-32 bg-gray-200 flex-shrink-0">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover block"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  const fallback = parent.querySelector(
                    ".fallback-placeholder"
                  );
                  if (fallback) {
                    (fallback as HTMLElement).style.display = "flex";
                  }
                }
              }}
            />
            {/* Fallback placeholder - hidden by default */}
            <div className="fallback-placeholder hidden w-full h-full absolute top-0 left-0 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-gray-400 text-xs">Image unavailable</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
        {/* Price badge - only show if showPrice is true and price exists */}
        {showPrice && price !== undefined && price > 0 && (
          <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-bold">
            ${price.toFixed(2)}
          </div>
        )}
      </div>

      {/* Content - Flexible height */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2 leading-snug mb-2">
          {description}
        </p>
        {category && (
          <div className="text-center mt-auto">
            <span className="inline-block text-xs text-blue-600 font-medium capitalize">
              {category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
