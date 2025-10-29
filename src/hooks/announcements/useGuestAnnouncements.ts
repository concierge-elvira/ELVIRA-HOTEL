import { getGuestSupabaseClient } from "../../services/guestSupabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useGuestRealtimeSubscription } from "../realtime/useGuestRealtimeSubscription";
import type { Database } from "../../types/database";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

const ANNOUNCEMENTS_QUERY_KEY = "announcements";

/**
 * Fetch announcements for guests
 * Uses guest Supabase client to ensure proper authentication context
 */
export function useGuestAnnouncements(hotelId: string | undefined) {
  const query = useOptimizedQuery<Announcement[]>({
    queryKey: [ANNOUNCEMENTS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const guestSupabase = getGuestSupabaseClient();

      const { data, error } = await guestSupabase
        .from("announcements")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "[useGuestAnnouncements] Error fetching announcements:",
          error
        );
        throw error;
      }

      console.log(
        "[useGuestAnnouncements] ✅ Fetched announcements:",
        data?.length || 0
      );
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
    logPrefix: "GuestAnnouncements",
  });

  // Real-time subscription for announcements
  useGuestRealtimeSubscription({
    table: "announcements",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [ANNOUNCEMENTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}
