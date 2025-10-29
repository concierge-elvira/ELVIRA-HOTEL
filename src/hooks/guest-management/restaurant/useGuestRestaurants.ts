import { useQuery } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import type { Database } from "../../../types/database";

type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

const GUEST_RESTAURANTS_QUERY_KEY = "guest-restaurants";

/**
 * Fetch active restaurants for guests
 * Only returns restaurants where is_active = true
 */
export function useGuestRestaurants(hotelId: string | undefined) {
  return useQuery<Restaurant[]>({
    queryKey: [GUEST_RESTAURANTS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const guestSupabase = getGuestSupabaseClient();

      const { data, error } = await guestSupabase
        .from("restaurants")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
