import { useMemo, useCallback, useState, useEffect } from "react";
import { ModalFormSection, StatusBadge } from "../../../../../../components/ui";
import { OrderField } from "../../../../../../components/ui/forms/order-details";
import { useUpdateAmenityRequestStatus } from "../../../../../../hooks/amenities";
import type { AmenityRequestSectionProps } from "./types";

/**
 * RequestScheduleSection - Request date, time, and status
 * View-only display
 */
export function RequestScheduleSection({
  request,
}: AmenityRequestSectionProps) {
  const updateStatus = useUpdateAmenityRequestStatus();

  // Local state for optimistic updates
  const [currentStatus, setCurrentStatus] = useState(request.status);

  // Sync local state when request prop changes
  useEffect(() => {
    setCurrentStatus(request.status);
  }, [request.status]);

  // Status options for amenity orders (memoized)
  const orderStatusOptions = useMemo(
    () => ["pending", "approved", "rejected", "completed", "cancelled"],
    []
  );

  // Handle status change (wrapped in useCallback)
  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      // Optimistic update
      setCurrentStatus(newStatus);

      try {
        await updateStatus.mutateAsync({
          id: request.id,
          status: newStatus,
        });
      } catch (error) {
        console.error("Failed to update amenity order status:", error);
        // Revert on error
        setCurrentStatus(request.status);
      }
    },
    [updateStatus, request.id, request.status]
  );

  // Format date and time
  const formatDateTime = (date: string, time: string | null) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (time) {
      return `${formattedDate} at ${time}`;
    }
    return formattedDate;
  };

  const requestDate = formatDateTime(
    request.request_date,
    request.request_time
  );

  const createdDate = request.created_at
    ? new Date(request.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <ModalFormSection title="Schedule & Status">
      <OrderField label="Requested For" value={requestDate} />
      <OrderField label="Created" value={createdDate} />

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Status
        </span>
        <StatusBadge
          status={currentStatus}
          statusOptions={orderStatusOptions}
          onStatusChange={handleStatusChange}
        />
      </div>
    </ModalFormSection>
  );
}
