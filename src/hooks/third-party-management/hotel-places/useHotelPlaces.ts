import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";

interface HotelThirdPartyPlace {
  id: string;
  hotel_id: string;
  thirdparty_place_id: string;
  hotel_approved: boolean;
  hotel_recommended: boolean;
  display_order: number | null;
  custom_notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch hotel's relationship with third-party places
 * Includes the full place data via join
 */
export function useHotelPlaces(hotelId: string | undefined, category?: string) {
  return useOptimizedQuery({
    queryKey: ["hotel-thirdparty-places", hotelId, category],
    queryFn: async () => {
      if (!hotelId) return [];

      let query = supabase
        .from("hotel_thirdparty_places")
        .select(
          `
          *,
          thirdparty_place:thirdparty_places (*)
        `
        )
        .eq("hotel_id", hotelId);

      // If category is provided, filter by it through the joined table
      if (category) {
        query = query.eq("thirdparty_places.category", category);
      }

      const { data, error } = await query.order("display_order", {
        ascending: true,
        nullsFirst: false,
      });

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

/**
 * Fetch places approved by hotel for a specific category
 */
export function useHotelApprovedPlaces(
  hotelId: string | undefined,
  category: string
) {
  return useOptimizedQuery({
    queryKey: ["hotel-approved-places", hotelId, category],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("hotel_thirdparty_places")
        .select(
          `
          *,
          thirdparty_place:thirdparty_places (*)
        `
        )
        .eq("hotel_id", hotelId)
        .eq("hotel_approved", true)
        .eq("thirdparty_places.category", category)
        .order("display_order", { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Fetch places both approved AND recommended by hotel
 */
export function useHotelRecommendedPlaces(
  hotelId: string | undefined,
  category: string
) {
  return useOptimizedQuery({
    queryKey: ["hotel-recommended-places", hotelId, category],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("hotel_thirdparty_places")
        .select(
          `
          *,
          thirdparty_place:thirdparty_places (*)
        `
        )
        .eq("hotel_id", hotelId)
        .eq("hotel_approved", true)
        .eq("hotel_recommended", true)
        .eq("thirdparty_places.category", category)
        .order("display_order", { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Approve a place for this hotel
 * Creates or updates the hotel-place relationship
 */
export function useApproveHotelPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelId,
      placeId,
    }: {
      hotelId: string;
      placeId: string;
    }) => {
      // Check if relationship exists
      const { data: existing } = await supabase
        .from("hotel_thirdparty_places")
        .select("id")
        .eq("hotel_id", hotelId)
        .eq("thirdparty_place_id", placeId)
        .single();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("hotel_thirdparty_places")
          .update({ hotel_approved: true })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from("hotel_thirdparty_places")
          .insert({
            hotel_id: hotelId,
            thirdparty_place_id: placeId,
            hotel_approved: true,
            hotel_recommended: false,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["hotel-thirdparty-places", data.hotel_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["hotel-approved-places", data.hotel_id],
      });
      // Invalidate stats to update statistic cards
      queryClient.invalidateQueries({
        queryKey: ["hotel-thirdparty-places", "stats"],
      });
    },
  });
}

/**
 * Reject/unapprove a place for this hotel
 */
export function useRejectHotelPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelId,
      placeId,
    }: {
      hotelId: string;
      placeId: string;
    }) => {
      // Check if relationship exists
      const { data: existing } = await supabase
        .from("hotel_thirdparty_places")
        .select("id")
        .eq("hotel_id", hotelId)
        .eq("thirdparty_place_id", placeId)
        .single();

      if (existing) {
        // Update to reject and remove recommendation
        const { data, error } = await supabase
          .from("hotel_thirdparty_places")
          .update({ hotel_approved: false, hotel_recommended: false })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      return null;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["hotel-thirdparty-places", data.hotel_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["hotel-approved-places", data.hotel_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["hotel-recommended-places", data.hotel_id],
        });
        // Invalidate stats to update statistic cards
        queryClient.invalidateQueries({
          queryKey: ["hotel-thirdparty-places", "stats"],
        });
      }
    },
  });
}

/**
 * Toggle hotel recommendation status
 * Only works if place is already approved
 */
export function useToggleHotelRecommended() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelId,
      placeId,
      recommended,
    }: {
      hotelId: string;
      placeId: string;
      recommended: boolean;
    }) => {
      // Check if relationship exists
      const { data: existing } = await supabase
        .from("hotel_thirdparty_places")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("thirdparty_place_id", placeId)
        .single();

      if (!existing) {
        throw new Error("Place must be approved before it can be recommended");
      }

      if (!existing.hotel_approved) {
        throw new Error("Place must be approved before it can be recommended");
      }

      const { data, error } = await supabase
        .from("hotel_thirdparty_places")
        .update({ hotel_recommended: recommended })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["hotel-thirdparty-places", data.hotel_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["hotel-recommended-places", data.hotel_id],
      });
      // Invalidate stats to update statistic cards
      queryClient.invalidateQueries({
        queryKey: ["hotel-thirdparty-places", "stats"],
      });
    },
  });
}
