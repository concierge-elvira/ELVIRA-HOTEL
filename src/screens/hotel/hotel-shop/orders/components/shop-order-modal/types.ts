import type { ShopOrderWithDetails } from "../../../../../../hooks/hotel-shop/shop-orders/useShopOrders";

export interface ShopOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ShopOrderWithDetails | null;
}
