import { useState } from "react";
import { supabase } from "../../../services/supabase";

interface CreateGroupChatParams {
  hotelId: string;
  createdBy: string;
  groupName: string;
  participantIds: string[];
}

export const useGroupChats = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createGroupChat = async ({
    hotelId,
    createdBy,
    groupName,
    participantIds,
  }: CreateGroupChatParams) => {
    setIsCreating(true);
    try {
      // 1. Create the conversation
      const { data: conversation, error: convError } = await supabase
        .from("staff_conversations")
        .insert({
          hotel_id: hotelId,
          created_by: createdBy,
          is_group: true,
          title: groupName,
        })
        .select("id")
        .single();

      if (convError) throw convError;
      if (!conversation) throw new Error("Failed to create conversation");

      // 2. Add all participants (including creator)
      const allParticipantIds = [...new Set([createdBy, ...participantIds])];

      const participantsToInsert = allParticipantIds.map((staffId) => ({
        conversation_id: conversation.id,
        staff_id: staffId,
      }));

      const { error: participantsError } = await supabase
        .from("staff_conversation_participants")
        .insert(participantsToInsert);

      if (participantsError) throw participantsError;

      // 3. Initialize read status for all participants
      const readsToInsert = allParticipantIds.map((staffId) => ({
        conversation_id: conversation.id,
        staff_id: staffId,
      }));

      const { error: readsError } = await supabase
        .from("staff_conversation_reads")
        .insert(readsToInsert);

      if (readsError) throw readsError;

      return conversation.id;
    } catch (error) {
throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const addParticipants = async (
    conversationId: string,
    staffIds: string[]
  ) => {
    try {
      // Add participants
      const participantsToInsert = staffIds.map((staffId) => ({
        conversation_id: conversationId,
        staff_id: staffId,
      }));

      const { error: participantsError } = await supabase
        .from("staff_conversation_participants")
        .insert(participantsToInsert);

      if (participantsError) throw participantsError;

      // Initialize read status
      const readsToInsert = staffIds.map((staffId) => ({
        conversation_id: conversationId,
        staff_id: staffId,
      }));

      const { error: readsError } = await supabase
        .from("staff_conversation_reads")
        .insert(readsToInsert);

      if (readsError) throw readsError;
    } catch (error) {
throw error;
    }
  };

  const removeParticipant = async (conversationId: string, staffId: string) => {
    try {
      // Remove from participants
      const { error: participantsError } = await supabase
        .from("staff_conversation_participants")
        .delete()
        .eq("conversation_id", conversationId)
        .eq("staff_id", staffId);

      if (participantsError) throw participantsError;

      // Remove read status
      const { error: readsError } = await supabase
        .from("staff_conversation_reads")
        .delete()
        .eq("conversation_id", conversationId)
        .eq("staff_id", staffId);

      if (readsError) throw readsError;
    } catch (error) {
throw error;
    }
  };

  const updateGroupName = async (conversationId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from("staff_conversations")
        .update({ title: newName })
        .eq("id", conversationId);

      if (error) throw error;
    } catch (error) {
throw error;
    }
  };

  return {
    createGroupChat,
    addParticipants,
    removeParticipant,
    updateGroupName,
    isCreating,
  };
};
