import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useAuth } from "../../useAuth";
import { useCurrentUserHotel } from "../../useCurrentUserHotel";

/**
 * Hook to fetch messages for a guest conversation
 */
export function useGuestMessages(conversationId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.guestMessages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        return [];
      }

      const { data, error } = await supabase
        .from("guest_messages")
        .select(
          `
          id,
          conversation_id,
          sender_type,
          message_text,
          translated_text,
          is_translated,
          is_read,
          created_at,
          guest_id,
          created_by
        `
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }
      return data || [];
    },
    enabled: !!conversationId,
    config: {
      staleTime: 1000 * 10, // 10 seconds
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Guest Messages",
  });

  // Real-time subscription for new messages
  useRealtimeSubscription({
    table: "guest_messages",
    filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined,
    queryKey: queryKeys.guestMessages(conversationId || ""),
    enabled: !!conversationId,
  });

  return result;
}

/**
 * Hook to send a message to a guest
 */
export function useSendGuestMessage() {
  const { user } = useAuth();
  const { data: currentUserHotel } = useCurrentUserHotel();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: string;
    }) => {
      if (!user?.id) {
        throw new Error("No authenticated user");
      }

      if (!conversationId) {
        throw new Error("No conversation ID provided");
      }

      if (!message || !message.trim()) {
        throw new Error("Message cannot be empty");
      }

      if (!currentUserHotel?.hotelId) {
        throw new Error("No hotel ID available");
      }
      // Get conversation to find guest_id
      const { data: conversation, error: convError } = await supabase
        .from("guest_conversation")
        .select("guest_id")
        .eq("id", conversationId)
        .single();

      if (convError || !conversation) {
        throw convError || new Error("Conversation not found");
      }

      // Insert message
      const { data, error } = await supabase
        .from("guest_messages")
        .insert({
          conversation_id: conversationId,
          guest_id: conversation.guest_id,
          hotel_id: currentUserHotel.hotelId,
          sender_type: "hotel_staff",
          message_text: message.trim(),
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update conversation last_message_at
      const { error: updateError } = await supabase
        .from("guest_conversation")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      if (updateError) {
        console.error("Failed to update conversation timestamp:", updateError);
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestMessages(data.conversation_id),
      });
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestConversations(currentUserHotel?.hotelId || ""),
      });
    },
    onError: () => {
      // Error handled by React Query
    },
  });
}

/**
 * Hook to mark guest messages as read
 */
export function useMarkGuestMessagesAsRead() {
  const queryClient = useQueryClient();
  const { data: currentUserHotel } = useCurrentUserHotel();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageIds,
    }: {
      conversationId: string;
      messageIds: string[];
    }) => {
      if (messageIds.length === 0) {
        return { conversationId };
      }
      const { error } = await supabase
        .from("guest_messages")
        .update({ is_read: true })
        .in("id", messageIds);

      if (error) {
        throw error;
      }
      return { conversationId };
    },
    onSuccess: ({ conversationId }) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestMessages(conversationId),
      });
      // Invalidate conversations list to update unread counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestConversations(currentUserHotel?.hotelId || ""),
      });
    },
  });
}
