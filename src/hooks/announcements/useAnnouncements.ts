import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../realtime/useRealtimeSubscription";
import type { Database } from "../../types/database";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];
type AnnouncementInsert =
  Database["public"]["Tables"]["announcements"]["Insert"];
type AnnouncementUpdate =
  Database["public"]["Tables"]["announcements"]["Update"];

const ANNOUNCEMENTS_QUERY_KEY = "announcements";

/**
 * Fetch announcements for a specific hotel
 */
export function useAnnouncements(hotelId: string | undefined) {
  const query = useOptimizedQuery<Announcement[]>({
    queryKey: [ANNOUNCEMENTS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
    logPrefix: "Announcements",
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "announcements",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [ANNOUNCEMENTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch announcements for the current hotel (extracted from auth session)
 */
export function useCurrentHotelAnnouncements() {
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

  return useAnnouncements(hotelId);
}

/**
 * Create a new announcement
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAnnouncement: AnnouncementInsert) => {
      const { data, error } = await supabase
        .from("announcements")
        .insert(newAnnouncement)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an existing announcement
 */
export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: AnnouncementUpdate;
    }) => {
      const { data, error } = await supabase
        .from("announcements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete an announcement
 */
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENTS_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Toggle announcement active status
 */
export function useToggleAnnouncementStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isActive,
      hotelId,
    }: {
      id: string;
      isActive: boolean;
      hotelId: string;
    }) => {
      const { data, error } = await supabase
        .from("announcements")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}
