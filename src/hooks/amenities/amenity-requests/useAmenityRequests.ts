import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import type { Database } from "../../../types/database";

type AmenityRequest = Database["public"]["Tables"]["amenity_requests"]["Row"];
type AmenityRequestInsert =
  Database["public"]["Tables"]["amenity_requests"]["Insert"];
type AmenityRequestUpdate =
  Database["public"]["Tables"]["amenity_requests"]["Update"];

const AMENITY_REQUESTS_QUERY_KEY = "amenity-requests";

export interface AmenityRequestWithDetails extends AmenityRequest {
  amenities: {
    id: string;
    name: string;
    category: string;
    price: number;
    image_url: string | null;
  } | null;
  guests: {
    id: string;
    guest_name: string;
    room_number: string;
  } | null;
}

/**
 * Fetch amenity requests for a specific hotel
 */
export function useAmenityRequests(hotelId: string | undefined) {
  const query = useOptimizedQuery<AmenityRequestWithDetails[]>({
    queryKey: [AMENITY_REQUESTS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("amenity_requests")
        .select(
          `
          *,
          amenities (
            id,
            name,
            category,
            price,
            image_url
          ),
          guests (
            id,
            guest_name,
            room_number
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AmenityRequestWithDetails[];
    },
    enabled: !!hotelId,
    config: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000,
    },
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "amenity_requests",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [AMENITY_REQUESTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch requests for the current hotel
 */
export function useCurrentHotelAmenityRequests() {
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

  return useAmenityRequests(hotelId);
}

/**
 * Create a new amenity request
 */
export function useCreateAmenityRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRequest: AmenityRequestInsert) => {
      const { data, error } = await supabase
        .from("amenity_requests")
        .insert(newRequest)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: AmenityRequest) => {
      queryClient.invalidateQueries({
        queryKey: [AMENITY_REQUESTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an amenity request
 */
export function useUpdateAmenityRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: AmenityRequestUpdate;
    }) => {
      const { data, error } = await supabase
        .from("amenity_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: AmenityRequest) => {
      queryClient.invalidateQueries({
        queryKey: [AMENITY_REQUESTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update request status
 */
export function useUpdateAmenityRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("amenity_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: AmenityRequest) => {
      queryClient.invalidateQueries({
        queryKey: [AMENITY_REQUESTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete an amenity request
 */
export function useDeleteAmenityRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("amenity_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [AMENITY_REQUESTS_QUERY_KEY, data.hotelId],
      });
    },
  });
}
