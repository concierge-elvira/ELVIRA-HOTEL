import { useQuery } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import { useGuestRealtimeSubscription } from "../../realtime/useGuestRealtimeSubscription";

const GUEST_GASTRONOMY_QUERY_KEY = "guest-gastronomy-places";

/**
 * Fetch approved gastronomy places for guests
 * Returns places from hotel_thirdparty_places where:
 * - hotel_approved = true
 * - thirdparty_place.category = 'GASTRONOMY'
 * Includes real-time subscription for live updates
 */
export function useGuestGastronomyPlaces(hotelId: string | undefined) {
  const query = useQuery({
    queryKey: [GUEST_GASTRONOMY_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) {
        console.log("❌ [GuestGastronomy] No hotelId provided");
        return [];
      }



      const guestSupabase = getGuestSupabaseClient();

      // First, let's check all places for this hotel without category filter
      const { data: allPlaces } = await guestSupabase
        .from("hotel_thirdparty_places")
        .select(
          `
          *,
          thirdparty_places!thirdparty_place_id (*)
        `
        )
        .eq("hotel_id", hotelId)
        .eq("hotel_approved", true);



      if (allPlaces && allPlaces.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const categories = allPlaces
          .map((p: any) => p.thirdparty_places?.category)

      }

      // Now fetch with category filter - try case-insensitive match
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
        .ilike("thirdparty_places.category", "GASTRONOMY")
        .order("display_order", { ascending: true, nullsFirst: false });

      if (error) {
        console.error("❌ [GuestGastronomy] Error fetching places:", error);
        throw error;
      }



      return data || [];
    },
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Real-time subscription for live updates
  useGuestRealtimeSubscription({
    table: "hotel_thirdparty_places",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [GUEST_GASTRONOMY_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}
