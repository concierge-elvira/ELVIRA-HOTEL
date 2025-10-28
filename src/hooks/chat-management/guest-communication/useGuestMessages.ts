import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useAuth } from "../../useAuth";
import { useCurrentUserHotel } from "../../useCurrentUserHotel";
import { normalizeLanguageToCode } from "../../../utils/languageMapping";

/**
 * Hook to fetch messages for a guest conversation
 */
export function useGuestMessages(conversationId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.guestMessages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        console.log("⚠️ [HOTEL CHAT FETCH] No conversation ID provided");
        return [];
      }

      console.log(
        "📥 [HOTEL CHAT FETCH] Fetching messages for conversation:",
        conversationId
      );

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
          created_by,
          original_language,
          target_language
        `
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ [HOTEL CHAT FETCH] Failed to fetch messages:", error);
        throw error;
      }

      console.log("✅ [HOTEL CHAT FETCH] Messages fetched successfully:", {
        conversationId,
        messageCount: data?.length || 0,
        messages: data?.map((msg) => ({
          id: msg.id,
          senderType: msg.sender_type,
          originalLanguage: msg.original_language,
          targetLanguage: msg.target_language,
          hasTranslation: !!msg.translated_text,
          isTranslated: msg.is_translated,
          messagePreview: msg.message_text?.substring(0, 50),
          translatedPreview: msg.translated_text?.substring(0, 50),
        })),
      });

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
      console.log("🏨 [HOTEL CHAT] Starting message send...", {
        conversationId,
        messageLength: message.length,
        userId: user?.id,
        hotelId: currentUserHotel?.hotelId,
      });

      if (!user?.id) {
        console.error("❌ [HOTEL CHAT] No authenticated user");
        throw new Error("No authenticated user");
      }

      if (!conversationId) {
        console.error("❌ [HOTEL CHAT] No conversation ID provided");
        throw new Error("No conversation ID provided");
      }

      if (!message || !message.trim()) {
        console.error("❌ [HOTEL CHAT] Message cannot be empty");
        throw new Error("Message cannot be empty");
      }

      if (!currentUserHotel?.hotelId) {
        console.error("❌ [HOTEL CHAT] No hotel ID available");
        throw new Error("No hotel ID available");
      }

      console.log("📞 [HOTEL CHAT] Fetching conversation details...");
      // Get conversation to find guest_id and guest language
      const { data: conversation, error: convError } = await supabase
        .from("guest_conversation")
        .select(
          `
          guest_id,
          hotel_id
        `
        )
        .eq("id", conversationId)
        .single();

      if (convError || !conversation) {
        console.error(
          "❌ [HOTEL CHAT] Failed to fetch conversation:",
          convError
        );
        throw convError || new Error("Conversation not found");
      }

      console.log("✅ [HOTEL CHAT] Conversation found:", {
        guestId: conversation.guest_id,
        hotelId: conversation.hotel_id,
      });

      // Fetch guest's language from guest_personal_data table
      console.log("👤 [HOTEL CHAT] Fetching guest language...");
      const { data: guestData, error: guestError } = await supabase
        .from("guest_personal_data")
        .select("language")
        .eq("guest_id", conversation.guest_id)
        .single();

      if (guestError) {
        console.error(
          "⚠️ [HOTEL CHAT] Failed to fetch guest language:",
          guestError
        );
      }

      const guestLanguage = guestData?.language || "en";

      console.log("✅ [HOTEL CHAT] Guest language fetched:", {
        guestId: conversation.guest_id,
        guestLanguage,
        guestData,
      });

      console.log("🏨 [HOTEL CHAT] Fetching hotel language settings...");
      // Get hotel's official language
      const { data: hotel, error: hotelError } = await supabase
        .from("hotels")
        .select("official_languages")
        .eq("id", currentUserHotel.hotelId)
        .single();

      if (hotelError) {
        console.error(
          "⚠️ [HOTEL CHAT] Failed to fetch hotel language:",
          hotelError
        );
      }

      // Handle official_languages which can be a string or array
      const hotelLanguage = Array.isArray(hotel?.official_languages)
        ? hotel.official_languages[0] || "en"
        : hotel?.official_languages || "en";

      console.log("🌍 [HOTEL CHAT] Language configuration:", {
        hotelLanguage,
        guestLanguage,
        hotelLanguagesRaw: hotel?.official_languages,
        shouldTranslate:
          hotelLanguage.toLowerCase() !== guestLanguage.toLowerCase(),
        hotelData: hotel,
        guestData,
      });

      console.log("💾 [HOTEL CHAT] Inserting message to database...");
      // Insert message first (immediate send)
      const { data, error } = await supabase
        .from("guest_messages")
        .insert({
          conversation_id: conversationId,
          guest_id: conversation.guest_id,
          hotel_id: currentUserHotel.hotelId,
          sender_type: "hotel_staff",
          message_text: message.trim(),
          original_language: hotelLanguage,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ [HOTEL CHAT] Failed to insert message:", error);
        throw error;
      }

      console.log("✅ [HOTEL CHAT] Message inserted successfully:", {
        messageId: data.id,
        originalLanguage: hotelLanguage,
        messageText: message.trim(),
      });

      // Call OpenAI analyzer asynchronously to translate hotel message to guest's language
      // This runs in the background so the message sends immediately
      // Normalize languages to ISO codes for consistent translation
      const normalizedHotelLanguage = normalizeLanguageToCode(hotelLanguage);
      const normalizedGuestLanguage = normalizeLanguageToCode(guestLanguage);

      console.log("🤖 [HOTEL CHAT] Calling OpenAI translator (async)...", {
        messageId: data.id,
        task: "translate",
        originalLanguage: hotelLanguage,
        targetLanguage: guestLanguage,
        normalizedHotelLanguage,
        normalizedGuestLanguage,
        text: message.trim(),
      });

      supabase.functions
        .invoke("openai-analyzer", {
          body: {
            task: "translate",
            text: message.trim(),
            message_id: data.id,
            original_language: normalizedHotelLanguage,
            targetLanguage: normalizedGuestLanguage, // ISO language code
          },
        })
        .then(({ data: analysisResult, error: analysisError }) => {
          if (analysisError) {
            console.error("❌ [HOTEL CHAT] Translation failed:", {
              error: analysisError,
              messageId: data.id,
              originalLanguage: hotelLanguage,
              targetLanguage: guestLanguage,
            });
          } else {
            console.log("✅ [HOTEL CHAT] Translation completed successfully:", {
              messageId: data.id,
              result: analysisResult,
              originalLanguage: hotelLanguage,
              targetLanguage: guestLanguage,
            });
            // Invalidate messages to show updated translation
            queryClient.invalidateQueries({
              queryKey: queryKeys.guestMessages(conversationId),
            });
          }
        })
        .catch((error) => {
          console.error("❌ [HOTEL CHAT] Failed to call translator:", {
            error,
            errorMessage: error?.message,
            errorStack: error?.stack,
            messageId: data.id,
          });
        });

      console.log("⏰ [HOTEL CHAT] Updating conversation timestamp...");
      // Update conversation last_message_at
      const { error: updateError } = await supabase
        .from("guest_conversation")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      if (updateError) {
        console.error(
          "⚠️ [HOTEL CHAT] Failed to update conversation timestamp:",
          updateError
        );
      } else {
        console.log("✅ [HOTEL CHAT] Conversation timestamp updated");
      }

      console.log("🎉 [HOTEL CHAT] Message send complete:", {
        messageId: data.id,
        conversationId: data.conversation_id,
      });

      return data;
    },
    onSuccess: (data) => {
      console.log("✅ [HOTEL CHAT] onSuccess callback triggered:", {
        messageId: data.id,
        conversationId: data.conversation_id,
      });

      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestMessages(data.conversation_id),
      });
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestConversations(currentUserHotel?.hotelId || ""),
      });

      console.log("✅ [HOTEL CHAT] Queries invalidated successfully");
    },
    onError: (error) => {
      console.error("❌ [HOTEL CHAT] onError callback triggered:", {
        error,
        errorMessage: error?.message,
        errorStack: error?.stack,
      });
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
