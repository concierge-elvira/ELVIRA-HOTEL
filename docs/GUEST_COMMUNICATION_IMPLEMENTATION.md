# Guest Communication Implementation

## Overview

This document describes the implementation of the Guest Communication feature in the Chat Management system. The implementation reuses shared components and follows the same pattern as Staff Communication, with specific adaptations for guest interactions.

## Database Tables

The feature uses two main tables:

### `guest_conversation`

Stores conversation metadata between guests and hotel staff.

**Key Fields:**

- `id` - Unique conversation identifier
- `guest_id` - Reference to guest
- `hotel_id` - Reference to hotel
- `assigned_staff_id` - Staff member handling the conversation (nullable)
- `status` - Conversation status
- `subject` - Optional conversation subject
- `last_message_at` - Timestamp of last message
- `created_at`, `updated_at` - Timestamps

### `guest_messages`

Stores individual messages within conversations.

**Key Fields:**

- `id` - Unique message identifier
- `conversation_id` - Reference to conversation
- `guest_id` - Guest who sent/received message
- `hotel_id` - Reference to hotel
- `sender_type` - Either "guest" or "hotel_staff"
- `message_text` - Original message content
- `translated_text` - AI-translated text (nullable)
- `is_translated` - Translation flag
- `is_read` - Read status flag
- `original_language` - Detected language (nullable)
- `target_language` - Translation target (nullable)
- `urgency`, `sentiment`, `priority` - AI analysis fields (nullable)
- `topics`, `subtopics` - AI categorization (nullable)
- `ai_analysis_completed` - Analysis status flag (nullable)
- `staff_translation` - Staff-specific translation (nullable)
- `created_by` - Staff member who sent (for staff messages)
- `created_at`, `updated_at` - Timestamps

## File Structure

```
src/
├── hooks/
│   └── chat-management/
│       └── guest-communication/
│           ├── index.ts
│           ├── useGuestConversationsList.ts
│           └── useGuestMessages.ts
├── screens/
│   └── hotel/
│       └── chat-management/
│           ├── ChatManagement.tsx
│           └── components/
│               └── guest/
│                   └── GuestCommunication.tsx
└── lib/
    └── react-query.ts (updated with query keys)
```

## Implementation Details

### 1. Custom Hooks

#### `useGuestConversationsList`

**Location:** `src/hooks/chat-management/guest-communication/useGuestConversationsList.ts`

**Purpose:** Fetches and formats all guest conversations for the current hotel.

**Features:**

- Fetches conversations with guest details (name, room number)
- Retrieves last message for each conversation
- Calculates unread message counts (only unread guest messages)
- Real-time updates via Supabase subscriptions
- Optimized with React Query caching

**Returns:**

```typescript
{
  id: string;
  guestId: string;
  guestName: string;
  roomNumber: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: string;
}
[];
```

#### `useGuestMessages`

**Location:** `src/hooks/chat-management/guest-communication/useGuestMessages.ts`

**Purpose:** Fetches messages for a specific conversation.

**Features:**

- Retrieves all messages in chronological order
- Includes translation and AI analysis data
- Real-time updates for new messages
- React Query caching with 10-second stale time

**Returns:** Array of guest messages with all fields

#### `useSendGuestMessage`

**Location:** `src/hooks/chat-management/guest-communication/useGuestMessages.ts`

**Purpose:** Sends a message from staff to a guest.

**Features:**

- Validates user authentication and hotel association
- Automatically sets sender_type to "hotel_staff"
- Updates conversation's last_message_at timestamp
- Invalidates relevant caches after sending
- Includes created_by field for staff tracking

**Usage:**

```typescript
const sendMessage = useSendGuestMessage();
await sendMessage.mutateAsync({
  conversationId: "uuid",
  message: "Hello, how can I help?",
});
```

#### `useMarkGuestMessagesAsRead`

**Location:** `src/hooks/chat-management/guest-communication/useGuestMessages.ts`

