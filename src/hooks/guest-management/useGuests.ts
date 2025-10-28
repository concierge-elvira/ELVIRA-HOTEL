import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../realtime/useRealtimeSubscription";
import type { Database } from "../../types/database";

type Guest = Database["public"]["Tables"]["guests"]["Row"];
type GuestPersonalData =
  Database["public"]["Tables"]["guest_personal_data"]["Row"];
type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];
type GuestUpdate = Database["public"]["Tables"]["guests"]["Update"];

export interface GuestWithPersonalData extends Guest {
  guest_personal_data: GuestPersonalData | null;
}

const GUESTS_QUERY_KEY = "guests";

/**
 * Fetch guests for a specific hotel with personal data
 */
export function useGuests(hotelId: string | undefined) {
  const query = useOptimizedQuery<GuestWithPersonalData[]>(
    {
      queryKey: [GUESTS_QUERY_KEY, hotelId],
      queryFn: async () => {
        if (!hotelId) return [];

        const { data, error } = await supabase
          .from("guests")
          .select(
            `
            *,
            guest_personal_data (*)
          `
          )
          .eq("hotel_id", hotelId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as GuestWithPersonalData[];
      },
      enabled: !!hotelId,
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000,
    }
  );

  // Real-time subscription for guests
  useRealtimeSubscription({
    channel: `guests-${hotelId}`,
    table: "guests",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [GUESTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  // Real-time subscription for guest personal data
  useRealtimeSubscription({
    channel: `guest-personal-data-${hotelId}`,
    table: "guest_personal_data",
    queryKey: [GUESTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch guests for the current hotel (extracted from auth session)
 */
export function useCurrentHotelGuests() {
  const [hotelId, setHotelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getHotelId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Fetch hotel_id from profiles or hotels table
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

  return useGuests(hotelId);
}

/**
 * Create a new guest
 */
export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGuest: GuestInsert) => {
      const { data, error } = await supabase
        .from("guests")
        .insert(newGuest)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate guests query for the hotel
      queryClient.invalidateQueries({
        queryKey: [GUESTS_QUERY_KEY, variables.hotel_id],
      });
    },
  });
}

/**
 * Update an existing guest
 */
export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: GuestUpdate;
    }) => {
      const { data, error } = await supabase
        .from("guests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate guests query for the hotel
      queryClient.invalidateQueries({
        queryKey: [GUESTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete a guest
 */
export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase.from("guests").delete().eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data) => {
      // Invalidate guests query for the hotel
      queryClient.invalidateQueries({
        queryKey: [GUESTS_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Update guest personal data
 */
export function useUpdateGuestPersonalData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guestId,
      hotelId,
      updates,
    }: {
      guestId: string;
      hotelId: string;
      updates: Partial<GuestPersonalData>;
    }) => {
      const { data, error } = await supabase
        .from("guest_personal_data")
        .update(updates)
        .eq("guest_id", guestId)
        .select()
        .single();

      if (error) throw error;
      return { data, hotelId };
    },
    onSuccess: (result) => {
      // Invalidate guests query for the hotel
      queryClient.invalidateQueries({
        queryKey: [GUESTS_QUERY_KEY, result.hotelId],
      });
    },
  });
}
