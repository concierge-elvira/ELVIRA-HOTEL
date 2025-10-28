import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";

interface GroupParticipant {
  staff_id: string;
  hotel_staff: {
    id: string;
    department: string | null;
    hotel_staff_personal_data: {
      first_name: string;
      last_name: string;
      email: string;
    } | null;
  };
}

interface GroupDetails {
  id: string;
  title: string | null;
  created_by: string;
  participants: GroupParticipant[];
}

/**
 * Hook to fetch group chat details including participants
 */
export function useGroupDetails(conversationId: string | null | undefined) {
  const result = useOptimizedQuery<GroupDetails | null>({
    queryKey: ["groupDetails", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;

      // Fetch conversation details
      const { data: conversation, error: convError } = await supabase
        .from("staff_conversations")
        .select("id, title, created_by, is_group")
        .eq("id", conversationId)
        .eq("is_group", true)
        .single();

      if (convError) {
throw convError;
      }

      if (!conversation) return null;

      // Fetch participants
      const { data: participants, error: participantsError } = await supabase
        .from("staff_conversation_participants")
        .select(
          `
          staff_id,
          hotel_staff!inner (
            id,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .eq("conversation_id", conversationId);

      if (participantsError) {
throw participantsError;
      }

      return {
        id: conversation.id,
        title: conversation.title,
        created_by: conversation.created_by,
        participants: (participants || []) as GroupParticipant[],
      };
    },
    enabled: !!conversationId,
    config: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Group Details",
  });

  // Real-time subscription for participant changes
  useRealtimeSubscription({
    table: "staff_conversation_participants",
    filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined,
    queryKey: ["groupDetails", conversationId],
    enabled: !!conversationId,
  });

  return result;
}
