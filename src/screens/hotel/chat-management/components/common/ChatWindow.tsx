import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import type { ChatMessage, ChatUser } from "../types";

interface ChatWindowProps {
  participant?: ChatUser;
  messages: ChatMessage[];
  onSendMessage: (content: string, type: "text" | "file") => void;
  onlineCount?: number;
  showVideoCall?: boolean;
  showPhoneCall?: boolean;
  onVideoCall?: () => void;
  onPhoneCall?: () => void;
  onInfo?: () => void;
  onAvatarClick?: () => void;
  inputPlaceholder?: string;
  isLoading?: boolean;
}

export function ChatWindow({
  participant,
  messages,
  onSendMessage,
  onlineCount,
  showVideoCall = false,
  showPhoneCall = false,
  onVideoCall,
  onPhoneCall,
  onInfo,
  onAvatarClick,
  inputPlaceholder,
  isLoading = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!participant) {
    return (
      <div className="h-full flex flex-col">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20V16Z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No conversation selected
            </h3>
            <p className="text-gray-500">
              Choose a conversation from the sidebar to start chatting
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <ChatHeader
        participant={participant}
        onlineCount={onlineCount}
        showVideoCall={showVideoCall}
        showPhoneCall={showPhoneCall}
        onVideoCall={onVideoCall}
        onPhoneCall={onPhoneCall}
        onInfo={onInfo}
        onAvatarClick={onAvatarClick}
      />

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto bg-gray-50"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`
          .flex-1::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="p-4 space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center space-x-2 text-gray-500">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                </svg>
                <span>Loading messages...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20V16Z" />
                </svg>
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start the conversation by sending a message
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                showAvatar={true}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        placeholder={inputPlaceholder}
        disabled={isLoading}
      />
    </div>
  );
}
