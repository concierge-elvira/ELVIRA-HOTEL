import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import type { Database } from "../../../types/database";

type DineInOrder = Database["public"]["Tables"]["dine_in_orders"]["Row"];
type DineInOrderInsert =
  Database["public"]["Tables"]["dine_in_orders"]["Insert"];
type DineInOrderUpdate =
  Database["public"]["Tables"]["dine_in_orders"]["Update"];
type DineInOrderItem =
  Database["public"]["Tables"]["dine_in_order_items"]["Row"];

const DINE_IN_ORDERS_QUERY_KEY = "dine-in-orders";

export interface DineInOrderWithDetails extends DineInOrder {
  guests: {
    id: string;
    guest_name: string;
    room_number: string;
  } | null;
  dine_in_order_items: Array<
    DineInOrderItem & {
      menu_items: {
        id: string;
        name: string;
        category: string;
        image_url: string | null;
      } | null;
    }
  >;
  restaurants: {
    id: string;
    name: string;
  } | null;
}

/**
 * Fetch dine-in orders for a specific hotel
 */
export function useDineInOrders(hotelId: string | undefined) {
  const query = useOptimizedQuery<DineInOrderWithDetails[]>({
    queryKey: [DINE_IN_ORDERS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("dine_in_orders")
        .select(
          `
          *,
          guests (
            id,
            guest_name,
            room_number
          ),
          dine_in_order_items (
            *,
            menu_items (
              id,
              name,
              category,
              image_url
            )
          ),
          restaurants (
            id,
            name
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DineInOrderWithDetails[];
    },
    enabled: !!hotelId,
    config: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000,
    },
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "dine_in_orders",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [DINE_IN_ORDERS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch orders for the current hotel
 */
export function useCurrentHotelDineInOrders() {
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

  return useDineInOrders(hotelId);
}

/**
 * Fetch orders by status
 */
export function useDineInOrdersByStatus(
  hotelId: string | undefined,
  status: string | undefined
) {
  return useOptimizedQuery<DineInOrderWithDetails[]>({
    queryKey: [DINE_IN_ORDERS_QUERY_KEY, hotelId, "status", status],
    queryFn: async () => {
      if (!hotelId || !status) return [];

      const { data, error } = await supabase
        .from("dine_in_orders")
        .select(
          `
          *,
          guests (
            id,
            guest_name,
            room_number
          ),
          dine_in_order_items (
            *,
            menu_items (
              id,
              name,
              category,
              image_url
            )
          ),
          restaurants (
            id,
            name
          )
        `
        )
        .eq("hotel_id", hotelId)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DineInOrderWithDetails[];
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
export function useCreateDineInOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      order,
      items,
    }: {
      order: DineInOrderInsert;
      items: Array<{
        menu_item_id: string;
        quantity: number;
        price_at_order: number;
      }>;
    }) => {
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("dine_in_orders")
        .insert(order)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price_at_order: item.price_at_order,
      }));

      const { error: itemsError } = await supabase
        .from("dine_in_order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return orderData;
    },
    onSuccess: (data: DineInOrder) => {
      queryClient.invalidateQueries({
        queryKey: [DINE_IN_ORDERS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an order
 */
export function useUpdateDineInOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: DineInOrderUpdate;
    }) => {
      const { data, error } = await supabase
        .from("dine_in_orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: DineInOrder) => {
      queryClient.invalidateQueries({
        queryKey: [DINE_IN_ORDERS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update order status
 */
export function useUpdateDineInOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      hotelId,
    }: {
      id: string;
      status: string;
      hotelId: string;
    }) => {
      const { data, error } = await supabase
        .from("dine_in_orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: DineInOrder) => {
      queryClient.invalidateQueries({
        queryKey: [DINE_IN_ORDERS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete an order
 */
export function useDeleteDineInOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("dine_in_orders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [DINE_IN_ORDERS_QUERY_KEY, data.hotelId],
      });
    },
  });
}
