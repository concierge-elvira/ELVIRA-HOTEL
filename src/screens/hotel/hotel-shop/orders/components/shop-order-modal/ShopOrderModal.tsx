import { ModalForm } from "../../../../../../components/ui/modalform";
import { Button } from "../../../../../../components/ui";
import { OrderInfoSection } from "./OrderInfoSection";
import { DeliveryDetailsSection } from "./DeliveryDetailsSection";
import { OrderItemsSection } from "./OrderItemsSection";
import { OrderNotesSection } from "./OrderNotesSection";
import type { ShopOrderModalProps } from "./types";

export function ShopOrderModal({
  isOpen,
  onClose,
  order,
}: ShopOrderModalProps) {
  if (!order) return null;

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Shop Order Details"
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
      <DeliveryDetailsSection order={order} />
      <OrderItemsSection order={order} />
      <OrderNotesSection order={order} />
    </ModalForm>
  );
}
