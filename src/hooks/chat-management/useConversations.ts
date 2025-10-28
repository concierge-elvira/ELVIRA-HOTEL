import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../realtime/useRealtimeSubscription";
import type { Database } from "../../types/database";

type GuestConversation =
  Database["public"]["Tables"]["guest_conversation"]["Row"];
type GuestConversationInsert =
  Database["public"]["Tables"]["guest_conversation"]["Insert"];
type GuestConversationUpdate =
  Database["public"]["Tables"]["guest_conversation"]["Update"];

const CONVERSATIONS_QUERY_KEY = "guest-conversations";

export interface ConversationWithGuest extends GuestConversation {
  guests: {
    id: string;
    guest_name: string;
    room_number: string;
  } | null;
  assigned_staff: {
    id: string;
    email: string;
  } | null;
}

/**
 * Fetch guest conversations for a specific hotel
 */
export function useConversations(hotelId: string | undefined) {
  const query = useOptimizedQuery<ConversationWithGuest[]>({
    queryKey: [CONVERSATIONS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("guest_conversation")
        .select(
          `
          *,
          guests (
            id,
            guest_name,
            room_number
          ),
          assigned_staff:profiles!guest_conversation_assigned_staff_id_fkey (
            id,
            email
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      return data as ConversationWithGuest[];
    },
    enabled: !!hotelId,
    config: {
      staleTime: 30 * 1000, // 30 seconds - short for live chat
      gcTime: 2 * 60 * 1000,
      refetchOnWindowFocus: true, // Important for chat
    },
  });

  // Real-time subscription for conversations
  useRealtimeSubscription({
    table: "guest_conversation",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [CONVERSATIONS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch conversations for the current hotel
 */
export function useCurrentHotelConversations() {
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

  return useConversations(hotelId);
}

/**
 * Fetch a single conversation by ID
 */
export function useConversation(conversationId: string | undefined) {
  return useOptimizedQuery<ConversationWithGuest>({
    queryKey: [CONVERSATIONS_QUERY_KEY, conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error("Conversation ID is required");

      const { data, error } = await supabase
        .from("guest_conversation")
        .select(
          `
          *,
          guests (
            id,
            guest_name,
            room_number
          ),
          assigned_staff:profiles!guest_conversation_assigned_staff_id_fkey (
            id,
            email
          )
        `
        )
        .eq("id", conversationId)
        .single();

      if (error) throw error;
      return data as ConversationWithGuest;
    },
    enabled: !!conversationId,
    config: {
      staleTime: 30 * 1000,
      gcTime: 2 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  });
}

/**
 * Create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newConversation: GuestConversationInsert) => {
      const { data, error } = await supabase
        .from("guest_conversation")
        .insert(newConversation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: GuestConversation) => {
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update a conversation
 */
export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: GuestConversationUpdate;
    }) => {
      const { data, error } = await supabase
        .from("guest_conversation")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: GuestConversation) => {
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY, data.hotel_id],
      });
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY, data.id],
      });
    },
  });
}

/**
 * Assign staff to a conversation
 */
export function useAssignStaffToConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      staffId,
      hotelId,
    }: {
      conversationId: string;
      staffId: string;
      hotelId: string;
    }) => {
      const { data, error } = await supabase
        .from("guest_conversation")
        .update({ assigned_staff_id: staffId })
        .eq("id", conversationId)
        .select()
        .single();

      if (error) throw error;
      return { data, hotelId };
    },
    onSuccess: (result: { data: GuestConversation; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY, result.hotelId],
      });
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY, result.data.id],
      });
    },
  });
}

/**
 * Update conversation status
 */
export function useUpdateConversationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      status,
      hotelId,
    }: {
      conversationId: string;
      status: string;
      hotelId: string;
    }) => {
      const { data, error } = await supabase
        .from("guest_conversation")
        .update({ status })
        .eq("id", conversationId)
        .select()
        .single();

      if (error) throw error;
      return { data, hotelId };
    },
    onSuccess: (result: { data: GuestConversation; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY, result.hotelId],
      });
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY, result.data.id],
      });
    },
  });
}
