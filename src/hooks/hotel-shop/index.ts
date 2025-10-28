export {
  useProducts,
  useCurrentHotelProducts,
  useProductsByCategory,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useToggleProductStatus,
  useUpdateProductStock,
} from "./products/useProducts";

export {
  useShopOrders,
  useCurrentHotelShopOrders,
  useShopOrdersByStatus,
  useCreateShopOrder,
  useUpdateShopOrder,
  useUpdateShopOrderStatus,
  useDeleteShopOrder,
  type ShopOrderWithDetails,
} from "./shop-orders/useShopOrders";
