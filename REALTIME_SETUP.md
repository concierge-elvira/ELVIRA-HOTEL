# Real-time + React Query v5 + Supabase Setup

This document explains the comprehensive real-time optimization setup implemented in your hotel management application.

## 🚀 Features Implemented

### 1. TanStack React Query v5 Configuration

- **Optimized Query Client** with 5-minute stale time and intelligent caching
- **Query Key Factory** for consistent cache management
- **Retry Logic** with exponential backoff
- **Background Refetching** for fresh data
- **Dev Tools** integration for debugging

### 2. Supabase Real-time Subscriptions

- **Real-time Chat Messages** with automatic cache invalidation
- **Guest Management** updates
- **Staff Schedule** changes
- **Announcements** broadcasting
- **Order Status** updates (restaurant/shop)
- **Presence Tracking** for online users

### 3. Optimistic Updates

- **Instant UI Updates** before server confirmation
- **Automatic Rollback** on errors
- **Loading States** for better UX
- **Error Handling** with retry mechanisms

## 📁 File Structure

```
src/
├── lib/
│   └── react-query.ts          # Query client configuration & query keys
├── hooks/
│   ├── useRealtime.ts          # Real-time subscription hooks
│   └── useApi.ts               # API hooks with React Query integration
├── services/
│   └── supabase.ts             # Enhanced Supabase client with types
├── types/
│   └── database.ts             # Auto-generated database types
├── components/
│   └── RealTimeChat.tsx        # Example real-time component
└── main.tsx                    # Query client provider setup
```

## 🔧 Key Components

### Query Client Configuration (`lib/react-query.ts`)

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 3, // Exponential backoff
      refetchOnWindowFocus: true, // Fresh data on focus
      refetchInterval: 1000 * 60 * 5, // Background refresh
    },
  },
});
```

### Real-time Hooks (`hooks/useRealtime.ts`)

- `useChatRealtime(conversationId)` - Real-time chat messages
- `useGuestsRealtime(hotelId)` - Guest updates
- `useSchedulesRealtime(hotelId)` - Staff schedule changes
- `useAnnouncementsRealtime(hotelId)` - Announcement updates
- `useOrdersRealtime(hotelId)` - Order status changes
- `usePresenceRealtime(roomId, userId)` - User presence tracking
- `useHotelRealtime(hotelId, userId)` - Combined hotel subscriptions

### API Hooks (`hooks/useApi.ts`)

- `useGuests(hotelId)` - Fetch guests with caching
- `useMessages(conversationId)` - Fetch messages with real-time updates
- `useSendMessage()` - Send messages with optimistic updates
- `useAnnouncements(hotelId)` - Fetch announcements
- `useOrders(hotelId)` - Fetch orders with relationships

## 🎯 Usage Examples

### 1. Real-time Chat Component

```typescript
function ChatComponent({ conversationId }) {
  // Enable real-time subscriptions
  useChatRealtime(conversationId);

  // Fetch messages with React Query
  const { data: messages, isLoading } = useMessages(conversationId);

  // Send message with optimistic updates
  const sendMessage = useSendMessage();

  const handleSend = async (text) => {
    await sendMessage.mutateAsync({
      conversationId,
      message: { message_text: text, sender_type: "staff" },
    });
  };

  return (
    <div>
      {messages?.map((message) => (
        <div key={message.id}>{message.message_text}</div>
      ))}
    </div>
  );
}
```

### 2. Hotel Dashboard with Real-time

```typescript
function HotelDashboard({ hotelId, userId }) {
  // Enable all real-time subscriptions for the hotel
  useHotelRealtime(hotelId, userId);

  // Fetch data with React Query
  const { data: guests } = useGuests(hotelId);
  const { data: announcements } = useAnnouncements(hotelId);
  const { data: orders } = useOrders(hotelId);

  return (
    <div>
      <div>Guests: {guests?.length}</div>
      <div>Announcements: {announcements?.length}</div>
      <div>
        Orders: {orders?.dineInOrders.length + orders?.shopOrders.length}
      </div>
    </div>
  );
}
```

### 3. Optimistic Updates Example

```typescript
function CreateAnnouncement() {
  const createAnnouncement = useCreateAnnouncement();

  const handleSubmit = async (data) => {
    try {
      // This will optimistically update the UI immediately
      await createAnnouncement.mutateAsync(data);
      // Success! UI already shows the new announcement
    } catch (error) {
      // Error! UI automatically rolls back
      console.error("Failed to create announcement");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createAnnouncement.isPending}>
        {createAnnouncement.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
```

## 🔄 How It Works

### Real-time Flow

1. **Subscribe** to database changes via Supabase channels
2. **Receive** real-time events when data changes
3. **Invalidate** React Query cache for affected data
4. **Refetch** fresh data automatically
5. **Update** UI with new data

### Optimistic Updates Flow

1. **User action** triggers mutation
2. **Immediately update** UI with optimistic data
3. **Send request** to server
4. **On success**: Keep optimistic update
5. **On error**: Rollback to previous state

### Caching Strategy

- **Stale Time**: 5 minutes (data considered fresh)
- **Garbage Collection**: 10 minutes (cleanup unused data)
- **Background Refetch**: Every 5 minutes for stale data
- **Window Focus**: Refetch when user returns to tab
- **Network Reconnect**: Refetch when connection restored

## 🛠️ Environment Setup

Make sure you have these environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Performance Benefits

1. **Reduced Server Load**: Intelligent caching reduces API calls
2. **Better User Experience**: Optimistic updates feel instant
3. **Real-time Updates**: Users see changes immediately
4. **Offline Resilience**: Cached data available offline
5. **Error Recovery**: Automatic retry and rollback mechanisms
6. **Memory Management**: Automatic cleanup of unused data

## 🔍 Debugging

- **React Query DevTools**: Available in development mode
- **Console Logging**: Real-time subscription events logged
- **Query Inspection**: View cache state and query status
- **Network Panel**: Monitor Supabase requests and WebSocket connections

## 🎯 Next Steps

1. **Add More Real-time Features**: Implement for other data types
2. **Optimize Subscriptions**: Use specific filters for better performance
3. **Add Offline Support**: Implement offline mutations queue
4. **Performance Monitoring**: Add metrics for real-time performance
5. **Error Boundaries**: Implement React error boundaries for better error handling

This setup provides a robust, scalable foundation for real-time hotel management features with excellent user experience and performance optimization.
