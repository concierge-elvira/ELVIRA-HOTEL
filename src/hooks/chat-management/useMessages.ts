import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../realtime/useRealtimeSubscription";
import type { Database } from "../../types/database";

type GuestMessage = Database["public"]["Tables"]["guest_messages"]["Row"];
type GuestMessageInsert =
  Database["public"]["Tables"]["guest_messages"]["Insert"];
type GuestMessageUpdate =
  Database["public"]["Tables"]["guest_messages"]["Update"];

const MESSAGES_QUERY_KEY = "guest-messages";
const CONVERSATIONS_QUERY_KEY = "guest-conversations";

/**
 * Fetch messages for a specific conversation
 */
export function useMessages(conversationId: string | undefined) {
  const query = useOptimizedQuery<GuestMessage[]>({
    queryKey: [MESSAGES_QUERY_KEY, conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from("guest_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId,
    config: {
      staleTime: 10 * 1000, // 10 seconds - very short for live chat
      gcTime: 60 * 1000,
      refetchOnWindowFocus: true,
    },
  });

  const queryClient = useQueryClient();

  // Real-time subscription for messages
  useRealtimeSubscription({
    table: "guest_messages",
    filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined,
    queryKey: [MESSAGES_QUERY_KEY, conversationId],
    enabled: !!conversationId,
    onInsert: () => {
      // Also invalidate the conversation to update last_message_at
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY],
      });
    },
  });

  return query;
}

/**
 * Send a new message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMessage: GuestMessageInsert) => {
      const { data, error } = await supabase
        .from("guest_messages")
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      // Update the conversation's last_message_at
      await supabase
        .from("guest_conversation")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", newMessage.conversation_id);

      return data;
    },
    onSuccess: (data: GuestMessage) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, data.conversation_id],
      });
      // Invalidate conversations list to update last message time
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY],
      });
    },
  });
}

/**
 * Update a message (e.g., mark as read, update AI analysis)
 */
export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: GuestMessageUpdate;
    }) => {
      const { data, error } = await supabase
        .from("guest_messages")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: GuestMessage) => {
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, data.conversation_id],
      });
    },
  });
}

/**
 * Mark messages as read
 */
export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageIds,
    }: {
      conversationId: string;
      messageIds: string[];
    }) => {
      const { data, error } = await supabase
        .from("guest_messages")
        .update({ is_read: true })
        .in("id", messageIds)
        .select();

      if (error) throw error;
      return { data, conversationId };
    },
    onSuccess: (result: { data: GuestMessage[]; conversationId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, result.conversationId],
      });
    },
  });
}

/**
 * Delete a message (soft delete)
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      conversationId,
    }: {
      id: string;
      conversationId: string;
    }) => {
      // Hard delete - if you want soft delete, you need to add deleted_at column to the table
      const { error } = await supabase
        .from("guest_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, conversationId };
    },
    onSuccess: (result: { id: string; conversationId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, result.conversationId],
      });
    },
  });
}

/**
 * Get unread message count for a conversation
 */
export function useUnreadMessagesCount(conversationId: string | undefined) {
  return useOptimizedQuery<number>({
    queryKey: ["unread-messages-count", conversationId],
    queryFn: async () => {
      if (!conversationId) return 0;

      const { count, error } = await supabase
        .from("guest_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId)
        .eq("is_read", false)
        .eq("sender_type", "guest"); // Only count unread guest messages

      if (error) throw error;
      return count || 0;
    },
    enabled: !!conversationId,
    config: {
      staleTime: 5 * 1000, // 5 seconds
      gcTime: 30 * 1000,
      refetchOnWindowFocus: true,
    },
  });
}
