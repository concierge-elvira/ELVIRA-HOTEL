import { useState, useEffect } from "react";
import { ConversationList, ChatWindow } from "../common";
import {
  useGuestConversationsList,
  useGuestMessages,
  useSendGuestMessage,
  useMarkGuestMessagesAsRead,
} from "../../../../../hooks/chat-management/guest-communication";
import type { ChatConversation, ChatMessage, ChatUser } from "../types";

export function GuestCommunication() {
  const [searchValue, setSearchValue] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Fetch conversations and messages
  const { data: conversationsList, isLoading: conversationsLoading } =
    useGuestConversationsList();
  const { data: messages, isLoading: messagesLoading } = useGuestMessages(
    conversationId || undefined
  );
  const sendMessage = useSendGuestMessage();
  const markMessagesAsRead = useMarkGuestMessagesAsRead();

  // Get active conversation details
  const activeConversation = conversationsList?.find(
    (c) => c.id === conversationId
  );

  // Mark unread messages as read when opening a conversation
  useEffect(() => {
    if (conversationId && messages) {
      const unreadMessages = messages
        .filter((msg) => !msg.is_read && msg.sender_type === "guest")
        .map((msg) => msg.id);

      if (unreadMessages.length > 0) {
        markMessagesAsRead.mutate({
          conversationId,
          messageIds: unreadMessages,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, messages?.length]);

  // Transform conversations to ChatConversation format
  const conversations: ChatConversation[] = (conversationsList || []).map(
    (conv) => ({
      id: conv.id,
      participantId: conv.guestId,
      participantName: conv.guestName,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      unreadCount: conv.unreadCount,
      status: "active" as const,
      roomNumber: conv.roomNumber || undefined,
    })
  );

  // Get active participant info
  const activeParticipant: ChatUser | undefined =
    activeConversation && conversationId
      ? {
          id: activeConversation.guestId,
          name: activeConversation.guestName,
          status: "online",
          roomNumber: activeConversation.roomNumber || undefined,
        }
      : undefined;

  // Transform messages to ChatMessage format
  const chatMessages: ChatMessage[] = (messages || []).map((msg) => {
    const isStaffMessage = msg.sender_type === "hotel_staff";

    // Display logic:
    // - Staff messages (sent by hotel): show original (what hotel staff typed)
    // - Guest messages (received): show translated version (if available)
    const displayText = isStaffMessage
      ? msg.message_text // Hotel staff sees their own message in original language
      : msg.translated_text || msg.message_text; // Hotel staff sees guest message translated

    return {
      id: msg.id,
      senderId: isStaffMessage ? msg.created_by || "staff" : msg.guest_id || "",
      senderName: isStaffMessage
        ? "Hotel Staff"
        : activeConversation?.guestName || "Guest",
      content: displayText,
      timestamp: new Date(msg.created_at),
      type: "text" as const,
      isOwn: isStaffMessage,
      status: "delivered" as const,
    };
  });

  const handleSendMessage = async (content: string) => {
    if (!conversationId) {
      return;
    }
    try {
      await sendMessage.mutateAsync({
        conversationId,
        message: content,
      });
    } catch (error) {}
  };

  // Handle filter button click
  const handleFilterClick = () => {
    // TODO: Implement filter functionality
  };

  return (
    <div className="h-full flex bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <ConversationList
          conversations={conversations}
          activeConversationId={conversationId || undefined}
          onConversationSelect={setConversationId}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search guests..."
          isLoading={conversationsLoading}
          showFilterButton={true}
          onFilterClick={handleFilterClick}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          participant={activeParticipant}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          inputPlaceholder="Message guest..."
          isLoading={messagesLoading || sendMessage.isPending}
        />
      </div>
    </div>
  );
}
