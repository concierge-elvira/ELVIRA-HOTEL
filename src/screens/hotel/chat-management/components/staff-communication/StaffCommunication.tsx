import { useState } from "react";
import { ConversationList } from "../common/ConversationList";
import { ChatWindow } from "../common/ChatWindow";
import { CreateGroupChatModal, GroupParticipantsModal } from "../modals";
import {
  useCurrentHotelStaffList,
  useGetOrCreateStaffConversation,
  useStaffMessages,
  useSendStaffMessage,
  useStaffConversationCache,
  getConversationFromCache,
  useGroupChats,
  useStaffConversationsList,
  useGroupDetails,
} from "../../../../../hooks/chat-management";
import { useAuth } from "../../../../../hooks/useAuth";
import { useCurrentUserHotel } from "../../../../../hooks/useCurrentUserHotel";
import type { ChatConversation, ChatUser, ChatMessage } from "../types";

export function StaffCommunication() {
  const [searchValue, setSearchValue] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  const { user } = useAuth();
  const { data: currentUserHotel } = useCurrentUserHotel();
  const { data: staffMembers } = useCurrentHotelStaffList(); // Still needed for group modal

  // Use the new hook to get actual conversations from database
  const { data: conversationsList, isLoading: conversationsLoading } =
    useStaffConversationsList();

  const { data: conversationCache } = useStaffConversationCache();
  const getOrCreateConversation = useGetOrCreateStaffConversation();
  const { data: messages, isLoading: messagesLoading } = useStaffMessages(
    conversationId || undefined
  );
  const sendMessage = useSendStaffMessage();
  const { createGroupChat, removeParticipant, addParticipants } =
    useGroupChats();

  // Get active conversation details
  const activeConversation = conversationsList?.find(
    (c) => c.id === conversationId
  );

  // Fetch group details if it's a group chat
  const { data: groupDetails } = useGroupDetails(
    activeConversation?.isGroup ? conversationId : null
  );

  // Handle add button click
  const handleAddClick = () => {
    setIsGroupModalOpen(true);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    // TODO: Implement filter functionality
  };

  // Handle avatar click to show group participants
  const handleAvatarClick = () => {
    if (activeConversation?.isGroup) {
      setIsParticipantsModalOpen(true);
    }
  };

  // Handle removing a participant from group
  const handleRemoveParticipant = async (participantId: string) => {
    if (!conversationId) return;
    await removeParticipant(conversationId, participantId);
  };

  // Handle adding participants to group
  const handleAddParticipants = async (staffIds: string[]) => {
    if (!conversationId) return;
    await addParticipants(conversationId, staffIds);
  };

  // Handle group chat creation
  const handleCreateGroup = async (
    groupName: string,
    selectedStaffIds: string[]
  ) => {
    if (!user?.id || !currentUserHotel?.hotelId) {
      return;
    }

    try {
      const newConversationId = await createGroupChat({
        hotelId: currentUserHotel.hotelId,
        createdBy: user.id,
        groupName,
        participantIds: selectedStaffIds,
      });
      // Select the new conversation
      setConversationId(newConversationId);
    } catch {
      // Re-throw to let modal handle error state
      throw new Error("Failed to create group chat");
    }
  };

  // Handle staff selection and conversation creation
  const handleStaffSelect = async (conversationIdOrStaffId: string) => {
    // Check if this is an existing conversation
    const existingConversation = conversationsList?.find(
      (c) => c.id === conversationIdOrStaffId
    );

    if (existingConversation) {
      // It's an existing conversation (including groups)
      setConversationId(conversationIdOrStaffId);
      return;
    }

    // It's a staff member ID - create or get 1-on-1 conversation
    if (!user?.id) {
      return;
    }

    // Check cache first
    const cachedConversationId = getConversationFromCache(
      conversationCache,
      user.id,
      conversationIdOrStaffId
    );

    if (cachedConversationId) {
      setConversationId(cachedConversationId);
      return;
    }

    // Get or create conversation
    try {
      const conversation = await getOrCreateConversation.mutateAsync(
        conversationIdOrStaffId
      );
      setConversationId(conversation.id);
    } catch {
      console.error("Failed to get or create conversation");
    }
  };

  // Transform conversations from database to display format
  const activeConversations: ChatConversation[] = (conversationsList || []).map(
    (conv) => ({
      id: conv.id,
      participantId: conv.participantId || undefined,
      participantName: conv.participantName,
      participantAvatar: conv.participantAvatar,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      unreadCount: conv.unreadCount,
      status: "active" as const,
      department: conv.department,
      isGroup: conv.isGroup,
      participantCount: conv.participantCount,
    })
  );

  // Get staff members who don't have active conversations
  const staffWithoutConversations: ChatConversation[] = (staffMembers || [])
    .filter(
      (staff) =>
        // Exclude current user
        staff.id !== user?.id &&
        // Exclude staff who already have conversations
        !activeConversations.some((conv) => conv.participantId === staff.id)
    )
    .map((staff) => ({
      id: staff.id,
      participantId: staff.id,
      participantName: staff.hotel_staff_personal_data
        ? `${staff.hotel_staff_personal_data.first_name} ${staff.hotel_staff_personal_data.last_name}`
        : "Unknown",
      participantAvatar: undefined,
      lastMessage: "", // Empty string instead of undefined
      lastMessageTime: undefined,
      unreadCount: 0,
      status: "active" as const,
      department: staff.department,
      isGroup: false,
      participantCount: undefined,
    }));

  // Combine active conversations and available staff, sorted alphabetically
  // Active conversations (with messages) appear first, then staff without conversations
  const conversations: ChatConversation[] = [
    ...activeConversations,
    ...staffWithoutConversations.sort((a, b) =>
      a.participantName.localeCompare(b.participantName)
    ),
  ];

  // Get active participant or group info
  const activeParticipant: ChatUser | undefined =
    activeConversation && conversationId
      ? {
          id: activeConversation.isGroup
            ? conversationId
            : activeConversation.participantId || conversationId,
          name: activeConversation.participantName,
          status: "online", // TODO: Get real online status
          department: activeConversation.department,
        }
      : undefined;

  // Transform messages to ChatMessage format
  interface StaffMessage {
    id: string;
    sender_id: string;
    content: string | null;
    created_at: string | null;
    sender: {
      id: string;
      hotel_staff_personal_data: {
        first_name: string;
        last_name: string;
      } | null;
    } | null;
  }

  const chatMessages: ChatMessage[] = (messages || []).map(
    (msg: StaffMessage) => ({
      id: msg.id,
      senderId: msg.sender_id,
      senderName: msg.sender?.hotel_staff_personal_data
        ? `${msg.sender.hotel_staff_personal_data.first_name} ${msg.sender.hotel_staff_personal_data.last_name}`
        : "Unknown",
      content: msg.content || "",
      timestamp: new Date(msg.created_at || Date.now()),
      type: "text" as const,
      isOwn: msg.sender_id === user?.id,
      status: "delivered" as const,
    })
  );

  const handleSendMessage = async (content: string) => {
    if (!conversationId) {
      return;
    }
    try {
      await sendMessage.mutateAsync({
        conversationId,
        message: content,
      });
    } catch {
      console.error("Failed to send message");
    }
  };

  return (
    <div className="h-full flex bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Staff List Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <ConversationList
          conversations={conversations}
          activeConversationId={conversationId || undefined}
          onConversationSelect={handleStaffSelect}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search staff..."
          isLoading={conversationsLoading}
          showAddButton={true}
          showFilterButton={true}
          onAddClick={handleAddClick}
          onFilterClick={handleFilterClick}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          participant={activeParticipant}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onAvatarClick={
            activeConversation?.isGroup ? handleAvatarClick : undefined
          }
          inputPlaceholder="Message staff member..."
          isLoading={messagesLoading || getOrCreateConversation.isPending}
        />
      </div>

      {/* Create Group Chat Modal */}
      <CreateGroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        staffMembers={staffMembers || []}
        currentUserId={user?.id || ""}
        onCreateGroup={handleCreateGroup}
      />

      {/* Group Participants Modal */}
      {groupDetails && (
        <GroupParticipantsModal
          isOpen={isParticipantsModalOpen}
          onClose={() => setIsParticipantsModalOpen(false)}
          groupName={groupDetails.title || "Unnamed Group"}
          participants={groupDetails.participants}
          currentUserId={user?.id || ""}
          creatorId={groupDetails.created_by}
          availableStaff={staffMembers || []}
          onRemoveParticipant={handleRemoveParticipant}
          onAddParticipants={handleAddParticipants}
        />
      )}
    </div>
  );
}
