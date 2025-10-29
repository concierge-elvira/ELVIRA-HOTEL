/**
 * Menu Item Card Component
 *
 * Reusable card for displaying menu items, products, or services
 * Similar to UberEats card design
 */

import React from "react";
import { Plus, Minus, Check } from "lucide-react";
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
  // Quantity counter props
  quantity?: number;
  onIncrement?: (id: string) => void;
  onDecrement?: (id: string) => void;
  // Amenity added state
  isAdded?: boolean;
  onRemoveClick?: (id: string) => void;
  // Disabled state (for service type restrictions)
  disabled?: boolean;
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
  quantity,
  onIncrement,
  onDecrement,
  isAdded,
  onRemoveClick,
  disabled = false,
}) => {
  const handleCardClick = () => {
    if (disabled) return;
    if (onCardClick) {
      onCardClick(id);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the add button
    if (disabled) return;
    if (onAddClick) {
      onAddClick(id);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onIncrement) {
      onIncrement(id);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDecrement) {
      onDecrement(id);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveClick) {
      onRemoveClick(id);
    }
  };

  // Show quantity counter if quantity is defined and > 0
  const showQuantityCounter = quantity !== undefined && quantity > 0;

  return (
    <div
      className={`relative bg-white rounded-r-2xl overflow-hidden shadow-sm transition-shadow duration-200 border border-gray-200 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-md cursor-pointer"
      }`}
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
            {/* Quantity Counter or Add Button - Bottom Right of Image */}
            {showQuantityCounter ? (
              <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-white rounded-full shadow-md border border-gray-200 px-0.5">
                <button
                  onClick={handleDecrement}
                  className="w-6 h-6 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-semibold text-gray-900 min-w-5 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-6 h-6 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : isAdded ? (
              <button
                onClick={handleRemoveClick}
                className="absolute bottom-2 right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-sm hover:bg-green-600 active:bg-green-700 transition-colors"
                aria-label={`Remove ${title}`}
              >
                <Check size={16} className="text-white" />
              </button>
            ) : (
              onAddClick && (
                <button
                  onClick={handleAddClick}
                  disabled={disabled}
                  className={`absolute bottom-2 right-2 w-7 h-7 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-blue-50 hover:border-blue-500"
                  }`}
                  aria-label={`Add ${title}`}
                >
                  <Plus size={14} className="text-blue-600" />
                </button>
              )
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
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* Recommended Badge - Top Left */}
      <RecommendedBadge show={isRecommended || false} />
    </div>
  );
};
