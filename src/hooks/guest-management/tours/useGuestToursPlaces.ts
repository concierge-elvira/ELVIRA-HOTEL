import { useQuery } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";

const GUEST_TOURS_QUERY_KEY = "guest-tours-places";

/**
 * Fetch approved tours places for guests
 * Returns places from hotel_thirdparty_places where:
 * - hotel_approved = true
 * - thirdparty_place.category = 'Tours'
 */
export function useGuestToursPlaces(hotelId: string | undefined) {
  return useQuery({
    queryKey: [GUEST_TOURS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) {
        return [];
      }

      const guestSupabase = getGuestSupabaseClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (guestSupabase as any)
        .from("hotel_thirdparty_places")
        .select(
          `
          *,
          thirdparty_places!thirdparty_place_id (*)
        `
        )
        .eq("hotel_id", hotelId)
        .eq("hotel_approved", true)
        .ilike("thirdparty_places.category", "Tours")
        .order("display_order", { ascending: true, nullsFirst: false });

      if (error) throw error;

      return data || [];
    },
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
