/**
 * Guest Recommended Places Hook
 *
 * Fetches active recommended places from hotel_recommended_places table
 * Includes real-time subscription for live updates
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import { useGuestRealtimeSubscription } from "../../realtime/useGuestRealtimeSubscription";
import type { Database } from "../../../types/database";

type RecommendedPlace =
  Database["public"]["Tables"]["hotel_recommended_places"]["Row"] & {
    image_url?: string | null; // JSON string of image URLs array
  };

/**
 * Fetch active recommended places for guests
 * Only returns places where is_active = true
 */
export function useGuestRecommendedPlaces(hotelId: string | undefined) {
  const query = useOptimizedQuery<RecommendedPlace[]>({
    queryKey: ["guest-recommended-places", hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const guestSupabase = getGuestSupabaseClient();

      const { data, error } = await guestSupabase
        .from("hotel_recommended_places")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("place_name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  });

  // Real-time subscription for live updates
  useGuestRealtimeSubscription({
    table: "hotel_recommended_places",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: ["guest-recommended-places", hotelId],
    enabled: !!hotelId,
  });

  return query;
}
