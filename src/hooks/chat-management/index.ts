export {
  useConversations,
  useCurrentHotelConversations,
  useConversation,
  useCreateConversation,
  useUpdateConversation,
  useAssignStaffToConversation,
  useUpdateConversationStatus,
  type ConversationWithGuest,
} from "./useConversations";

export {
  useMessages,
  useSendMessage,
  useUpdateMessage,
  useMarkMessagesAsRead,
  useDeleteMessage,
  useUnreadMessagesCount,
} from "./useMessages";

// Staff Communication
export * from "./staff-communication";

// Group Chats
export * from "./group-chats";

// Guest Communication
export * from "./guest-communication";
