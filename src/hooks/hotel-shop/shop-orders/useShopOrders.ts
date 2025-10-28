import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import type { Database } from "../../../types/database";

type ShopOrder = Database["public"]["Tables"]["shop_orders"]["Row"];
type ShopOrderInsert = Database["public"]["Tables"]["shop_orders"]["Insert"];
type ShopOrderUpdate = Database["public"]["Tables"]["shop_orders"]["Update"];
type ShopOrderItem = Database["public"]["Tables"]["shop_order_items"]["Row"];

const SHOP_ORDERS_QUERY_KEY = "shop-orders";

export interface ShopOrderWithDetails extends ShopOrder {
  guests: {
    id: string;
    guest_name: string;
    room_number: string;
  } | null;
  shop_order_items: Array<
    ShopOrderItem & {
      products: {
        id: string;
        name: string;
        category: string;
        image_url: string | null;
      } | null;
    }
  >;
}

/**
 * Fetch shop orders for a specific hotel
 */
export function useShopOrders(hotelId: string | undefined) {
  const query = useOptimizedQuery<ShopOrderWithDetails[]>({
    queryKey: [SHOP_ORDERS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("shop_orders")
        .select(
          `
          *,
          guests (
            id,
            guest_name,
            room_number
          ),
          shop_order_items (
            *,
            products (
              id,
              name,
              category,
              image_url
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ShopOrderWithDetails[];
    },
    enabled: !!hotelId,
    config: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000,
    },
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "shop_orders",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [SHOP_ORDERS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch orders for the current hotel
 */
export function useCurrentHotelShopOrders() {
  const [hotelId, setHotelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getHotelId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (profile) {
          const { data: hotel } = await supabase
            .from("hotels")
            .select("id")
            .eq("owner_id", profile.id)
            .single();

          if (hotel) {
            setHotelId(hotel.id);
          }
        }
      }
    };

    getHotelId();
  }, []);

  return useShopOrders(hotelId);
}

/**
 * Fetch orders by status
 */
export function useShopOrdersByStatus(
  hotelId: string | undefined,
  status: string | undefined
) {
  return useOptimizedQuery<ShopOrderWithDetails[]>({
    queryKey: [SHOP_ORDERS_QUERY_KEY, hotelId, "status", status],
    queryFn: async () => {
      if (!hotelId || !status) return [];

      const { data, error } = await supabase
        .from("shop_orders")
        .select(
          `
          *,
          guests (
            id,
            guest_name,
            room_number
          ),
          shop_order_items (
            *,
            products (
              id,
              name,
              category,
              image_url
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ShopOrderWithDetails[];
    },
    enabled: !!hotelId && !!status,
    config: {
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  });
}

/**
 * Create a new order with items
 */
export function useCreateShopOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      order,
      items,
    }: {
      order: ShopOrderInsert;
      items: Array<{
        product_id: string;
        quantity: number;
        price_at_order: number;
      }>;
    }) => {
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("shop_orders")
        .insert(order)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.price_at_order,
      }));

      const { error: itemsError } = await supabase
        .from("shop_order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return orderData;
    },
    onSuccess: (data: ShopOrder) => {
      queryClient.invalidateQueries({
        queryKey: [SHOP_ORDERS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an order
 */
export function useUpdateShopOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ShopOrderUpdate;
    }) => {
      const { data, error } = await supabase
        .from("shop_orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: ShopOrder) => {
      queryClient.invalidateQueries({
        queryKey: [SHOP_ORDERS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update order status
 */
export function useUpdateShopOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("shop_orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: ShopOrder) => {
      queryClient.invalidateQueries({
        queryKey: [SHOP_ORDERS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete an order
 */
export function useDeleteShopOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("shop_orders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [SHOP_ORDERS_QUERY_KEY, data.hotelId],
      });
    },
  });
}
