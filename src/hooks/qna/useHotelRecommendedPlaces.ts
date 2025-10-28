import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../realtime/useRealtimeSubscription";
import type { Database } from "../../types/database";

type HotelRecommendedPlace =
  Database["public"]["Tables"]["hotel_recommended_places"]["Row"];
type HotelRecommendedPlaceInsert =
  Database["public"]["Tables"]["hotel_recommended_places"]["Insert"];
type HotelRecommendedPlaceUpdate =
  Database["public"]["Tables"]["hotel_recommended_places"]["Update"];

const HOTEL_RECOMMENDED_PLACES_QUERY_KEY = "hotel-recommended-places";

/**
 * Fetch hotel recommended places for a specific hotel
 */
export function useHotelRecommendedPlaces(hotelId: string | undefined) {
  const query = useOptimizedQuery<HotelRecommendedPlace[]>({
    queryKey: [HOTEL_RECOMMENDED_PLACES_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "hotel_recommended_places",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [HOTEL_RECOMMENDED_PLACES_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch only active hotel recommended places
 */
export function useActiveHotelRecommendedPlaces(hotelId: string | undefined) {
  return useOptimizedQuery<HotelRecommendedPlace[]>({
    queryKey: [HOTEL_RECOMMENDED_PLACES_QUERY_KEY, hotelId, "active"],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
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
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Create a new hotel recommended place
 */
export function useCreateHotelRecommendedPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlace: HotelRecommendedPlaceInsert) => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .insert(newPlace)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: HotelRecommendedPlace) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_RECOMMENDED_PLACES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an existing hotel recommended place
 */
export function useUpdateHotelRecommendedPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: HotelRecommendedPlaceUpdate;
    }) => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: HotelRecommendedPlace) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_RECOMMENDED_PLACES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete a hotel recommended place
 */
export function useDeleteHotelRecommendedPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("hotel_recommended_places")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_RECOMMENDED_PLACES_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Toggle hotel recommended place active status
 */
export function useToggleHotelRecommendedPlaceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: HotelRecommendedPlace) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_RECOMMENDED_PLACES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}
