import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useAuth } from "../../useAuth";

/**
 * Hook to cache all conversation mappings for quick lookup
 * This prevents the need to query the database every time a staff member is selected
 */
export function useStaffConversationCache() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["staffConversationCache", user?.id],
    queryFn: async () => {
      if (!user?.id) return {};

      // Get all conversations where user is a participant
      const { data: participants, error } = await supabase
        .from("staff_conversation_participants")
        .select(
          `
          conversation_id,
          staff_id,
          staff_conversations!inner (
            id,
            created_at
          )
        `
        );

      if (error) {
return {};
      }

      if (!participants) return {};

      // Build a map of staff pairs to conversation IDs
      const cache: Record<string, string> = {};

      // Group participants by conversation
      const conversationMap: Record<string, string[]> = {};
      participants.forEach((p) => {
        if (!conversationMap[p.conversation_id]) {
          conversationMap[p.conversation_id] = [];
        }
        conversationMap[p.conversation_id].push(p.staff_id);
      });

      // Create lookup keys for 1-on-1 conversations
      Object.entries(conversationMap).forEach(([conversationId, staffIds]) => {
        // Only process 1-on-1 conversations
        if (staffIds.length === 2) {
          // Create lookup key for both directions
          const key1 = `${staffIds[0]}-${staffIds[1]}`;
          const key2 = `${staffIds[1]}-${staffIds[0]}`;
          cache[key1] = conversationId;
          cache[key2] = conversationId;
        }
      });
return cache;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Get conversation ID from cache for a staff pair
 */
export function getConversationFromCache(
  cache: Record<string, string> | undefined,
  userId: string,
  otherStaffId: string
): string | null {
  if (!cache) return null;
  const key = `${userId}-${otherStaffId}`;
  return cache[key] || null;
}
