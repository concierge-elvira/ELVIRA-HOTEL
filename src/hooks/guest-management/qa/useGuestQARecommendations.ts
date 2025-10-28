/**
 * Guest Q&A Recommendations Hook
 *
 * Fetches active Q&A recommendations for guests
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import type { Database } from "../../../types/database";

type QARecommendation =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];

/**
 * Fetch active Q&A recommendations for a hotel
 * Returns recommendations grouped by category
 */
export function useGuestQARecommendations(hotelId: string | undefined) {
  return useOptimizedQuery<QARecommendation[]>({
    queryKey: ["guest-qa-recommendations", hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const supabase = getGuestSupabaseClient();
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("type", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000,
    },
  });
}
