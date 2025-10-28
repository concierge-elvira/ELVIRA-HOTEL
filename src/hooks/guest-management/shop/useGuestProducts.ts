import { useQuery } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import { useGuestRealtimeSubscription } from "../../realtime/useGuestRealtimeSubscription";
import type { Database } from "../../../types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];

const GUEST_PRODUCTS_QUERY_KEY = "guest-products";

/**
 * Fetch active products for guests
 * Only returns items where is_active = true
 * Includes real-time subscription for live updates
 */
export function useGuestProducts(hotelId: string | undefined) {
  const query = useQuery<Product[]>({
    queryKey: [GUEST_PRODUCTS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const guestSupabase = getGuestSupabaseClient();

      const { data, error } = await guestSupabase
        .from("products")
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

  // Real-time subscription for live updates
  useGuestRealtimeSubscription({
    table: "products",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [GUEST_PRODUCTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch active products by category for guests
 * Only returns items where is_active = true
 */
export function useGuestProductsByCategory(
  hotelId: string | undefined,
  category: string | undefined
) {
  return useQuery<Product[]>({
    queryKey: [GUEST_PRODUCTS_QUERY_KEY, hotelId, "category", category],
    queryFn: async () => {
      if (!hotelId || !category) return [];

      const guestSupabase = getGuestSupabaseClient();

      const { data, error } = await guestSupabase
        .from("products")
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
