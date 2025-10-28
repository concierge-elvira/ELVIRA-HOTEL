import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useAuth } from "../../useAuth";

/**
 * Hook to fetch messages for a staff conversation
 */
export function useStaffMessages(conversationId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.staffMessages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        return [];
      }

      const { data, error } = await supabase
        .from("staff_messages")
        .select(
          `
          id,
          conversation_id,
          sender_id,
          content,
          created_at,
          sender:hotel_staff!staff_messages_sender_id_fkey (
            id,
            hotel_staff_personal_data (
              first_name,
              last_name
            )
          )
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
    logPrefix: "Staff Messages",
  });

  // Real-time subscription for new messages
  useRealtimeSubscription({
    table: "staff_messages",
    filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined,
    queryKey: queryKeys.staffMessages(conversationId || ""),
    enabled: !!conversationId,
  });

  return result;
}

/**
 * Hook to send a staff message
 */
export function useSendStaffMessage() {
  const { user } = useAuth();
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
      // Insert message
      const { data, error } = await supabase
        .from("staff_messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: message.trim(),
        })
        .select(
          `
          id,
          conversation_id,
          sender_id,
          content,
          created_at,
          sender:hotel_staff!staff_messages_sender_id_fkey (
            id,
            hotel_staff_personal_data (
              first_name,
              last_name
            )
          )
        `
        )
        .single();

      if (error) {
        throw error;
      }

      // Update conversation last_message_at
      const { error: updateError } = await supabase
        .from("staff_conversations")
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
        queryKey: queryKeys.staffMessages(data.conversation_id),
      });
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffConversations(user?.id || ""),
      });
    },
    onError: () => {
      // Error handled by React Query
    },
  });
}
