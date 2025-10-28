/**
 * Guest Request History Hook
 *
 * Fetches all orders and requests for a specific guest:
 * - Amenity requests
 * - Dine-in orders (restaurant/room service)
 * - Shop orders
 *
 * Includes real-time subscriptions for instant updates
 */

import { useQuery } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import { useGuestRealtimeSubscription } from "../../realtime/useGuestRealtimeSubscription";
import type { Database } from "../../../types/database";

type AmenityRequest = Database["public"]["Tables"]["amenity_requests"]["Row"];
type DineInOrder = Database["public"]["Tables"]["dine_in_orders"]["Row"];
type ShopOrder = Database["public"]["Tables"]["shop_orders"]["Row"];
type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Amenity = Database["public"]["Tables"]["amenities"]["Row"];

const GUEST_REQUEST_HISTORY_QUERY_KEY = "guest-request-history";

export interface AmenityRequestHistory extends AmenityRequest {
  amenities: Pick<
    Amenity,
    "id" | "name" | "category" | "price" | "image_url"
  > | null;
}

export interface DineInOrderHistory extends DineInOrder {
  restaurants?: {
    id: string;
    name: string;
  } | null;
  menu_items_data?: Array<{
    menu_item: Pick<MenuItem, "id" | "name" | "image_url"> | null;
    quantity: number;
    price_at_order: number;
  }>;
}

export interface ShopOrderHistory extends ShopOrder {
  products_data?: Array<{
    product: Pick<Product, "id" | "name" | "image_url" | "category"> | null;
    quantity: number;
    price_at_order: number;
  }>;
}

export interface GuestRequestHistory {
  amenityRequests: AmenityRequestHistory[];
  dineInOrders: DineInOrderHistory[];
  shopOrders: ShopOrderHistory[];
}

/**
 * Fetch all request history for a specific guest
 */
export function useGuestRequestHistory(
  guestId: string | undefined,
  hotelId: string | undefined,
  onStatusChange?: () => void
) {
  const queryKey = [GUEST_REQUEST_HISTORY_QUERY_KEY, guestId, hotelId] as const;

  // Real-time subscription for amenity requests
  useGuestRealtimeSubscription({
    table: "amenity_requests",
    filter: guestId && hotelId ? `guest_id=eq.${guestId}` : undefined,
    queryKey,
    enabled: !!guestId && !!hotelId,
    onUpdate: () => {

      onStatusChange?.();
    },
    onInsert: () => {

      onStatusChange?.();
    },
  });

  // Real-time subscription for dine-in orders
  useGuestRealtimeSubscription({
    table: "dine_in_orders",
    filter: guestId && hotelId ? `guest_id=eq.${guestId}` : undefined,
    queryKey,
    enabled: !!guestId && !!hotelId,
    onUpdate: () => {

      onStatusChange?.();
    },
    onInsert: () => {

      onStatusChange?.();
    },
  });

  // Real-time subscription for shop orders
  useGuestRealtimeSubscription({
    table: "shop_orders",
    filter: guestId && hotelId ? `guest_id=eq.${guestId}` : undefined,
    queryKey,
    enabled: !!guestId && !!hotelId,
    onUpdate: () => {

      onStatusChange?.();
    },
    onInsert: () => {

      onStatusChange?.();
    },
  });

  return useQuery<GuestRequestHistory>({
    queryKey,
    queryFn: async () => {
      if (!guestId || !hotelId) {
        return {
          amenityRequests: [],
          dineInOrders: [],
          shopOrders: [],
        };
      }

      const guestSupabase = getGuestSupabaseClient();

      // Fetch amenity requests
      const { data: amenityRequests, error: amenityError } = await guestSupabase
        .from("amenity_requests")
        .select(
          `
          *,
          amenities (
            id,
            name,
            category,
            price,
            image_url
          )
        `
        )
        .eq("guest_id", guestId)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (amenityError) throw amenityError;

      // Fetch dine-in orders with menu items
      const { data: dineInOrders, error: dineInError } = await guestSupabase
        .from("dine_in_orders")
        .select(
          `
          *,
          restaurants (
            id,
            name
          ),
          dine_in_order_items (
            quantity,
            price_at_order,
            menu_items (
              id,
              name,
              image_url
            )
          )
        `
        )
        .eq("guest_id", guestId)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (dineInError) throw dineInError;

      // Transform dine-in orders to match our interface
      const transformedDineInOrders: DineInOrderHistory[] = (
        dineInOrders || []
      ).map((order) => ({
        ...order,
        menu_items_data:
          order.dine_in_order_items?.map((item) => ({
            menu_item: item.menu_items,
            quantity: item.quantity,
            price_at_order: item.price_at_order,
          })) || [],
      }));

      // Fetch shop orders with products
      const { data: shopOrders, error: shopError } = await guestSupabase
        .from("shop_orders")
        .select(
          `
          *,
          shop_order_items (
            quantity,
            price_at_order,
            products (
              id,
              name,
              image_url,
              category
            )
          )
        `
        )
        .eq("guest_id", guestId)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (shopError) throw shopError;

      // Transform shop orders to match our interface
      const transformedShopOrders: ShopOrderHistory[] = (shopOrders || []).map(
        (order) => ({
          ...order,
          products_data:
            order.shop_order_items?.map((item) => ({
              product: item.products,
              quantity: item.quantity,
              price_at_order: item.price_at_order,
            })) || [],
        })
      );

      return {
        amenityRequests: (amenityRequests || []) as AmenityRequestHistory[],
        dineInOrders: transformedDineInOrders,
        shopOrders: transformedShopOrders,
      };
    },
    enabled: !!guestId && !!hotelId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
}
