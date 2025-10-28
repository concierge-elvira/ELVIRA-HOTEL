import { useQuery } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import type { Database } from "../../../types/database";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

const GUEST_MENU_ITEMS_QUERY_KEY = "guest-menu-items";

/**
 * Fetch active menu items for guests
 * Only returns items where is_active = true
 */
export function useGuestMenuItems(hotelId: string | undefined) {
  return useQuery<MenuItem[]>({
    queryKey: [GUEST_MENU_ITEMS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const guestSupabase = getGuestSupabaseClient();

      const { data, error } = await guestSupabase
        .from("menu_items")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch active menu items by category for guests
 * Only returns items where is_active = true
 */
export function useGuestMenuItemsByCategory(
  hotelId: string | undefined,
  category: string | undefined
) {
  return useQuery<MenuItem[]>({
    queryKey: [GUEST_MENU_ITEMS_QUERY_KEY, hotelId, "category", category],
    queryFn: async () => {
      if (!hotelId || !category) return [];

      const guestSupabase = getGuestSupabaseClient();

      const { data, error } = await guestSupabase
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
