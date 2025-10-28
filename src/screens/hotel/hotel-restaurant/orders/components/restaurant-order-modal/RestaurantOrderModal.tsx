import { ModalForm } from "../../../../../../components/ui/modalform";
import { Button } from "../../../../../../components/ui";
import { OrderInfoSection } from "./OrderInfoSection";
import { RestaurantDetailsSection } from "./RestaurantDetailsSection";
import { MenuItemsSection } from "./MenuItemsSection";
import { OrderNotesSection } from "./OrderNotesSection";
import type { RestaurantOrderModalProps } from "./types";

export function RestaurantOrderModal({
  isOpen,
  onClose,
  order,
}: RestaurantOrderModalProps) {
  if (!order) return null;

  const isRoomService = order.order_type === "room_service";
  const modalTitle = isRoomService
    ? "Room Service Order Details"
    : "Restaurant Booking Details";

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="md"
      footer={
        <div className="flex justify-end">
          <Button variant="primary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <OrderInfoSection order={order} />
      <RestaurantDetailsSection order={order} />
      <OrderNotesSection order={order} />
      <MenuItemsSection order={order} />
    </ModalForm>
  );
}
