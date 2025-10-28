import { ModalFormSection } from "../../../../../../components/ui/modalform";
import type { ShopOrderWithDetails } from "../../../../../../hooks/hotel-shop/shop-orders/useShopOrders";

interface OrderItemsSectionProps {
  order: ShopOrderWithDetails;
}

export function OrderItemsSection({ order }: OrderItemsSectionProps) {
  if (!order.shop_order_items || order.shop_order_items.length === 0) {
    return (
      <ModalFormSection title="Order Items">
        <p className="text-sm text-gray-500">No items in this order.</p>
      </ModalFormSection>
    );
  }

  return (
    <ModalFormSection title="Order Items">
      <div className="space-y-3">
        {order.shop_order_items.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            {/* Product Image */}
            <div className="flex-shrink-0">
              {item.products?.image_url ? (
                <img
                  src={item.products.image_url}
                  alt={item.products.name || "Product"}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {item.products?.name || "Unknown Product"}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity} × $
                {item.price_at_order?.toFixed(2) || "0.00"}
              </p>
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <p className="font-semibold text-gray-900">
                $
                {((item.quantity || 0) * (item.price_at_order || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-300">
          <p className="font-semibold text-gray-900">Total</p>
          <p className="font-bold text-lg text-emerald-600">
            ${order.total_price?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </ModalFormSection>
  );
}
