import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import type { Database } from "../../../types/database";

type ThirdPartyPlace = Database["public"]["Tables"]["thirdparty_places"]["Row"];

const APPROVED_PLACES_QUERY_KEY = "thirdparty-places-approved";

/**
 * Fetch all Elvira-approved third-party places
 * Used by hotels to display only places approved by Elvira
 */
export function useApprovedThirdPartyPlaces(category?: string) {
  return useOptimizedQuery<ThirdPartyPlace[]>({
    queryKey: [APPROVED_PLACES_QUERY_KEY, category],
    queryFn: async () => {
      let query = supabase
        .from("thirdparty_places")
        .select("*")
        .eq("elvira_approved", true);

      if (category) {
        query = query.eq("category", category);
      }

      query = query
        .order("rating", { ascending: false, nullsFirst: false })
        .order("name", { ascending: true });

      const { data, error } = await query;

      if (error) {
throw error;
      }
return data || [];
    },
    config: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000,
    },
  });
}

/**
 * Fetch a single approved place by Google Place ID
 */
export function useApprovedPlaceByGoogleId(googlePlaceId: string | undefined) {
  return useOptimizedQuery<ThirdPartyPlace | null>({
    queryKey: [APPROVED_PLACES_QUERY_KEY, "by-google-id", googlePlaceId],
    queryFn: async () => {
      if (!googlePlaceId) return null;

      const { data, error } = await supabase
        .from("thirdparty_places")
        .select("*")
        .eq("google_place_id", googlePlaceId)
        .eq("elvira_approved", true) // Only fetch if approved
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
 * Search approved places by name or address
 */
export function useSearchApprovedPlaces(searchTerm: string, category?: string) {
  return useOptimizedQuery<ThirdPartyPlace[]>({
    queryKey: [APPROVED_PLACES_QUERY_KEY, "search", searchTerm, category],
    queryFn: async () => {
      if (!searchTerm) return [];

      let query = supabase
        .from("thirdparty_places")
        .select("*")
        .eq("elvira_approved", true) // Only approved places
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
 * Get approved places near a location
 */
export function useNearbyApprovedPlaces(
  latitude: number | undefined,
  longitude: number | undefined,
  radiusKm: number = 5,
  category?: string
) {
  return useOptimizedQuery<ThirdPartyPlace[]>({
    queryKey: [
      APPROVED_PLACES_QUERY_KEY,
      "nearby",
      latitude,
      longitude,
      radiusKm,
      category,
    ],
    queryFn: async () => {
      if (latitude === undefined || longitude === undefined) return [];

      // Using a simple bounding box for performance
      const latDelta = radiusKm / 111; // Rough km to degrees conversion
      const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

      let query = supabase
        .from("thirdparty_places")
        .select("*")
        .eq("elvira_approved", true) // Only approved places
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
 * Get approved places statistics for hotels
 */
export function useApprovedPlacesStats() {
  return useOptimizedQuery({
    queryKey: [APPROVED_PLACES_QUERY_KEY, "stats"],
    queryFn: async () => {
      const [total, gastronomy, tours, wellness] = await Promise.all([
        supabase
          .from("thirdparty_places")
          .select("id", { count: "exact", head: true })
          .eq("elvira_approved", true),
        supabase
          .from("thirdparty_places")
          .select("id", { count: "exact", head: true })
          .eq("elvira_approved", true)
          .eq("category", "gastronomy"),
        supabase
          .from("thirdparty_places")
          .select("id", { count: "exact", head: true })
          .eq("elvira_approved", true)
          .eq("category", "tours"),
        supabase
          .from("thirdparty_places")
          .select("id", { count: "exact", head: true })
          .eq("elvira_approved", true)
          .eq("category", "wellness"),
      ]);

      return {
        total: total.count || 0,
        by_category: {
          gastronomy: gastronomy.count || 0,
          tours: tours.count || 0,
          wellness: wellness.count || 0,
        },
      };
    },
    config: {
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000,
    },
  });
}
