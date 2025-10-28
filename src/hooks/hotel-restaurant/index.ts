export {
  useMenuItems,
  useCurrentHotelMenuItems,
  useMenuItemsByCategory,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useToggleMenuItemStatus,
} from "./menu-items/useMenuItems";

export {
  useDineInOrders,
  useCurrentHotelDineInOrders,
  useDineInOrdersByStatus,
  useCreateDineInOrder,
  useUpdateDineInOrder,
  useUpdateDineInOrderStatus,
  useDeleteDineInOrder,
  type DineInOrderWithDetails,
} from "./dine-in-orders/useDineInOrders";

export {
  useRestaurants,
  useCurrentHotelRestaurants,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
  useToggleRestaurantStatus,
} from "./restaurants/useRestaurants";
