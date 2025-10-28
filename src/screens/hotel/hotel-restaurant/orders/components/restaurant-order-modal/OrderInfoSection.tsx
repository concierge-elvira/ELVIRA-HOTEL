import { useMemo, useCallback, useState, useEffect } from "react";
import { ModalFormSection, StatusBadge } from "../../../../../../components/ui";
import { OrderField } from "../../../../../../components/ui/forms/order-details";
import { useUpdateDineInOrderStatus } from "../../../../../../hooks/hotel-restaurant";
import { useHotelId } from "../../../../../../hooks/useHotelContext";
import type { DineInOrderWithDetails } from "../../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";

interface OrderInfoSectionProps {
  order: DineInOrderWithDetails;
}

export function OrderInfoSection({ order }: OrderInfoSectionProps) {
  const hotelId = useHotelId();
  const updateStatus = useUpdateDineInOrderStatus();

  // Local state for optimistic updates
  const [currentStatus, setCurrentStatus] = useState(order.status);

  // Sync local state when order prop changes
  useEffect(() => {
    setCurrentStatus(order.status);
  }, [order.status]);

  // Status options for restaurant orders (memoized)
  const orderStatusOptions = useMemo(
    () => [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "completed",
      "cancelled",
    ],
    []
  );

  // Handle status change (wrapped in useCallback)
  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      if (!hotelId) return;

      // Optimistic update
      setCurrentStatus(newStatus);

      try {
        await updateStatus.mutateAsync({
          id: order.id,
          status: newStatus,
          hotelId,
        });
      } catch (error) {
        console.error("Failed to update restaurant order status:", error);
        // Revert on error
        setCurrentStatus(order.status);
      }
    },
    [updateStatus, order.id, hotelId, order.status]
  );

  return (
    <ModalFormSection title="Order Information">
      <div className="space-y-4">
        <OrderField label="Order ID" value={`#${order.id.slice(0, 8)}`} />

        <OrderField
          label="Order Type"
          value={order.order_type.replace(/_/g, " ")}
        />

        <OrderField
          label="Guest"
          value={order.guests?.guest_name || "Unknown Guest"}
        />

        <OrderField
          label="Room Number"
          value={order.guests?.room_number || "N/A"}
        />

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

        <OrderField
          label="Created"
          value={
            order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"
          }
        />
      </div>
    </ModalFormSection>
  );
}
