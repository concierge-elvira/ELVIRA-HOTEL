import { useState, useEffect, useRef } from "react";
import { Button } from "../../../../../components/ui";
import {
  useGetOrCreateStaffConversation,
  useStaffMessages,
  useSendStaffMessage,
  useStaffConversationCache,
  getConversationFromCache,
} from "../../../../../hooks/chat-management";
import { useAuth } from "../../../../../hooks/useAuth";

interface StaffMember {
  id: string;
  hotel_staff_personal_data?: {
    first_name: string;
    last_name: string;
  } | null;
}

interface StaffConversationViewProps {
  otherStaffId: string;
  staffMembers: StaffMember[];
}

export function StaffConversationView({
  otherStaffId,
  staffMembers,
}: StaffConversationViewProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { data: conversationCache } = useStaffConversationCache();
  const getOrCreateConversation = useGetOrCreateStaffConversation();
  const { data: messages, isLoading: messagesLoading } = useStaffMessages(
    conversationId || undefined
  );
  const sendMessage = useSendStaffMessage();

  // Get or create conversation when staff is selected
  useEffect(() => {
    // Wait for user to be loaded
    if (!user?.id) {
      setConversationId(null);
      setIsInitializing(true); // Keep loading while user loads
      return;
    }

    if (!otherStaffId) {
      setConversationId(null);
      setIsInitializing(false);
      return;
    }

    // First, check the cache for instant lookup
    const cachedConversationId = getConversationFromCache(
      conversationCache,
      user.id,
      otherStaffId
    );

    if (cachedConversationId) {
setConversationId(cachedConversationId);
      setIsInitializing(false);
      return;
    }

    // Not in cache - fetch or create
    setIsInitializing(true);

    const initConversation = async () => {
      try {
        const conversation = await getOrCreateConversation.mutateAsync(
          otherStaffId
        );
        setConversationId(conversation.id);
      } catch (error) {
} finally {
        setIsInitializing(false);
      }
    };

    initConversation();
  }, [otherStaffId, conversationCache, user?.id]); // Add cache to dependencies, not conversationId

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get other staff member info
  const otherStaff = staffMembers.find((s) => s.id === otherStaffId);
  const otherStaffName = otherStaff?.hotel_staff_personal_data
    ? `${otherStaff.hotel_staff_personal_data.first_name} ${otherStaff.hotel_staff_personal_data.last_name}`
    : "Unknown";

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversationId || sendMessage.isPending) {
      return;
    }

    try {
      await sendMessage.mutateAsync({
        conversationId,
        message: messageText,
      });
      setMessageText("");
    } catch (error) {
}
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show minimal loading state
  if (isInitializing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (getOrCreateConversation.isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-semibold">Failed to load conversation</p>
          <p className="text-sm mt-2">
            {getOrCreateConversation.error instanceof Error
              ? getOrCreateConversation.error.message
              : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Preparing conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{otherStaffName}</h3>
        <p className="text-xs text-gray-500">
          {otherStaff?.hotel_staff_personal_data ? "Online" : ""}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading messages...</p>
            </div>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message: any) => {
            const isCurrentUser = message.sender_id === user?.id;
            const senderName = message.sender?.hotel_staff_personal_data
              ? `${message.sender.hotel_staff_personal_data.first_name} ${message.sender.hotel_staff_personal_data.last_name}`
              : "Unknown";

            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="text-xs font-semibold mb-1">
                      {senderName}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.message}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "text-emerald-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${otherStaffName}...`}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={2}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessage.isPending}
          >
            {sendMessage.isPending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </>
  );
}
