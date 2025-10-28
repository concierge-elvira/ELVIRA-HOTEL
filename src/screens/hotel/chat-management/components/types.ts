export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file" | "system";
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
}

export interface ChatConversation {
  id: string;
  participantId?: string; // Optional for group chats
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string; // Optional for staff without conversations
  lastMessageTime?: Date; // Optional for staff without conversations
  unreadCount: number;
  status: "active" | "away" | "offline";
  roomNumber?: string; // For guest conversations
  department?: string; // For staff conversations
  isGroup?: boolean; // For group chats
  participantCount?: number; // Number of participants in group
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "offline";
  role?: string;
  department?: string;
  roomNumber?: string;
}

export interface EmojiReaction {
  emoji: string;
  label: string;
}
