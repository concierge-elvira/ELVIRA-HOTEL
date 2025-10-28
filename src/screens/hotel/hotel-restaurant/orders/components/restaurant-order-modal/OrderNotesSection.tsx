import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { OrderField } from "../../../../../../components/ui/forms/order-details";
import type { DineInOrderWithDetails } from "../../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";

interface OrderNotesSectionProps {
  order: DineInOrderWithDetails;
}

export function OrderNotesSection({ order }: OrderNotesSectionProps) {
  return (
    <ModalFormSection title="Special Instructions">
      <OrderField
        label="Instructions"
        value={order.special_instructions || "No special requirements"}
      />
    </ModalFormSection>
  );
}
