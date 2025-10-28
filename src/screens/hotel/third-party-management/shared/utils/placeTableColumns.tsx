import type { TableColumn } from "../../../../../components/ui/tables/types";
import { StatusBadge, RecommendedToggle } from "../../../../../components/ui";

interface Place {
  id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  types?: string[];
  formatted_address?: string;
  vicinity?: string;
}

interface CreatePlaceColumnsOptions {
  hotelPlaceMap: Map<string, { approved: boolean; recommended: boolean }>;
  hotelId: string | null;
  onApprove: (placeId: string) => void;
  onReject: (placeId: string) => void;
  onToggleRecommended: (placeId: string) => void;
}

/**
 * Creates reusable table columns for place tables
 * Shared across gastronomy, tours, and wellness
 */
export function createPlaceColumns({
  hotelPlaceMap,
  hotelId,
  onApprove,
  onReject,
  onToggleRecommended,
}: CreatePlaceColumnsOptions): TableColumn<Place>[] {
  return [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_value: unknown, place: Place) => (
        <div>
          <div className="font-medium text-gray-900">
            {place.name || "Unknown"}
          </div>
          {place.types &&
            Array.isArray(place.types) &&
            place.types.length > 0 && (
              <div className="text-xs text-gray-500">
                {place.types.slice(0, 2).join(", ")}
              </div>
            )}
        </div>
      ),
    },
    {
      key: "formatted_address",
      label: "Address",
      render: (_value: unknown, place: Place) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {place.formatted_address || place.vicinity || "-"}
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (_value: unknown, place: Place) =>
        place.rating ? (
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-yellow-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">{place.rating}</span>
            {place.user_ratings_total && (
              <span className="text-xs text-gray-500 ml-1">
                ({place.user_ratings_total})
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        ),
    },
    {
      key: "price_level",
      label: "Price Level",
      sortable: true,
      render: (_value: unknown, place: Place) =>
        place.price_level ? (
          <span className="text-sm">{"$".repeat(place.price_level)}</span>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        ),
    },
    {
      key: "business_status",
      label: "Status",
      render: (_value: unknown, place: Place) => (
        <StatusBadge status={place.business_status || "unknown"} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value: unknown, place: Place) => {
        const hotelStatus = hotelPlaceMap.get(place.id);
        const isApproved = hotelStatus?.approved || false;
        const isRecommended = hotelStatus?.recommended || false;

        return (
          <div className="flex items-center gap-3 justify-end">
            {/* Approve/Reject Button */}
            {!isApproved ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (hotelId) {
                    onApprove(place.id);
                  }
                }}
                className="px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
              >
                Approve
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (hotelId) {
                    onReject(place.id);
                  }
                }}
                className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              >
                Reject
              </button>
            )}

            {/* Recommend Toggle */}
            {isApproved && (
              <RecommendedToggle
                isRecommended={isRecommended}
                onToggle={() => {
                  if (hotelId) {
                    onToggleRecommended(place.id);
                  }
                }}
                disabled={!hotelId}
              />
            )}
          </div>
        );
      },
    },
  ];
}
