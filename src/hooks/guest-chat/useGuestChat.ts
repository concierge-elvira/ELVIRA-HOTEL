/**
 * Guest Chat Hooks
 *
 * Hooks for guest-side messaging with hotel staff
 * Uses guest_messages and guest_conversation tables
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../realtime/useRealtimeSubscription";
import { getGuestSupabaseClient } from "../../services/guestSupabase";
import { queryKeys } from "../../lib/react-query";
import { normalizeLanguageToCode } from "../../utils/languageMapping";

/**
 * Hook to fetch or create a guest's conversation with hotel staff
 */
export function useGuestConversation(guestId?: string, hotelId?: string) {
  return useOptimizedQuery({
    queryKey: queryKeys.guestConversations(guestId || ""),
    queryFn: async () => {
      if (!guestId || !hotelId) {
        return null;
      }

      const supabase = getGuestSupabaseClient();

      // Try to find existing conversation
      const { data: existing, error: findError } = await supabase
        .from("guest_conversation")
        .select("id, guest_id, hotel_id, created_at, last_message_at")
        .eq("guest_id", guestId)
        .eq("hotel_id", hotelId)
        .maybeSingle();

      if (findError) {
        throw findError;
      }

      // If conversation exists, return it
      if (existing) {
        return existing;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from("guest_conversation")
        .insert({
          guest_id: guestId,
          hotel_id: hotelId,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return newConv;
    },
    enabled: !!guestId && !!hotelId,
    config: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,
    },
    logPrefix: "Guest Conversation",
  });
}

/**
 * Hook to fetch messages for guest's conversation
 */
export function useGuestChatMessages(conversationId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.guestMessages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        return [];
      }

      const supabase = getGuestSupabaseClient();

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
          original_language,
          target_language,
          sentiment,
          urgency,
          topic,
          subtopic,
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
    logPrefix: "Guest Chat Messages",
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
 * Hook to send a message from guest to hotel staff with OpenAI analysis
 */
export function useSendGuestChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      guestId,
      hotelId,
      message,
      originalLanguage = "en",
      targetLanguage = "en",
    }: {
      conversationId: string;
      guestId: string;
      hotelId: string;
      message: string;
      originalLanguage?: string;
      targetLanguage?: string;
    }) => {
      if (!message || !message.trim()) {
        throw new Error("Message cannot be empty");
      }

      console.log("💬 [GUEST CHAT] Starting message send...", {
        conversationId,
        guestId,
        hotelId,
        originalLanguage,
        targetLanguage,
        messageLength: message.length,
      });

      const supabase = getGuestSupabaseClient();

      console.log("💾 [GUEST CHAT] Inserting message to database...");
      // Insert message first (immediate send)
      const { data: insertedMessage, error: insertError } = await supabase
        .from("guest_messages")
        .insert({
          conversation_id: conversationId,
          guest_id: guestId,
          hotel_id: hotelId,
          sender_type: "guest",
          message_text: message.trim(),
          original_language: originalLanguage,
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ [GUEST CHAT] Failed to insert message:", insertError);
        throw insertError;
      }

      console.log("✅ [GUEST CHAT] Message inserted successfully:", {
        messageId: insertedMessage.id,
        originalLanguage,
      });

      console.log("⏰ [GUEST CHAT] Updating conversation timestamp...");
      // Update conversation last_message_at
      await supabase
        .from("guest_conversation")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      console.log("✅ [GUEST CHAT] Conversation timestamp updated");

      // Call OpenAI analyzer edge function asynchronously (don't await)
      // This runs in the background so the message sends immediately
      // Normalize languages to ISO codes for consistent translation
      const normalizedOriginalLanguage = normalizeLanguageToCode(originalLanguage);
      const normalizedTargetLanguage = normalizeLanguageToCode(targetLanguage);
      
      console.log("🤖 [GUEST CHAT] Calling OpenAI analyzer (async)...", {
        messageId: insertedMessage.id,
        task: "full_pipeline",
        originalLanguage,
        targetLanguage,
        normalizedOriginalLanguage,
        normalizedTargetLanguage,
        text: message.trim(),
      });

      supabase.functions
        .invoke("openai-analyzer", {
          body: {
            task: "full_pipeline",
            text: message.trim(),
            message_id: insertedMessage.id,
            original_language: normalizedOriginalLanguage,
            targetLanguage: normalizedTargetLanguage, // ISO language code
            hotel_id: hotelId,
          },
        })
        .then(({ data, error }) => {
          if (error) {
            console.error("❌ [GUEST CHAT] OpenAI analysis failed:", {
              error,
              messageId: insertedMessage.id,
              originalLanguage,
              targetLanguage,
            });
          } else {
            console.log("✅ [GUEST CHAT] OpenAI analysis completed:", {
              messageId: insertedMessage.id,
              result: data,
              originalLanguage,
              targetLanguage,
            });
            // Invalidate messages to show updated translation
            queryClient.invalidateQueries({
              queryKey: queryKeys.guestMessages(conversationId),
            });
          }
        })
        .catch((error) => {
          console.error("❌ [GUEST CHAT] Failed to call OpenAI analyzer:", {
            error,
            errorMessage: error?.message,
            messageId: insertedMessage.id,
          });
        });

      console.log("🎉 [GUEST CHAT] Message send complete:", {
        messageId: insertedMessage.id,
        conversationId: insertedMessage.conversation_id,
      });

      return insertedMessage;
    },
    onSuccess: (data) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestMessages(data.conversation_id),
      });
      // Invalidate conversation
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestConversations(data.guest_id),
      });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
  });
}
