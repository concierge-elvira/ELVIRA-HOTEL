# Guest-Hotel Chat Translation System

## Overview

Bidirectional translation system between guests and hotel staff using their respective preferred languages.

## Language Configuration

### Guest Language

- Stored in: `guests.guest_personal_data.language`
- Set during guest profile creation
- Examples: "en", "es", "de", "fr", "bg", etc.

### Hotel Language

- Stored in: `hotels.official_languages`
- Set in hotel configuration
- Examples: "en", "es", "de", etc.

## Translation Flow

### Guest → Hotel Staff

1. **Guest sends message** in their language (e.g., Spanish)
2. **Message saved** to `guest_messages` table:
   - `sender_type`: "guest"
   - `message_text`: Original Spanish text
   - `original_language`: "es"
3. **OpenAI Analyzer** called with task: "full_pipeline":
   - Translates to hotel's official language (e.g., English)
   - Analyzes sentiment, urgency, topics
   - Updates message with `translated_text` and `is_translated: true`
4. **Hotel staff sees**: English translation (in their dashboard)
5. **Guest sees** (in their own chat): Original Spanish text

### Hotel Staff → Guest

1. **Hotel staff sends message** in their language (e.g., English)
2. **Message saved** to `guest_messages` table:
   - `sender_type`: "hotel_staff"
   - `message_text`: Original English text
   - `original_language`: "en"
3. **OpenAI Analyzer** called with task: "translate":
   - Translates to guest's language (e.g., Spanish)
   - Updates message with `translated_text` and `is_translated: true`
4. **Guest sees**: Spanish translation (in their chat)
5. **Hotel staff sees** (in their dashboard): Original English text

## Display Logic

### Guest Chat Screen (`GuestChatScreen.tsx`)

```typescript
// Guest's own messages: show original (no translation)
if (isGuestMessage) {
  displayText = msg.message_text;
}
// Hotel staff messages: show translation if available
else {
  displayText =
    msg.is_translated && msg.translated_text
      ? msg.translated_text
      : msg.message_text;
}
```

### Hotel Dashboard (`GuestCommunication.tsx`)

```typescript
// Hotel staff's own messages: show original (no translation)
if (isStaffMessage) {
  displayText = msg.message_text;
}
// Guest messages: show translation if available
else {
  displayText =
    msg.is_translated && msg.translated_text
      ? msg.translated_text
      : msg.message_text;
}
```

## Database Schema

### guest_messages table

- `message_text` (text): Original message
- `translated_text` (text, nullable): Translated version
- `is_translated` (boolean): Whether translation was performed
- `original_language` (text, nullable): Source language code
- `target_language` (text, nullable): Target language code
- `sender_type` (text): "guest" or "hotel_staff"
- `sentiment` (text, nullable): AI-analyzed sentiment
- `urgency` (text, nullable): AI-analyzed urgency
- `topics` (text[], nullable): AI-detected topics

## Edge Function Integration

### OpenAI Analyzer (`openai-analyzer`)

**Full Pipeline (for guest messages):**

```json
{
  "task": "full_pipeline",
  "text": "Guest message",
  "message_id": "uuid",
  "original_language": "es",
  "targetLanguage": "en",
  "hotel_id": "uuid"
}
```

Returns: sentiment, urgency, topics, translation

**Translation Only (for hotel staff messages):**

```json
{
  "task": "translate",
  "text": "Staff message",
  "message_id": "uuid",
  "original_language": "en",
  "targetLanguage": "es"
}
```

Returns: translation only

## Implementation Files

### Guest Side

- **Hook**: `src/hooks/guest-chat/useGuestChat.ts`
  - `useGuestConversation()`: Get/create conversation
  - `useGuestChatMessages()`: Fetch messages with realtime
  - `useSendGuestChatMessage()`: Send with full AI analysis
- **Screen**: `src/screens/guest/chat/GuestChatScreen.tsx`
  - Display logic for guest view
  - Language detection from session

### Hotel Side

- **Hook**: `src/hooks/chat-management/guest-communication/useGuestMessages.ts`
  - `useGuestMessages()`: Fetch messages
  - `useSendGuestMessage()`: Send with translation only
- **Component**: `src/screens/hotel/chat-management/components/guest/GuestCommunication.tsx`
  - Display logic for hotel staff view
  - Integration with chat UI components

## Example Conversation

```
Guest (Spanish):     "Hola, necesito toallas adicionales"
   ↓ (AI translates + analyzes)
Staff sees:          "Hello, I need additional towels"
                     [Sentiment: neutral, Urgency: MEDIUM, Topic: housekeeping]

Staff (English):     "Of course! We'll send them right away."
   ↓ (AI translates)
Guest sees:          "¡Por supuesto! Los enviaremos de inmediato."
```

## Benefits

1. **Real-time Communication**: Guests and staff communicate naturally
2. **No Language Barrier**: Automatic translation both ways
3. **AI Insights**: Staff see sentiment and urgency for guest messages
4. **Topic Detection**: Automatic categorization for routing/analytics
5. **Preserved Originals**: Both parties see their own messages unchanged
