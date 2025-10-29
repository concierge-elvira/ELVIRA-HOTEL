/**
 * Restaurant Selector Component
 *
 * Allows user to select which restaurant to book when multiple restaurants are available
 * Only shown when service type is "Restaurant" and there are multiple restaurant options
 */

import React from "react";
import { UtensilsCrossed } from "lucide-react";

interface RestaurantSelectorProps {
  selectedRestaurantId: string | null;
  onRestaurantChange: (restaurantId: string) => void;
  availableRestaurants: Array<{ id: string; name: string }>;
}

export const RestaurantSelector: React.FC<RestaurantSelectorProps> = ({
  selectedRestaurantId,
  onRestaurantChange,
  availableRestaurants,
}) => {
  if (availableRestaurants.length === 0) {
    return null; // Don't show if no restaurants
  }

  // If only one restaurant, auto-select it and show non-editable
  if (availableRestaurants.length === 1) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Restaurant
        </label>
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-2 border-emerald-500 rounded-full">
          <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-900">
            {availableRestaurants[0].name}
          </span>
        </div>
      </div>
    );
  }

  // Multiple restaurants - show selector
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Select Restaurant
      </label>
      <div className="grid grid-cols-1 gap-3">
        {availableRestaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            type="button"
            onClick={() => onRestaurantChange(restaurant.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-full border-2 font-medium transition-all ${
              selectedRestaurantId === restaurant.id
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <UtensilsCrossed
              className={`w-5 h-5 ${
                selectedRestaurantId === restaurant.id
                  ? "text-emerald-600"
                  : "text-gray-400"
              }`}
            />
            <span>{restaurant.name}</span>
            {selectedRestaurantId === restaurant.id && (
              <svg
                className="w-5 h-5 text-emerald-600 ml-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
