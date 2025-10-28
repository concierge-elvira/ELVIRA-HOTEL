import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useAuth } from "../../useAuth";

/**
 * Hook to fetch all staff conversations for current user
 */
export function useStaffConversations() {
  const { user } = useAuth();

  const result = useOptimizedQuery({
    queryKey: queryKeys.staffConversations(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      // Get conversations where user is a participant
      const { data, error } = await supabase
        .from("staff_conversation_participants")
        .select(
          `
          conversation_id,
          staff_conversations (
            id,
            last_message_at,
            created_at
          )
        `
        )
        .eq("staff_id", user.id);

      if (error) {
throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
    config: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Staff Conversations",
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "staff_conversation_participants",
    filter: user?.id ? `staff_id=eq.${user.id}` : undefined,
    queryKey: queryKeys.staffConversations(user?.id || ""),
    enabled: !!user?.id,
  });

  return result;
}

/**
 * Hook to get or create a conversation between two staff members
 * Optimized version with parallel queries and caching
 */
export function useGetOrCreateStaffConversation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherStaffId: string) => {
      if (!user?.id) {
        throw new Error("No authenticated user");
      }

      // Use RPC function for fast lookup
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        "get_staff_conversation_between_users",
        {
          user1_id: user.id,
          user2_id: otherStaffId,
        }
      );

      // If conversation exists, return it immediately
      if (!rpcError && rpcResult && rpcResult.length > 0) {
return rpcResult[0];
      }

      // No existing conversation - create new one
// Get hotel_id from query cache or fetch it
      const cachedStaff = queryClient.getQueryData<any[]>([
        "currentHotelStaffList",
      ]);
      const currentStaff = cachedStaff?.find((s) => s.id === user.id);

      let hotelId = currentStaff?.hotel_id;

      // If not in cache, fetch it
      if (!hotelId) {
        const { data: userStaff, error: staffError } = await supabase
          .from("hotel_staff")
          .select("hotel_id")
          .eq("id", user.id)
          .single();

        if (staffError || !userStaff?.hotel_id) {
          throw new Error("Cannot determine hotel for conversation");
        }
        hotelId = userStaff.hotel_id;
      }

      // Create conversation and add participants in parallel using upsert
      const { data: newConversation, error: createError } = await supabase
        .from("staff_conversations")
        .insert({
          hotel_id: hotelId,
          created_by: user.id,
        })
        .select()
        .single();

      if (createError || !newConversation) {
        throw createError || new Error("Failed to create conversation");
      }

      // Add participants
      const { error: addParticipantsError } = await supabase
        .from("staff_conversation_participants")
        .insert([
          { conversation_id: newConversation.id, staff_id: user.id },
          { conversation_id: newConversation.id, staff_id: otherStaffId },
        ]);

      if (addParticipantsError) {
        // Clean up the conversation we just created
        await supabase
          .from("staff_conversations")
          .delete()
          .eq("id", newConversation.id);
        throw addParticipantsError;
      }
return newConversation;
    },
    onSuccess: (data) => {
// Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffConversations(user?.id || ""),
      });

      // Invalidate conversation cache for instant lookups
      queryClient.invalidateQueries({
        queryKey: ["staffConversationCache", user?.id],
      });
    },
  });
}
