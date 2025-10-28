import type { DineInOrderWithDetails } from "../../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";

export interface RestaurantOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DineInOrderWithDetails | null;
}
