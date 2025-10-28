/**
 * Hook for fetching amenities for guests
 * Uses guest JWT authentication
 * Only returns active amenities (is_active = true)
 * Includes real-time subscription for live updates
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import { useGuestRealtimeSubscription } from "../../realtime/useGuestRealtimeSubscription";

interface GuestAmenity {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  recommended: boolean;
}

/**
 * Fetch active amenities for a hotel
 */
export function useGuestAmenities(hotelId: string | undefined) {
  const query = useOptimizedQuery<GuestAmenity[]>({
    queryKey: ["guest-amenities", hotelId],
    queryFn: async () => {
      if (!hotelId) {
        return [];
      }

      const supabase = getGuestSupabaseClient();

      const { data, error } = await supabase
        .from("amenities")
        .select(
          "id, name, description, price, category, image_url, is_active, recommended"
        )
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("category")
        .order("name");

      if (error) {
        console.error("Error fetching guest amenities:", error);
        throw error;
      }

      return data as GuestAmenity[];
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });

  // Real-time subscription for live updates
  useGuestRealtimeSubscription({
    table: "amenities",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: ["guest-amenities", hotelId],
    enabled: !!hotelId,
  });

  return query;
}
