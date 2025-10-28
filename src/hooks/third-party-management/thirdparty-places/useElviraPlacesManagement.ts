import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";

interface ThirdPartyPlace {
  id: string;
  google_place_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number | null;
  user_ratings_total: number | null;
  price_level: number | null;
  category: string;
  types: string[];
  phone_number: string | null;
  website: string | null;
  business_status: string | null;
  elvira_approved: boolean;
  last_updated: string;
  created_at: string;
}

/**
 * Get all third-party places for Elvira admin
 */
export function useAllThirdPartyPlaces(filters?: {
  category?: string;
  approved?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ["elvira", "thirdparty-places", filters],
    queryFn: async () => {
      let query = supabase
        .from("thirdparty_places")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.approved !== undefined) {
        query = query.eq("elvira_approved", filters.approved);
      }

      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ThirdPartyPlace[];
    },
  });
}

/**
 * Approve/unapprove a place by Elvira admin
 */
export function useTogglePlaceApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      placeId,
      approved,
    }: {
      placeId: string;
      approved: boolean;
    }) => {
      // Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updateData = approved
        ? { elvira_approved: true, approved_by: user?.id || null }
        : { elvira_approved: false, approved_by: null };

      const { error } = await supabase
        .from("thirdparty_places")
        .update(updateData)
        .eq("id", placeId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ["elvira", "thirdparty-places"],
      });
    },
  });
}

/**
 * Bulk approve multiple places
 */
export function useBulkApprovePlaces() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      placeIds,
      approved,
    }: {
      placeIds: string[];
      approved: boolean;
    }) => {
      // Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updateData = approved
        ? { elvira_approved: true, approved_by: user?.id || null }
        : { elvira_approved: false, approved_by: null };

      const { error } = await supabase
        .from("thirdparty_places")
        .update(updateData)
        .in("id", placeIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["elvira", "thirdparty-places"],
      });
    },
  });
}

/**
 * Get statistics for Elvira dashboard
 */
export function useThirdPartyPlacesStats() {
  return useQuery({
    queryKey: ["elvira", "thirdparty-places", "stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_thirdparty_places_stats");

      if (error) {
        // Fallback: manual counting if RPC doesn't exist
        const [total, approved, gastronomy, tours, wellness] =
          await Promise.all([
            supabase
              .from("thirdparty_places")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("thirdparty_places")
              .select("id", { count: "exact", head: true })
              .eq("elvira_approved", true),
            supabase
              .from("thirdparty_places")
              .select("id", { count: "exact", head: true })
              .eq("category", "gastronomy"),
            supabase
              .from("thirdparty_places")
              .select("id", { count: "exact", head: true })
              .eq("category", "tours"),
            supabase
              .from("thirdparty_places")
              .select("id", { count: "exact", head: true })
              .eq("category", "wellness"),
          ]);

        return {
          total: total.count || 0,
          approved: approved.count || 0,
          pending: (total.count || 0) - (approved.count || 0),
          by_category: {
            gastronomy: gastronomy.count || 0,
            tours: tours.count || 0,
            wellness: wellness.count || 0,
          },
        };
      }

      return data;
    },
  });
}
