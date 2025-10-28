import { useState } from "react";
import {
  useMessages,
  useSendMessage,
} from "../hooks/chat-management/useMessages";
import { LoadingSpinner } from "./ui";
import type { Tables } from "../services/supabase";

type Message = Tables<"guest_messages">;

interface RealTimeChatProps {
  conversationId: string;
  guestName: string;
  roomNumber: string;
}

export function RealTimeChat({
  conversationId,
  guestName,
  roomNumber,
}: RealTimeChatProps) {
  const [messageText, setMessageText] = useState("");

  // Fetch messages with React Query (includes real-time subscription)
  const { data: messages, isLoading, error } = useMessages(conversationId);

  // Send message with optimistic updates
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const newMessage = {
      conversation_id: conversationId,
      message_text: messageText,
      sender_type: "staff" as const,
      is_read: false,
      is_translated: false,
    };

    try {
      await sendMessageMutation.mutateAsync(newMessage);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Failed to load messages</div>
          <button
            onClick={() => window.location.reload()}
            className="text-emerald-600 hover:text-emerald-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">{guestName}</h3>
          <p className="text-sm text-gray-500">Room {roomNumber}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Real-time</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages?.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages?.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_type === "staff"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_type === "staff"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.message_text}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(message.created_at).toLocaleTimeString()}
                  {message.id?.startsWith("temp-") && (
                    <span className="ml-1">⏳</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Show sending indicator for optimistic updates */}
        {sendMessageMutation.isPending && (
          <div className="flex justify-end">
            <div className="bg-emerald-400 text-white px-4 py-2 rounded-lg max-w-xs lg:max-w-md opacity-75">
              <p className="text-sm">{messageText}</p>
              <p className="text-xs mt-1">Sending... ⏳</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={sendMessageMutation.isPending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendMessageMutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>

        {/* Error display */}
        {sendMessageMutation.error && (
          <div className="mt-2 text-sm text-red-600">
            Failed to send message. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
