import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  RecommendedToggle,
} from "../../../../../components/ui";
import {
  useAmenities,
  useUpdateAmenity,
} from "../../../../../hooks/amenities/amenities/useAmenities";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

interface Amenity extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  imageUrl: string | null;
  amenity: string;
  category: string;
  price: string;
  hotelRecommended: boolean | null;
}

interface AmenitiesTableProps {
  searchValue: string;
  onView: (amenity: AmenityRow) => void;
}

export function AmenitiesTable({ searchValue, onView }: AmenitiesTableProps) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const hotelId = useHotelId();

  // Fetch amenities using the hook
  const {
    data: amenities,
    isLoading,
    error,
  } = useAmenities(hotelId || undefined);

  // Get the mutation
  const updateAmenity = useUpdateAmenity();

  // Handle status toggle
  const handleStatusToggle = async (amenityId: string, newStatus: boolean) => {
    try {
      await updateAmenity.mutateAsync({
        id: amenityId,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating amenity status:", error);
    }
  };

  // Handle row click
  const handleRowClick = (row: Amenity) => {
    const fullAmenity = amenities?.find((item) => item.id === row.id);
    if (fullAmenity) {
      onView(fullAmenity);
    }
  };

  // Define table columns for amenities
  const amenityColumns: TableColumn<Amenity>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={(newStatus) => handleStatusToggle(row.id, newStatus)}
        />
      ),
    },
    {
      key: "imageUrl",
      label: "Image",
      sortable: false,
      render: (value) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img
              src={value as string}
              alt="Amenity"
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "amenity",
      label: "Amenity",
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <span>{row.amenity}</span>
          <RecommendedToggle
            isRecommended={row.hotelRecommended || false}
            onToggle={() => {
              updateAmenity.mutate({
                id: row.id,
                updates: { recommended: !row.hotelRecommended },
              });
            }}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const amenityData: Amenity[] = useMemo(() => {
    if (!amenities) {
      return [];
    }

    let filtered = amenities
      .filter((amenity: AmenityRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          amenity.name.toLowerCase().includes(search) ||
          amenity.category.toLowerCase().includes(search) ||
          (amenity.description &&
            amenity.description.toLowerCase().includes(search))
        );
      })
      .map((amenity: AmenityRow) => ({
        id: amenity.id,
        status: amenity.is_active ? "Active" : "Inactive",
        isActive: amenity.is_active,
        imageUrl: amenity.image_url,
        amenity: amenity.name,
        category: amenity.category,
        price: `$${amenity.price.toFixed(2)}`,
        hotelRecommended: amenity.recommended,
      }));

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortColumn];
        const bValue = (b as Record<string, unknown>)[sortColumn];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        const aNum = parseFloat(aStr.replace(/[$,]/g, ""));
        const bNum = parseFloat(bStr.replace(/[$,]/g, ""));

        let comparison = 0;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          comparison = aNum - bNum;
        } else {
          comparison = aStr.localeCompare(bStr);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [amenities, searchValue, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading amenities: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {amenityData.length} result(s)
        </p>
      )}

      {/* Amenities Table */}
      <Table
        columns={amenityColumns}
        data={amenityData}
        loading={isLoading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage={
          searchValue
            ? `No amenities found matching "${searchValue}".`
            : "No amenities found. Add new amenities to get started."
        }
        onRowClick={handleRowClick}
        itemsPerPage={10}
      />
    </div>
  );
}
