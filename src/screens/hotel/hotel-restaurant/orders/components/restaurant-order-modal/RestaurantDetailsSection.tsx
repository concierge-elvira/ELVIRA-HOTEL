import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { OrderField } from "../../../../../../components/ui/forms/order-details";
import type { DineInOrderWithDetails } from "../../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";

interface RestaurantDetailsSectionProps {
  order: DineInOrderWithDetails;
}

export function RestaurantDetailsSection({
  order,
}: RestaurantDetailsSectionProps) {
  const isRoomService = order.order_type === "room_service";
  const isRestaurantBooking = order.order_type === "restaurant_booking";

  // Format date and time
  const formatDateTime = (date: string | null, time: string | null) => {
    if (!date) return "N/A";
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

  const orderDate = isRoomService
    ? formatDateTime(order.delivery_date, order.delivery_time)
    : formatDateTime(order.reservation_date, order.reservation_time);

  return (
    <ModalFormSection title="Restaurant Details">
      <div className="space-y-4">
        {isRestaurantBooking && order.restaurants && (
          <OrderField label="Restaurant" value={order.restaurants.name} />
        )}

        <OrderField
          label={
            isRoomService ? "Delivery Date & Time" : "Reservation Date & Time"
          }
          value={orderDate}
        />

        {isRestaurantBooking && order.number_of_guests && (
          <OrderField
            label="Number of Guests"
            value={order.number_of_guests.toString()}
          />
        )}

        {isRestaurantBooking && order.table_preferences && (
          <OrderField
            label="Table Preferences"
            value={order.table_preferences}
          />
        )}
      </div>
    </ModalFormSection>
  );
}