**Purpose:** Marks guest messages as read by staff.

**Features:**

- Bulk updates multiple messages at once
- Updates unread counts in conversation list
- Invalidates caches to reflect read status

### 2. Component Implementation

#### `GuestCommunication`

**Location:** `src/screens/hotel/chat-management/components/guest/GuestCommunication.tsx`

**Purpose:** Main component for guest communication interface.

**Features:**

- Reuses `ConversationList` and `ChatWindow` shared components
- Displays guest conversations with room numbers
- Shows translated messages when available
- Auto-marks messages as read when conversation is opened
- Real-time message updates
- Loading states for conversations and messages

**Component Structure:**

```tsx
<div className="h-full flex">
  {/* Conversations Sidebar */}
  <ConversationList
    conversations={conversations}
    activeConversationId={conversationId}
    onConversationSelect={setConversationId}
    searchValue={searchValue}
    onSearchChange={setSearchValue}
    searchPlaceholder="Search guests..."
    isLoading={conversationsLoading}
    showFilterButton={true}
    onFilterClick={handleFilterClick}
  />

  {/* Chat Window */}
  <ChatWindow
    participant={activeParticipant}
    messages={chatMessages}
    onSendMessage={handleSendMessage}
    inputPlaceholder="Message guest..."
    isLoading={messagesLoading || sendMessage.isPending}
  />
</div>
```

### 3. Query Keys

Added to `src/lib/react-query.ts`:

```typescript
guestConversations: (hotelId: string) =>
  ["guest-conversations", "hotel", hotelId] as const,
guestMessages: (conversationId: string) =>
  ["guest-messages", conversationId] as const,
```

### 4. Data Transformations

#### Conversation Transformation

Raw database format → Display format:

```typescript
// Database
{
  id: string,
  guest_id: string,
  guests: { guest_name: string, room_number: string },
  lastMessage: string,
  lastMessageTime: Date,
  unreadCount: number,
  status: string
}

// Transformed to ChatConversation
{
  id: string,
  participantId: string,      // guest_id
  participantName: string,     // guest_name
  roomNumber?: string,         // room_number
  lastMessage: string,
  lastMessageTime: Date,
  unreadCount: number,
  status: "active" | "away" | "offline"
}
```

#### Message Transformation

```typescript
// Database
{
  id: string,
  sender_type: "guest" | "hotel_staff",
  message_text: string,
  translated_text?: string,
  is_translated: boolean,
  created_at: string,
  guest_id?: string,
  created_by?: string
}

// Transformed to ChatMessage
{
  id: string,
  senderId: string,           // guest_id or created_by
  senderName: string,         // "Hotel Staff" or guest name
  content: string,            // translated_text or message_text
  timestamp: Date,
  type: "text",
  isOwn: boolean,            // true if hotel_staff
  status: "delivered"
}
```

## Key Features

### 1. Real-Time Updates

- Uses Supabase real-time subscriptions
- Updates on both `guest_conversation` and `guest_messages` tables
- Automatic cache invalidation triggers re-renders

### 2. Translation Support

- Displays translated messages when available
- Falls back to original text if no translation
- Preserves both original and translated text in database

### 3. Auto-Mark as Read

- Automatically marks guest messages as read when conversation is opened
- Only marks messages from guests (sender_type = "guest")
- Uses `useEffect` with conversation and messages dependencies

### 4. Unread Counts

- Counts only unread guest messages (not staff messages)
- Updates in real-time as new messages arrive
- Displayed in conversation list

### 5. Code Reusability

- Shares `ConversationList` component with Staff Communication
- Shares `ChatWindow` component with Staff Communication
- Similar hook patterns for consistency
- Same query key factory pattern

## Differences from Staff Communication

