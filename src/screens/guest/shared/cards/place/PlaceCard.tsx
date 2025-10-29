/**
 * Place Card Component
 *
 * Displays third-party places (gastronomy, experiences, etc.)
 * Similar to MenuItemCard but without price or add button
 */

import React from "react";
import { MapPin, Star } from "lucide-react";
import { RecommendedBadge } from "../RecommendedBadge";

export interface PlaceCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  rating?: number;
  onClick?: (id: string) => void;
  isRecommended?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  isRecommended,
  rating,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-r-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Image - LEFT SIDE */}
        {imageUrl ? (
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
          </div>
        ) : (
          // Placeholder when no image - maintains consistent layout
          <div className="relative shrink-0">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
              <MapPin size={32} className="text-emerald-400" />
            </div>
          </div>
        )}

        {/* Content - RIGHT SIDE */}
        <div className="flex-1 min-w-0 flex flex-col py-3 pr-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {title}
            </h3>
            {/* Rating */}
            {rating && rating > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-start gap-1.5 text-sm text-gray-600">
            <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
            <p className="line-clamp-2 flex-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Recommended Badge - Top Left */}
      <RecommendedBadge show={isRecommended || false} />
    </div>
  );
};
