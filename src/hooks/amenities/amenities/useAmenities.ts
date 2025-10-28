import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import type { Database } from "../../../types/database";

type Amenity = Database["public"]["Tables"]["amenities"]["Row"];
type AmenityInsert = Database["public"]["Tables"]["amenities"]["Insert"];
type AmenityUpdate = Database["public"]["Tables"]["amenities"]["Update"];

const AMENITIES_QUERY_KEY = "amenities";

/**
 * Fetch amenities for a specific hotel
 */
export function useAmenities(hotelId: string | undefined) {
  const query = useOptimizedQuery<Amenity[]>({
    queryKey: [AMENITIES_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("category", { ascending: true })
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
    table: "amenities",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [AMENITIES_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch amenities for the current hotel
 */
export function useCurrentHotelAmenities() {
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

  return useAmenities(hotelId);
}

/**
 * Create a new amenity
 */
export function useCreateAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAmenity: AmenityInsert) => {
      const { data, error } = await supabase
        .from("amenities")
        .insert(newAmenity)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Amenity) => {
      queryClient.invalidateQueries({
        queryKey: [AMENITIES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an existing amenity
 */
export function useUpdateAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: AmenityUpdate;
    }) => {
      const { data, error } = await supabase
        .from("amenities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Amenity) => {
      queryClient.invalidateQueries({
        queryKey: [AMENITIES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete an amenity
 */
export function useDeleteAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase.from("amenities").delete().eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [AMENITIES_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Toggle amenity active status
 */
export function useToggleAmenityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("amenities")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Amenity) => {
      queryClient.invalidateQueries({
        queryKey: [AMENITIES_QUERY_KEY, data.hotel_id],
      });
    },
  });
}
