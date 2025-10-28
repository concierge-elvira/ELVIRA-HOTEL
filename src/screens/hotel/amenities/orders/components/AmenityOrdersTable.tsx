import { useMemo, useState, useCallback } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
} from "../../../../../components/ui";
import {
  useAmenityRequests,
  type AmenityRequestWithDetails,
} from "../../../../../hooks/amenities/amenity-requests/useAmenityRequests";
import { useUpdateAmenityRequestStatus } from "../../../../../hooks/amenities";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import { AmenityRequestModal } from "./amenity-request-modal";

interface AmenityOrder extends Record<string, unknown> {
  id: string;
  requestId: string;
  amenity: string;
  guest: string;
  room: string;
  status: string;
  created: string;
}

interface AmenityOrdersTableProps {
  searchValue: string;
}

export function AmenityOrdersTable({ searchValue }: AmenityOrdersTableProps) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const hotelId = useHotelId();
  const [selectedRequest, setSelectedRequest] =
    useState<AmenityRequestWithDetails | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch amenity requests using the hook
  const {
    data: amenityRequests,
    isLoading,
    error,
  } = useAmenityRequests(hotelId || undefined);

  const updateStatus = useUpdateAmenityRequestStatus();

  // Status options for amenity orders (memoized)
  const orderStatusOptions = useMemo(
    () => ["pending", "approved", "rejected", "completed", "cancelled"],
    []
  );

  // Handle status change (wrapped in useCallback)
  const handleStatusChange = useCallback(
    async (requestId: string, newStatus: string) => {
      try {
        await updateStatus.mutateAsync({
          id: requestId,
          status: newStatus,
        });
      } catch (error) {
        console.error("Failed to update amenity order status:", error);
      }
    },
    [updateStatus]
  );

  // Handle row click to open details modal
  const handleRowClick = (row: AmenityOrder) => {
    const fullRequest = amenityRequests?.find(
      (request) => request.id === row.id
    );
    if (fullRequest) {
      setSelectedRequest(fullRequest);
      setIsDetailModalOpen(true);
    }
  };

  // Close detail modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  // Handler for sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Define table columns for amenity orders
  const orderColumns: TableColumn<AmenityOrder>[] = useMemo(
    () => [
      {
        key: "requestId",
        label: "Request ID",
        sortable: true,
      },
      {
        key: "amenity",
        label: "Amenity",
        sortable: true,
      },
      {
        key: "guest",
        label: "Guest",
        sortable: true,
      },
      {
        key: "room",
        label: "Room",
        sortable: true,
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (value, row) => (
          <StatusBadge
            status={String(value)}
            statusOptions={orderStatusOptions}
            onStatusChange={(newStatus) =>
              handleStatusChange(row.id, newStatus)
            }
          />
        ),
      },
      {
        key: "created",
        label: "Created",
        sortable: true,
      },
    ],
    [orderStatusOptions, handleStatusChange]
  );

  // Transform database data to table format with search filtering
  const orderData: AmenityOrder[] = useMemo(() => {
    if (!amenityRequests) {
      return [];
    }

    const filtered = amenityRequests.filter(
      (request: AmenityRequestWithDetails) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          request.id.toLowerCase().includes(search) ||
          request.status.toLowerCase().includes(search) ||
          request.amenities?.name.toLowerCase().includes(search) ||
          request.guests?.guest_name.toLowerCase().includes(search) ||
          request.guests?.room_number.toLowerCase().includes(search)
        );
      }
    );

    const transformed = filtered.map((request: AmenityRequestWithDetails) => ({
      id: request.id,
      requestId: request.id.substring(0, 8).toUpperCase(),
      amenity: request.amenities?.name || "Unknown Amenity",
      guest: request.guests?.guest_name || "Unknown Guest",
      room: request.guests?.room_number || "N/A",
      status: request.status,
      created: request.created_at
        ? new Date(request.created_at).toLocaleString()
        : "N/A",
    }));

    // Apply sorting
    if (sortColumn) {
      return [...transformed].sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortColumn];
        const bValue = (b as Record<string, unknown>)[sortColumn];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;
        if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else {
          const aStr = String(aValue).toLowerCase();
          const bStr = String(bValue).toLowerCase();
          comparison = aStr.localeCompare(bStr);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return transformed;
  }, [amenityRequests, searchValue, sortColumn, sortDirection]);

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading amenity requests: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Amenity Orders Table */}
      <Table
        columns={orderColumns}
        data={orderData}
        loading={isLoading}
        emptyMessage="No amenity orders found. Orders will appear here once guests start requesting amenities."
        onRowClick={handleRowClick}
        itemsPerPage={10}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Request Detail Modal - View Only */}
      <AmenityRequestModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
      />
    </div>
  );
}
