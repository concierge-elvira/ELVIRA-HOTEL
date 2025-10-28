import { DistanceFilter } from "./DistanceFilter";
import { PriceLevelFilter } from "./PriceLevelFilter";
import { ActionFilter } from "./ActionFilter";

interface FilterPanelProps {
  // Distance filter
  distance: number;
  onDistanceChange: (distance: number) => void;
  hasHotelLocation: boolean;
  onMapClick?: () => void;

  // Price level filter
  priceLevel: string;
  onPriceLevelChange: (value: string) => void;

  // Action filter
  action: string;
  onActionChange: (value: string) => void;
}

export function FilterPanel({
  distance,
  onDistanceChange,
  hasHotelLocation,
  onMapClick,
  priceLevel,
  onPriceLevelChange,
  action,
  onActionChange,
}: FilterPanelProps) {
  // Check if any filters are applied
  const hasActiveFilters =
    distance !== 999999 || priceLevel !== "all" || action !== "all";

  const handleClearAll = () => {
    onDistanceChange(999999);
    onPriceLevelChange("all");
    onActionChange("all");
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Filters */}
      <div className="flex items-center gap-6 flex-1">
        {/* Price Level Filter */}
        <PriceLevelFilter value={priceLevel} onChange={onPriceLevelChange} />

        {/* Action Filter */}
        <ActionFilter value={action} onChange={onActionChange} />

        {/* Distance Filter */}
        {hasHotelLocation && (
          <DistanceFilter
            value={distance}
            onChange={onDistanceChange}
            onMapClick={onMapClick}
          />
        )}
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClearAll}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* See in Map Button (if has location) */}
      {hasHotelLocation && onMapClick && (
        <button
          type="button"
          onClick={onMapClick}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          See in Map
        </button>
      )}
    </div>
  );
}
