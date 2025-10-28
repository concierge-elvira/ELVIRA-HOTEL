import type { ChatMessage } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
  showAvatar?: boolean;
}

export function MessageBubble({
  message,
  showAvatar = true,
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (message.type === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 mb-4 ${message.isOwn ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      {showAvatar && !message.isOwn && (
        <div className="shrink-0">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {message.senderName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div
        className={`flex flex-col ${
          message.isOwn ? "items-end" : "items-start"
        } max-w-xs lg:max-w-md`}
      >
        {/* Sender Name (for incoming messages) */}
        {!message.isOwn && showAvatar && (
          <span className="text-xs text-gray-500 mb-1">
            {message.senderName}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`
            px-4 py-2 rounded-2xl wrap-break-word
            ${
              message.isOwn
                ? "bg-emerald-500 text-white rounded-br-md"
                : "bg-gray-100 text-gray-900 rounded-bl-md"
            }
          `}
        >
          {message.type === "text" && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}

          {message.type === "image" && (
            <div className="space-y-2">
              <img
                src={message.content}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}

          {message.type === "file" && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              <span className="text-sm underline">{message.content}</span>
            </div>
          )}
        </div>

        {/* Timestamp and Status */}
        <div
          className={`flex items-center gap-1 mt-1 ${
            message.isOwn ? "flex-row-reverse" : ""
          }`}
        >
          <span className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </span>

          {message.isOwn && message.status && (
            <div className="flex items-center">
              {message.status === "sent" && (
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                </svg>
              )}
              {message.status === "delivered" && (
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71,7.21L20.12,5.79L9,16.91L3.88,11.79L5.29,10.38L9,14.09L18.71,7.21Z" />
                  <path d="M16.5,10.5L15.09,9.09L9,15.18L6.91,13.09L5.5,14.5L9,18L16.5,10.5Z" />
                </svg>
              )}
              {message.status === "read" && (
                <svg
                  className="w-3 h-3 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71,7.21L20.12,5.79L9,16.91L3.88,11.79L5.29,10.38L9,14.09L18.71,7.21Z" />
                  <path d="M16.5,10.5L15.09,9.09L9,15.18L6.91,13.09L5.5,14.5L9,18L16.5,10.5Z" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