| Feature                 | Staff Communication                     | Guest Communication                    |
| ----------------------- | --------------------------------------- | -------------------------------------- |
| **Tables**              | `staff_conversations`, `staff_messages` | `guest_conversation`, `guest_messages` |
| **Participants**        | Multiple staff (via participants table) | Single guest + hotel staff             |
| **Groups**              | Supports group chats                    | No groups (1-on-1 only)                |
| **Translation**         | Not supported                           | Full AI translation support            |
| **AI Analysis**         | Not supported                           | Urgency, sentiment, topics             |
| **Sender Type**         | Implicit from sender_id                 | Explicit `sender_type` field           |
| **Room Info**           | Department shown                        | Room number shown                      |
| **Create Conversation** | RPC function for lookup                 | Direct query                           |

## Integration Points

### 1. With `useCurrentUserHotel`

Used to get the current hotel ID for filtering conversations:

```typescript
const { data: currentUserHotel } = useCurrentUserHotel();
const hotelId = currentUserHotel?.hotelId;
```

### 2. With React Query

All hooks use `useOptimizedQuery` for consistent caching:

- 30-second stale time for conversations
- 10-second stale time for messages
- 5-minute garbage collection time
- Refetch on window focus enabled

### 3. With Realtime Subscriptions

Uses `useRealtimeSubscription` hook for live updates:

```typescript
useRealtimeSubscription({
  table: "guest_messages",
  filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
  queryKey: queryKeys.guestConversations(hotelId || ""),
  enabled: !!hotelId,
});
```

## Future Enhancements

### Potential Improvements

1. **Filtering** - Implement conversation filtering (by status, urgency, etc.)
2. **Search** - Add message content search within conversations
3. **AI Features** - Display AI analysis (urgency, sentiment) in UI
4. **Notifications** - Desktop/push notifications for new guest messages
5. **Staff Assignment** - UI for assigning staff to conversations
6. **Status Updates** - Update conversation status (active, resolved, closed)
7. **Message History** - Export conversation history
8. **Rich Media** - Support for images, files, voice messages
9. **Quick Replies** - Pre-defined response templates
10. **Language Selector** - Choose target translation language

## Testing Checklist

- [ ] Conversations load correctly for hotel
- [ ] Messages display in correct order
- [ ] Real-time updates work for new messages
- [ ] Unread counts update correctly
- [ ] Auto-mark as read works when opening conversation
- [ ] Sending messages updates conversation list
- [ ] Search functionality filters conversations
- [ ] Loading states display properly
- [ ] Translations show when available
- [ ] Error handling works for network failures
- [ ] Room numbers display correctly
- [ ] Timestamp formatting is correct

## Troubleshooting

### Common Issues

**Conversations not loading:**

- Check hotel ID is valid
- Verify `useCurrentUserHotel` returns data
- Check Supabase RLS policies on `guest_conversation` table

**Messages not appearing:**

- Verify conversation_id is correct
- Check `guest_messages` table has data
- Ensure real-time subscription is enabled

**Send message fails:**

- Verify user is authenticated
- Check hotel_id is available
- Ensure guest_id exists in conversation

**Translations not showing:**

- Check `is_translated` flag is true
- Verify `translated_text` is not null
- Confirm AI analysis is completed

## Performance Considerations

1. **Pagination** - Consider implementing for large conversation lists
2. **Message Limits** - Consider limiting displayed messages (e.g., last 100)
3. **Lazy Loading** - Load messages on demand as user scrolls
4. **Debouncing** - Debounce search input to reduce queries
5. **Cache Management** - Regularly clean up old cached data

## Security Notes

- All queries filtered by hotel_id to prevent cross-hotel data access
- Messages include created_by for staff accountability
- RLS policies should enforce hotel-level isolation
- Sensitive guest data (room numbers) only shown to authorized staff

## Conclusion

The Guest Communication implementation successfully reuses shared components and patterns from Staff Communication while adding guest-specific features like translation, AI analysis, and room number display. The modular architecture makes it easy to maintain and extend both systems independently.
