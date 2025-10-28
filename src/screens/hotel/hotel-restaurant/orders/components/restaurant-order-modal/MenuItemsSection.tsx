import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { OrderItemRow } from "../../../../../../components/ui/forms/order-details";
import type { DineInOrderWithDetails } from "../../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";

interface MenuItemsSectionProps {
  order: DineInOrderWithDetails;
}

export function MenuItemsSection({ order }: MenuItemsSectionProps) {
  return (
    <ModalFormSection title="Menu Items">
      <div className="space-y-2">
        {order.dine_in_order_items && order.dine_in_order_items.length > 0 ? (
          order.dine_in_order_items.map((item) => (
            <OrderItemRow
              key={item.id}
              imageUrl={item.menu_items?.image_url || null}
              name={item.menu_items?.name || "Unknown Item"}
              price={item.price_at_order}
              quantity={item.quantity}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No items found</p>
        )}
      </div>

      {/* Total */}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Total
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {order.dine_in_order_items?.length || 0} items
            </p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            ${order.total_price.toFixed(2)}
          </p>
        </div>
      </div>
    </ModalFormSection>
  );
}
