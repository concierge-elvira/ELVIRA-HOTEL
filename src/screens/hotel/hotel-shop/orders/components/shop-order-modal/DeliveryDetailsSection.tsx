import {
  ModalFormSection,
  ModalFormField,
} from "../../../../../../components/ui/modalform";
import type { ShopOrderWithDetails } from "../../../../../../hooks/hotel-shop/shop-orders/useShopOrders";

interface DeliveryDetailsSectionProps {
  order: ShopOrderWithDetails;
}

export function DeliveryDetailsSection({ order }: DeliveryDetailsSectionProps) {
  return (
    <ModalFormSection title="Delivery Details">
      <div className="grid grid-cols-2 gap-4">
        <ModalFormField
          label="Delivery Date"
          value={
            order.delivery_date
              ? new Date(order.delivery_date).toLocaleDateString()
              : "N/A"
          }
        />
        <ModalFormField
          label="Delivery Time"
          value={order.delivery_time || "Not specified"}
        />
      </div>
    </ModalFormSection>
  );
}
