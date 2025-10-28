import { useOptimizedQuery } from "./api/useOptimizedQuery";
import { supabase } from "../services/supabase";
import type { Database } from "../types/database";

type Hotel = Database["public"]["Tables"]["hotels"]["Row"];

export function useHotelProfile(hotelId: string | undefined) {
  return useOptimizedQuery<Hotel | null>({
    queryKey: ["hotel-profile", hotelId],
    queryFn: async () => {
      if (!hotelId) return null;

      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", hotelId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });
}
