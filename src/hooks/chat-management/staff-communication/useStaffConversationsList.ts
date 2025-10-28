import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useAuth } from "../../useAuth";

export interface StaffConversationDetail {
  id: string;
  isGroup: boolean;
  title?: string;
  participantId?: string; // For 1-on-1 conversations
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status?: "online" | "offline" | "active";
  department?: string;
  participantCount?: number; // For group chats
}

/**
 * Hook to fetch all staff conversations with full details (both 1-on-1 and groups)
 * This replaces the simple staff member list with actual conversation data
 */
export function useStaffConversationsList() {
  const { user } = useAuth();

  const result = useOptimizedQuery<StaffConversationDetail[]>({
    queryKey: queryKeys.staffConversations(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
// Get all conversations where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from("staff_conversation_participants")
        .select(
          `
          conversation_id,
          staff_conversations!inner (
            id,
            is_group,
            title,
            last_message_at,
            created_at,
            last_message_id
          )
        `
        )
        .eq("staff_id", user.id)
        .order("staff_conversations(last_message_at)", { ascending: false });

      if (participantError) {
throw participantError;
      }

      if (!participantData || participantData.length === 0) {
return [];
      }
// Extract conversation IDs and last message IDs
      const conversationIds = participantData.map(
        (p) => (p.staff_conversations as { id: string }).id
      );
      const lastMessageIds = participantData
        .map(
          (p) =>
            (p.staff_conversations as { last_message_id: string | null })
              .last_message_id
        )
        .filter((id): id is string => id !== null);

      // OPTIMIZATION: Fetch all data in parallel instead of per-conversation
      const [allParticipantsResult, lastMessagesResult, readStatusResult] =
        await Promise.all([
          // Get all participants for all conversations at once
          supabase
            .from("staff_conversation_participants")
            .select(
              `
            conversation_id,
            staff_id,
            hotel_staff!inner (
              id,
              department,
              hotel_staff_personal_data (
                first_name,
                last_name
              )
            )
          `
            )
            .in("conversation_id", conversationIds),

          // Get all last messages at once (if any exist)
          lastMessageIds.length > 0
            ? supabase
                .from("staff_messages")
                .select("id, message")
                .in("id", lastMessageIds)
                .is("deleted_at", null)
            : Promise.resolve({ data: [], error: null }),

          // Get all read statuses at once
          supabase
            .from("staff_conversation_reads")
            .select("conversation_id, last_read_at")
            .in("conversation_id", conversationIds)
            .eq("staff_id", user.id),
        ]);

      const { data: allParticipantsData, error: allParticipantsError } =
        allParticipantsResult;
      const { data: lastMessagesData } = lastMessagesResult;
      const { data: readStatusData } = readStatusResult;

      if (allParticipantsError) {
throw allParticipantsError;
      }

      // Create lookup maps for O(1) access
      interface ParticipantData {
        conversation_id: string;
        staff_id: string;
        hotel_staff: {
          id: string;
          department: string | null;
          hotel_staff_personal_data: {
            first_name: string;
            last_name: string;
          } | null;
        };
      }

      const participantsByConversation = new Map<string, ParticipantData[]>();
      if (allParticipantsData && Array.isArray(allParticipantsData)) {
        for (const participant of allParticipantsData) {
          const convId = (participant as ParticipantData).conversation_id;
          if (!participantsByConversation.has(convId)) {
            participantsByConversation.set(convId, []);
          }
          participantsByConversation
            .get(convId)!
            .push(participant as ParticipantData);
        }
      }

      const lastMessageById = new Map<string, string>();
      if (lastMessagesData && Array.isArray(lastMessagesData)) {
        for (const msg of lastMessagesData) {
          // Type assertion needed because TypeScript types say 'content' but DB has 'message'
          const messageData = msg as unknown as {
            id: string;
            message?: string;
          };
          const messageText = messageData.message || "";
          lastMessageById.set(messageData.id, messageText);
        }
      }

      const readStatusByConversation = new Map<
        string,
        { last_read_at: string }
      >();
      if (readStatusData && Array.isArray(readStatusData)) {
        for (const status of readStatusData) {
          readStatusByConversation.set(status.conversation_id, status);
        }
      }

      // Process conversations using the lookup maps
      const validConversations: StaffConversationDetail[] = [];

      for (const participant of participantData) {
        const conversation = participant.staff_conversations as {
          id: string;
          is_group: boolean | null;
          title: string | null;
          last_message_at: string | null;
          created_at: string | null;
          last_message_id: string | null;
        };

        const conversationParticipants =
          participantsByConversation.get(conversation.id) || [];
        const lastMessageText = conversation.last_message_id
          ? lastMessageById.get(conversation.last_message_id) || ""
          : "";

        // Calculate unread count
        let unreadCount = 0;
        const readStatus = readStatusByConversation.get(conversation.id);

        if (conversation.last_message_at && readStatus) {
          const lastMessageTime = new Date(
            conversation.last_message_at
          ).getTime();
          const lastReadTime = new Date(readStatus.last_read_at).getTime();
          unreadCount = lastMessageTime > lastReadTime ? 1 : 0;
        } else if (conversation.last_message_id && !readStatus) {
          unreadCount = 1;
        }

        const isGroup = conversation.is_group;

        if (isGroup) {
          // Group conversation
          validConversations.push({
            id: conversation.id,
            isGroup: true,
            title: conversation.title || undefined,
            participantName: conversation.title || "Unnamed Group",
            lastMessage: lastMessageText,
            lastMessageTime: conversation.last_message_at
              ? new Date(conversation.last_message_at)
              : new Date(conversation.created_at || Date.now()),
            unreadCount,
            status: "active" as const,
            participantCount: conversationParticipants.length,
          });
        } else {
          // 1-on-1 conversation - get the other participant
          const otherParticipant = conversationParticipants.find(
            (p: { staff_id: string }) => p.staff_id !== user.id
          );

          if (!otherParticipant) {
continue;
          }

          const staffData = otherParticipant.hotel_staff as {
            id: string;
            department: string | null;
            hotel_staff_personal_data: {
              first_name: string;
              last_name: string;
            } | null;
          };
          const personalData = staffData?.hotel_staff_personal_data;

          validConversations.push({
            id: conversation.id,
            isGroup: false,
            participantId: otherParticipant.staff_id,
            participantName: personalData
              ? `${personalData.first_name} ${personalData.last_name}`
              : "Unknown",
            lastMessage: lastMessageText,
            lastMessageTime: conversation.last_message_at
              ? new Date(conversation.last_message_at)
              : new Date(conversation.created_at || Date.now()),
            unreadCount,
            status: "active" as const,
            department: staffData?.department || undefined,
          });
        }
      }

      // Sort conversations alphabetically by participant name
      validConversations.sort((a, b) =>
        a.participantName.localeCompare(b.participantName)
      );
return validConversations;
    },
    enabled: !!user?.id,
    config: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Staff Conversations List",
  });

  // Real-time subscription for conversation updates
  useRealtimeSubscription({
    table: "staff_conversations",
    queryKey: queryKeys.staffConversations(user?.id || ""),
    enabled: !!user?.id,
  });

  // Real-time subscription for participant changes
  useRealtimeSubscription({
    table: "staff_conversation_participants",
    filter: user?.id ? `staff_id=eq.${user.id}` : undefined,
    queryKey: queryKeys.staffConversations(user?.id || ""),
    enabled: !!user?.id,
  });

  // Real-time subscription for new messages
  useRealtimeSubscription({
    table: "staff_messages",
    queryKey: queryKeys.staffConversations(user?.id || ""),
    enabled: !!user?.id,
  });

  return result;
}
