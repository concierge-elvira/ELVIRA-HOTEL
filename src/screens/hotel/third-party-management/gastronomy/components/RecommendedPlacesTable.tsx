import { useMemo } from "react";
import { Table, StatusBadge } from "../../../../../components/ui";
import { useHotelRecommendedPlaces } from "../../../../../hooks/third-party-management";
import { useCurrentUserHotelId } from "../../../../../hooks/useCurrentUserHotel";
import type { TableColumn } from "../../../../../components/ui/tables/types";

interface RecommendedPlacesTableProps {
  searchValue?: string;
}

export function RecommendedPlacesTable({
  searchValue,
}: RecommendedPlacesTableProps) {
  const { hotelId } = useCurrentUserHotelId();
  const { data: recommendedPlaces, isLoading } = useHotelRecommendedPlaces(
    hotelId,
    "gastronomy"
  );

  // Extract the actual place data from the junction table response
  const places = useMemo(() => {
    if (!recommendedPlaces) return [];
    return recommendedPlaces.map((item: any) => item.thirdparty_place);
  }, [recommendedPlaces]);

  // Filter places based on search
  const filteredPlaces = useMemo(() => {
    if (!places) return [];
    if (!searchValue) return places;

    const searchLower = searchValue.toLowerCase();
    return places.filter((place: any) => {
      return (
        place?.name?.toLowerCase().includes(searchLower) ||
        place?.formatted_address?.toLowerCase().includes(searchLower) ||
        place?.vicinity?.toLowerCase().includes(searchLower)
      );
    });
  }, [places, searchValue]);

  // Define table columns
  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        sortable: true,
        render: (_value: unknown, place: any) => (
          <div>
            <div className="font-medium text-gray-900 flex items-center gap-2">
              <span className="text-yellow-500 text-lg">★</span>
              {place?.name || "Unknown"}
            </div>
            {place?.types &&
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
        render: (_value: unknown, place: any) => (
          <div className="text-sm text-gray-600 max-w-xs truncate">
            {place?.formatted_address || place?.vicinity || "-"}
          </div>
        ),
      },
      {
        key: "rating",
        label: "Rating",
        sortable: true,
        render: (_value: unknown, place: any) =>
          place?.rating ? (
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
        render: (_value: unknown, place: any) =>
          place?.price_level ? (
            <span className="text-sm">{"$".repeat(place.price_level)}</span>
          ) : (
            <span className="text-sm text-gray-400">N/A</span>
          ),
      },
      {
        key: "business_status",
        label: "Status",
        render: (_value: unknown, place: any) => (
          <StatusBadge status={place?.business_status || "unknown"} />
        ),
      },
    ],
    []
  );

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-yellow-500 text-xl">★</span>
          Recommended Gastronomy Places
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Places you have approved and marked as recommended for your guests
        </p>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredPlaces}
        loading={isLoading}
        emptyMessage={
          searchValue
            ? "No recommended places match your search."
            : "No recommended places yet. Approve and star places above to recommend them to your guests."
        }
        actions={[
          {
            label: "View",
            onClick: (place: any) => {
              if (place?.google_maps_url) {
                window.open(place.google_maps_url, "_blank");
              }
            },
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}
