/**
 * Guest Chat Screen
 *
 * Full-screen chat interface for guests to communicate with hotel staff
 * Reuses chat components from hotel chat management
 * Integrates with OpenAI analyzer for message analysis and translation
 */

import React, { useEffect } from "react";
import { X, Phone } from "lucide-react";
import { ChatWindow } from "../../../screens/hotel/chat-management/components/common/ChatWindow";
import type {
  ChatMessage,
  ChatUser,
} from "../../../screens/hotel/chat-management/components/types";
import { useGuestAuth } from "../../../contexts/guest";
import {
  useGuestConversation,
  useGuestChatMessages,
  useSendGuestChatMessage,
  useMarkGuestMessagesAsRead,
} from "../../../hooks/guest-chat";

interface GuestChatScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestChatScreen: React.FC<GuestChatScreenProps> = ({
  isOpen,
  onClose,
}) => {
  const { guestSession } = useGuestAuth();

  // Get guest and hotel IDs
  const guestId = guestSession?.guestData?.id;
  const hotelId = guestSession?.guestData?.hotel_id;
  const guestName = guestSession?.guestData?.guest_name || "Guest";
  const hotelName = guestSession?.hotelData?.name || "Hotel Staff";

  // Get or create conversation
  const { data: conversation, isLoading: conversationLoading } =
    useGuestConversation(guestId, hotelId);

  // Get messages for this conversation
  const { data: messages, isLoading: messagesLoading } = useGuestChatMessages(
    conversation?.id
  );

  // Send message mutation
  const sendMessage = useSendGuestChatMessage();

  // Mark messages as read mutation
  const markAsRead = useMarkGuestMessagesAsRead();

  // Mark messages as read when chat opens
  useEffect(() => {
    if (isOpen && conversation?.id) {
      markAsRead.mutate(conversation.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, conversation?.id]);

  // Hotel staff participant (required for ChatWindow to show messages)
  const hotelStaff: ChatUser = {
    id: "hotel-staff",
    name: hotelName,
    avatar: undefined,
    status: "online",
  };

  // Transform messages to ChatMessage format
  const chatMessages: ChatMessage[] = (messages || []).map((msg) => {
    const isGuestMessage = msg.sender_type === "guest";

    // Display logic:
    // - Guest messages (sent by guest): show original (what guest typed)
    // - Hotel staff messages (received): show translated version (if available)
    const displayText = isGuestMessage
      ? msg.message_text // Guest sees their own message in original language
      : msg.translated_text || msg.message_text; // Guest sees hotel staff message translated

    return {
      id: msg.id,
      senderId: isGuestMessage ? msg.guest_id || "" : "hotel-staff",
      senderName: isGuestMessage ? guestName : "Hotel Staff",
      content: displayText,
      timestamp: new Date(msg.created_at),
      type: "text" as const,
      isOwn: isGuestMessage,
      status: msg.is_read ? "read" : "delivered",
    };
  });

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !conversation?.id || !guestId || !hotelId) {
      return;
    }

    try {
      // Get guest's language preference from guest_personal_data
      const guestLanguage =
        guestSession?.guestData?.guest_personal_data?.language || "en";

      // Get hotel's official language from hotels table
      // Handle official_languages which can be a string or array
      const hotelOfficialLanguages =
        guestSession?.hotelData?.official_languages;
      const hotelLanguage = Array.isArray(hotelOfficialLanguages)
        ? hotelOfficialLanguages[0] || "en"
        : hotelOfficialLanguages || "en";

      console.log("🎯 [GUEST CHAT] Sending message with languages:", {
        guestLanguage,
        hotelLanguage,
        originalLanguagesData: hotelOfficialLanguages,
      });

      // Guest sends in their language, translate to hotel's official language
      await sendMessage.mutateAsync({
        conversationId: conversation.id,
        guestId,
        hotelId,
        message: content,
        originalLanguage: guestLanguage,
        targetLanguage: hotelLanguage, // Translate to hotel's official language
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isOpen) return null;

  const isLoading =
    conversationLoading || messagesLoading || sendMessage.isPending;

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      {/* Custom Header with Hotel Name and Close Button */}
      <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">{hotelName}</h1>
          <p className="text-sm text-emerald-100">Chat with Hotel Staff</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
            aria-label="Call hotel"
            // TODO: Add call handler here
          >
            <Phone className="w-6 h-6" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chat Window - Reused Component */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Hide the ChatHeader by wrapping and using custom CSS */}
          <style>{`
            .guest-chat-window .h-16.border-b {
              display: none;
            }
          `}</style>
          <div className="guest-chat-window h-full">
            <ChatWindow
              participant={hotelStaff}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              inputPlaceholder="Type your message to hotel staff..."
              isLoading={isLoading}
              showVideoCall={false}
              showPhoneCall={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
