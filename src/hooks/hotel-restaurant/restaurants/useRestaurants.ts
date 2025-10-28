import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import type { Database } from "../../../types/database";

type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
type RestaurantInsert = Database["public"]["Tables"]["restaurants"]["Insert"];
type RestaurantUpdate = Database["public"]["Tables"]["restaurants"]["Update"];

const RESTAURANTS_QUERY_KEY = "restaurants";

/**
 * Fetch restaurants for a specific hotel
 */
export function useRestaurants(hotelId: string | undefined) {
  const query = useOptimizedQuery<Restaurant[]>({
    queryKey: [RESTAURANTS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("hotel_id", hotelId)
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
    table: "restaurants",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [RESTAURANTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch restaurants for the current hotel
 */
export function useCurrentHotelRestaurants() {
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

  return useRestaurants(hotelId);
}

/**
 * Create a new restaurant
 */
export function useCreateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRestaurant: RestaurantInsert) => {
      const { data, error } = await supabase
        .from("restaurants")
        .insert(newRestaurant)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Restaurant) => {
      queryClient.invalidateQueries({
        queryKey: [RESTAURANTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an existing restaurant
 */
export function useUpdateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: RestaurantUpdate;
    }) => {
      const { data, error } = await supabase
        .from("restaurants")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Restaurant) => {
      queryClient.invalidateQueries({
        queryKey: [RESTAURANTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete a restaurant
 */
export function useDeleteRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [RESTAURANTS_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Toggle restaurant active status
 */
export function useToggleRestaurantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("restaurants")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Restaurant) => {
      queryClient.invalidateQueries({
        queryKey: [RESTAURANTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}
