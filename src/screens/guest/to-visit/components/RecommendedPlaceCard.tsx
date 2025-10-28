/**
 * Recommended Place Card Component
 *
 * Displays hotel recommended places with image, name, description, and address
 * Used in the "To Visit" section for guests
 */

import React from "react";
import { MapPin } from "lucide-react";

export interface RecommendedPlaceCardProps {
  id: string;
  placeName: string;
  address: string;
  description?: string | null;
  imageUrls?: string[];
  onClick?: (id: string) => void;
}

export const RecommendedPlaceCard: React.FC<RecommendedPlaceCardProps> = ({
  id,
  placeName,
  address,
  description,
  imageUrls,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  // Get the first image from the array
  const primaryImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

  return (
    <div
      className={`relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Image - LEFT SIDE */}
        {primaryImage ? (
          <div className="relative shrink-0">
            <div className="w-28 h-28 overflow-hidden bg-gray-100">
              <img
                src={primaryImage}
                alt={placeName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>
        ) : (
          // Placeholder when no image - maintains consistent layout
          <div className="relative shrink-0">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <MapPin size={32} className="text-blue-400" />
            </div>
          </div>
        )}

        {/* Content - RIGHT SIDE */}
        <div className="flex-1 min-w-0 flex flex-col py-3 pr-3">
          <div className="mb-1">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {placeName}
            </h3>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-sm text-gray-600 mb-2">
            <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
            <p className="line-clamp-1 flex-1">{address}</p>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
