import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import type { Database } from "../../../types/database";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
type MenuItemInsert = Database["public"]["Tables"]["menu_items"]["Insert"];
type MenuItemUpdate = Database["public"]["Tables"]["menu_items"]["Update"];

const MENU_ITEMS_QUERY_KEY = "menu-items";

/**
 * Fetch menu items for a specific hotel
 */
export function useMenuItems(hotelId: string | undefined) {
  const query = useOptimizedQuery<MenuItem[]>({
    queryKey: [MENU_ITEMS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "menu_items",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [MENU_ITEMS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch menu items for the current hotel
 */
export function useCurrentHotelMenuItems() {
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

  return useMenuItems(hotelId);
}

/**
 * Fetch menu items by category
 */
export function useMenuItemsByCategory(
  hotelId: string | undefined,
  category: string | undefined
) {
  return useOptimizedQuery<MenuItem[]>({
    queryKey: [MENU_ITEMS_QUERY_KEY, hotelId, "category", category],
    queryFn: async () => {
      if (!hotelId || !category) return [];

      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("category", category)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId && !!category,
    config: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Create a new menu item
 */
export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMenuItem: MenuItemInsert) => {
      const { data, error } = await supabase
        .from("menu_items")
        .insert(newMenuItem)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: MenuItem) => {
      queryClient.invalidateQueries({
        queryKey: [MENU_ITEMS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an existing menu item
 */
export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: MenuItemUpdate;
    }) => {
      const { data, error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: MenuItem) => {
      queryClient.invalidateQueries({
        queryKey: [MENU_ITEMS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete a menu item
 */
export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [MENU_ITEMS_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Toggle menu item active status
 */
export function useToggleMenuItemStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("menu_items")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: MenuItem) => {
      queryClient.invalidateQueries({
        queryKey: [MENU_ITEMS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}
