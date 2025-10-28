import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../realtime/useRealtimeSubscription";
import type { Database } from "../../types/database";

type QARecommendation =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];
type QARecommendationInsert =
  Database["public"]["Tables"]["qa_recommendations"]["Insert"];
type QARecommendationUpdate =
  Database["public"]["Tables"]["qa_recommendations"]["Update"];

const QA_RECOMMENDATIONS_QUERY_KEY = "qa-recommendations";

/**
 * Fetch Q&A recommendations for a specific hotel
 */
export function useQARecommendations(hotelId: string | undefined) {
  const query = useOptimizedQuery<QARecommendation[]>({
    queryKey: [QA_RECOMMENDATIONS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("category", { ascending: true })
        .order("type", { ascending: true });

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
    table: "qa_recommendations",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [QA_RECOMMENDATIONS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch Q&A for the current hotel
 */
export function useCurrentHotelQARecommendations() {
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

  return useQARecommendations(hotelId);
}

/**
 * Fetch Q&A by category
 */
export function useQARecommendationsByCategory(
  hotelId: string | undefined,
  category: string | undefined
) {
  return useOptimizedQuery<QARecommendation[]>({
    queryKey: [QA_RECOMMENDATIONS_QUERY_KEY, hotelId, "category", category],
    queryFn: async () => {
      if (!hotelId || !category) return [];

      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("category", category)
        .eq("is_active", true)
        .order("type", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId && !!category,
    config: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Create a new Q&A recommendation
 */
export function useCreateQARecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newQA: QARecommendationInsert) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .insert(newQA)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: QARecommendation) => {
      queryClient.invalidateQueries({
        queryKey: [QA_RECOMMENDATIONS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an existing Q&A recommendation
 */
export function useUpdateQARecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: QARecommendationUpdate;
    }) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: QARecommendation) => {
      queryClient.invalidateQueries({
        queryKey: [QA_RECOMMENDATIONS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete a Q&A recommendation
 */
export function useDeleteQARecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("qa_recommendations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [QA_RECOMMENDATIONS_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Toggle Q&A active status
 */
export function useToggleQARecommendationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: QARecommendation) => {
      queryClient.invalidateQueries({
        queryKey: [QA_RECOMMENDATIONS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}
