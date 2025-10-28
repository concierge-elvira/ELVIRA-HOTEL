import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import type { Database } from "../../../types/database";

type ThirdPartyPlace = Database["public"]["Tables"]["thirdparty_places"]["Row"];

const THIRDPARTY_PLACES_QUERY_KEY = "thirdparty-places";

/**
 * Fetch all third-party places
 */
export function useThirdPartyPlaces(category?: string) {
  return useOptimizedQuery<ThirdPartyPlace[]>({
    queryKey: [THIRDPARTY_PLACES_QUERY_KEY, category],
    queryFn: async () => {
      let query = supabase
        .from("thirdparty_places")
        .select("*")
        .order("rating", { ascending: false, nullsFirst: false })
        .order("name", { ascending: true });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    config: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000,
    },
  });
}

/**
 * Fetch a single place by Google Place ID
 */
export function useThirdPartyPlaceByGoogleId(
  googlePlaceId: string | undefined
) {
  return useOptimizedQuery<ThirdPartyPlace | null>({
    queryKey: [THIRDPARTY_PLACES_QUERY_KEY, "by-google-id", googlePlaceId],
    queryFn: async () => {
      if (!googlePlaceId) return null;

      const { data, error } = await supabase
        .from("thirdparty_places")
        .select("*")
        .eq("google_place_id", googlePlaceId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!googlePlaceId,
    config: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  });
}

/**
 * Search places by name or address
 */
export function useSearchThirdPartyPlaces(
  searchTerm: string,
  category?: string
) {
  return useOptimizedQuery<ThirdPartyPlace[]>({
    queryKey: [THIRDPARTY_PLACES_QUERY_KEY, "search", searchTerm, category],
    queryFn: async () => {
      if (!searchTerm) return [];

      let query = supabase
        .from("thirdparty_places")
        .select("*")
        .or(
          `name.ilike.%${searchTerm}%,formatted_address.ilike.%${searchTerm}%`
        );

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length >= 2,
    config: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Get places near a location
 */
export function useNearbyThirdPartyPlaces(
  latitude: number | undefined,
  longitude: number | undefined,
  radiusKm: number = 5,
  category?: string
) {
  return useOptimizedQuery<ThirdPartyPlace[]>({
    queryKey: [
      THIRDPARTY_PLACES_QUERY_KEY,
      "nearby",
      latitude,
      longitude,
      radiusKm,
      category,
    ],
    queryFn: async () => {
      if (latitude === undefined || longitude === undefined) return [];

      // Using a simple bounding box for performance
      // For more accurate distance, you could use PostGIS extensions
      const latDelta = radiusKm / 111; // Rough km to degrees conversion
      const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

      let query = supabase
        .from("thirdparty_places")
        .select("*")
        .gte("latitude", latitude - latDelta)
        .lte("latitude", latitude + latDelta)
        .gte("longitude", longitude - lonDelta)
        .lte("longitude", longitude + lonDelta);

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: latitude !== undefined && longitude !== undefined,
    config: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  });
}

/**
 * Delete a place from the cache
 */
export function useDeleteThirdPartyPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("thirdparty_places")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [THIRDPARTY_PLACES_QUERY_KEY],
      });
    },
  });
}

/**
 * Refresh place data from Google Places API
 */
export function useRefreshThirdPartyPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (googlePlaceId: string) => {
      // This would fetch fresh data from Google Places API
      // and update the database
      // Implementation would be similar to useFetchAndStoreGooglePlaces
      // but for a single place
      throw new Error("Not implemented yet");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [THIRDPARTY_PLACES_QUERY_KEY],
      });
    },
  });
}
