import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import type { Database } from "../../../types/database";

type ApprovedThirdPartyPlace =
  Database["public"]["Tables"]["approved_third_party_places"]["Row"];
type ApprovedThirdPartyPlaceInsert =
  Database["public"]["Tables"]["approved_third_party_places"]["Insert"];
type ApprovedThirdPartyPlaceUpdate =
  Database["public"]["Tables"]["approved_third_party_places"]["Update"];

const THIRD_PARTY_PLACES_QUERY_KEY = "third-party-places";

/**
 * Fetch approved third-party places for a specific hotel
 */
export function useThirdPartyPlaces(hotelId: string | undefined) {
  const query = useOptimizedQuery<ApprovedThirdPartyPlace[]>({
    queryKey: [THIRD_PARTY_PLACES_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("approved_third_party_places")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("type", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "approved_third_party_places",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [THIRD_PARTY_PLACES_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch third-party places for the current hotel
 */
export function useCurrentHotelThirdPartyPlaces() {
  const [hotelId, setHotelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getHotelId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (profile) {
          const { data: hotel } = await supabase
            .from("hotels")
            .select("id")
            .eq("owner_id", profile.id)
            .single();

          if (hotel) {
            setHotelId(hotel.id);
          }
        }
      }
    };

    getHotelId();
  }, []);

  return useThirdPartyPlaces(hotelId);
}

/**
 * Fetch places by type
 */
export function useThirdPartyPlacesByType(
  hotelId: string | undefined,
  type: string | undefined
) {
  return useOptimizedQuery<ApprovedThirdPartyPlace[]>({
    queryKey: [THIRD_PARTY_PLACES_QUERY_KEY, hotelId, "type", type],
    queryFn: async () => {
      if (!hotelId || !type) return [];

      const { data, error } = await supabase
        .from("approved_third_party_places")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("type", type)
        .eq("status", "approved")
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId && !!type,
    config: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Create a new third-party place
 */
export function useCreateThirdPartyPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlace: ApprovedThirdPartyPlaceInsert) => {
      const { data, error } = await supabase
        .from("approved_third_party_places")
        .insert(newPlace)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: ApprovedThirdPartyPlace) => {
      queryClient.invalidateQueries({
        queryKey: [THIRD_PARTY_PLACES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update a third-party place
 */
export function useUpdateThirdPartyPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ApprovedThirdPartyPlaceUpdate;
    }) => {
      const { data, error } = await supabase
        .from("approved_third_party_places")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: ApprovedThirdPartyPlace) => {
      queryClient.invalidateQueries({
        queryKey: [THIRD_PARTY_PLACES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete a third-party place
 */
export function useDeleteThirdPartyPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("approved_third_party_places")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [THIRD_PARTY_PLACES_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Toggle recommended status
 */
export function useToggleThirdPartyPlaceRecommended() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      recommended,
    }: {
      id: string;
      recommended: boolean;
    }) => {
      const { data, error } = await supabase
        .from("approved_third_party_places")
        .update({ recommended })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: ApprovedThirdPartyPlace) => {
      queryClient.invalidateQueries({
        queryKey: [THIRD_PARTY_PLACES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}
