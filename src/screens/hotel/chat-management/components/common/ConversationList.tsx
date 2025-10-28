import { SearchBox } from "../../../../../components/ui";
import { Users } from "lucide-react";
import type { ChatConversation } from "../types";

interface ConversationListProps {
  conversations: ChatConversation[];
  activeConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
  showAddButton?: boolean;
  showFilterButton?: boolean;
  onAddClick?: () => void;
  onFilterClick?: () => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onConversationSelect,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search conversations...",
  isLoading = false,
  showAddButton = false,
  showFilterButton = false,
  onAddClick,
  onFilterClick,
}: ConversationListProps) {
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participantName
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      (conversation.lastMessage &&
        conversation.lastMessage
          .toLowerCase()
          .includes(searchValue.toLowerCase())) ||
      (conversation.roomNumber &&
        conversation.roomNumber
          .toLowerCase()
          .includes(searchValue.toLowerCase())) ||
      (conversation.department &&
        conversation.department
          .toLowerCase()
          .includes(searchValue.toLowerCase()))
  );

  const formatTime = (date?: Date) => {
    if (!date) return "";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-400";
      case "away":
        return "bg-yellow-400";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search with action buttons */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBox
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>

          {/* Action Buttons */}
          {(showAddButton || showFilterButton) && (
            <div className="flex items-center gap-2">
              {showAddButton && (
                <button
                  onClick={onAddClick}
                  className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Add new"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              )}

              {showFilterButton && (
                <button
                  onClick={onFilterClick}
                  className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Filter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
                    <line
                      x1="4"
                      y1="12"
                      x2="20"
                      y2="12"
                      strokeLinecap="round"
                    />
                    <line
                      x1="4"
                      y1="18"
                      x2="20"
                      y2="18"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: "auto" }}
      >
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5 animate-spin"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
              </svg>
              <span>Loading...</span>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchValue ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`
                  p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${
                    activeConversationId === conversation.id
                      ? "bg-emerald-50 border-r-2 border-emerald-500"
                      : ""
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onConversationSelect(conversation.id);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar with Status (or Group Icon) */}
                  <div className="relative shrink-0">
                    {conversation.isGroup ? (
                      /* Group Chat Icon */
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-600" />
                      </div>
                    ) : conversation.participantAvatar ? (
                      <img
                        src={conversation.participantAvatar}
                        alt={conversation.participantName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                        {conversation.participantName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!conversation.isGroup && (
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                          conversation.status
                        )}`}
                      ></div>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.participantName}
                        </h3>
                        {conversation.roomNumber && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Room {conversation.roomNumber}
                          </span>
                        )}
                        {conversation.department && !conversation.isGroup && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            {conversation.department}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate pr-2">
                        {conversation.lastMessage || (
                          <span className="text-gray-400 italic">
                            No messages yet
                          </span>
                        )}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {conversation.unreadCount > 99
                            ? "99+"
                            : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
