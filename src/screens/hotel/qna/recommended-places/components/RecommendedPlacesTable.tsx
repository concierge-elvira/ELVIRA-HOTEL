import {
  type TableColumn,
  Table,
  StatusBadge,
} from "../../../../../components/ui";
import {
  useHotelRecommendedPlaces,
  useToggleHotelRecommendedPlaceStatus,
} from "../../../../../hooks/qna";
import { useHotelContext } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type HotelRecommendedPlaceRow =
  Database["public"]["Tables"]["hotel_recommended_places"]["Row"];

interface RecommendedPlace extends Record<string, unknown> {
  id: string;
  status: string;
  place: string;
  address: string;
  description: string;
  created: string;
  latitude: number | null;
  longitude: number | null;
  _originalData: HotelRecommendedPlaceRow;
}

interface RecommendedPlacesTableProps {
  searchValue: string;
  onRowClick?: (place: HotelRecommendedPlaceRow) => void;
}

export function RecommendedPlacesTable({
  searchValue,
  onRowClick,
}: RecommendedPlacesTableProps) {
  const { hotelId } = useHotelContext();
  const { data: places = [], isLoading } = useHotelRecommendedPlaces(
    hotelId || undefined
  );
  const toggleStatus = useToggleHotelRecommendedPlaceStatus();

  // Transform data for table
  const transformedPlaces: RecommendedPlace[] = places.map((place) => ({
    id: place.id,
    status: place.is_active ? "active" : "inactive",
    place: place.place_name,
    address: place.address,
    description: place.description || "—",
    created: place.created_at
      ? new Date(place.created_at).toLocaleDateString()
      : "—",
    latitude: place.latitud,
    longitude: place.longitud,
    _originalData: place,
  }));

  // Filter by search value
  const filteredPlaces = searchValue
    ? transformedPlaces.filter(
        (place) =>
          place.place.toLowerCase().includes(searchValue.toLowerCase()) ||
          place.address.toLowerCase().includes(searchValue.toLowerCase()) ||
          place.description.toLowerCase().includes(searchValue.toLowerCase())
      )
    : transformedPlaces;

  // Handle status toggle
  const handleStatusToggle = async (
    placeId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleStatus.mutateAsync({
        id: placeId,
        isActive: !currentStatus,
      });
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // Define table columns for recommended places
  const columns: TableColumn<RecommendedPlace>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value, row) => (
        <StatusBadge
          status={String(value)}
          onToggle={async () => {
            const originalData = row._originalData as HotelRecommendedPlaceRow;
            await handleStatusToggle(originalData.id, originalData.is_active);
          }}
        />
      ),
    },
    {
      key: "place",
      label: "Place",
      sortable: true,
    },
    {
      key: "address",
      label: "Address",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {filteredPlaces.length}{" "}
          {filteredPlaces.length === 1 ? "place" : "places"}
        </p>
      )}

      {/* Recommended Places Table */}
      <Table
        columns={columns}
        data={filteredPlaces}
        loading={isLoading}
        emptyMessage="No recommended places found. Add new places to get started."
        itemsPerPage={10}
        onRowClick={
          onRowClick
            ? (row) => onRowClick(row._originalData as HotelRecommendedPlaceRow)
            : undefined
        }
      />
    </div>
  );
}
