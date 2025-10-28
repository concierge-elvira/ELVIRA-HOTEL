import {
  ModalFormSection,
  ModalFormField,
} from "../../../../../../components/ui/modalform";
import type { ShopOrderWithDetails } from "../../../../../../hooks/hotel-shop/shop-orders/useShopOrders";

interface OrderNotesSectionProps {
  order: ShopOrderWithDetails;
}

export function OrderNotesSection({ order }: OrderNotesSectionProps) {
  if (!order.special_instructions) return null;

  return (
    <ModalFormSection title="Special Instructions">
      <ModalFormField label="Notes" value={order.special_instructions} />
    </ModalFormSection>
  );
}
