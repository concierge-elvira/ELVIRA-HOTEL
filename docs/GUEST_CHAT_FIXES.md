# Guest Chat Translation and Topics Fixes

## Issues Fixed

### 1. Language Storage Issue

**Problem**: The `target_language` column was storing full strings like "English (language code: en)" instead of just the ISO code "en".

**Solution**:

- Created `languageMapping.ts` utility to normalize language names to ISO 639-1 codes
- Updated both guest and hotel hooks to send normalized ISO codes to the edge function
- Updated edge function to:
  - Accept ISO language codes
  - Map codes to full language names for better OpenAI translation prompts
  - Store only the ISO code in the database

**Impact**:

- `target_language` column now stores clean ISO codes: "de", "en", "bg", etc.
- OpenAI receives clearer translation instructions: "Translate into German" instead of "Translate into German (language code: de)"

### 2. Topic and Subtopic Separation

**Problem**: The edge function was storing topics as a JSONB array `["maintenance"]` but ignoring the subtopic field entirely.

**Solution**:

- Updated edge function to store `topic` and `subtopic` as separate text fields
- Changed from `topics: [topicsObj.topic]` to separate fields:
  - `topic`: "maintenance"
  - `subtopic`: "plumbing-issue"

**Database Schema**:

```sql
-- guest_messages table
topic text null,           -- e.g., "maintenance"
subtopic text null,        -- e.g., "plumbing-issue"
```

### 3. Translation Quality Improvement

**Problem**: OpenAI was sometimes translating to English instead of the target language.

**Solution**:

- Language code mapping ensures correct language names in prompts
- More explicit translation instructions using full language names
- Example: Instead of translating to "de", now translates to "German"

## Files Modified

### 1. `src/utils/languageMapping.ts` (NEW)

- Language code ↔ name mappings
- `normalizeLanguageToCode()`: Converts "German" → "de"
- `getLanguageName()`: Converts "de" → "German"

### 2. `src/hooks/guest-chat/useGuestChat.ts`

```typescript
// Before
targetLanguage: "German (language code: de)";

// After
const normalizedTargetLanguage = normalizeLanguageToCode(targetLanguage);
targetLanguage: "de"; // Clean ISO code
```

### 3. `src/hooks/chat-management/guest-communication/useGuestMessages.ts`

```typescript
// Same normalization applied to hotel staff messages
const normalizedHotelLanguage = normalizeLanguageToCode(hotelLanguage);
const normalizedGuestLanguage = normalizeLanguageToCode(guestLanguage);
```

### 4. `supabase/functions/openai-analyzer/index.ts`

```typescript
// Language mapping
const LANGUAGE_NAMES: Record<string, string> = {
  de: "German",
  en: "English",
  bg: "Bulgarian",
  // ... more languages
};

function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code.toLowerCase()] || code;
}

// Usage in translation
const targetLangName = getLanguageName(targetLanguage || "en");
const prompt = `Translate into ${targetLangName}...`;

// Storage
results = {
  sentiment,
  urgency,
  topic: topicsObj.topic, // NEW: Separate field
  subtopic: topicsObj.subtopic, // NEW: Separate field
  translated_text: translation,
  target_language: targetLanguage, // Stores "de" not "German (language code: de)"
};
```

## Testing

1. **Language Storage**:

   - Send message from guest (Bulgarian) → Check `target_language` = "de"
   - Send message from hotel (German) → Check `target_language` = "bg"

2. **Topic/Subtopic**:

   - Send "My TV is not working" → Check `topic` = "maintenance", `subtopic` = "TV-issue"
   - Send "I need extra towels" → Check `topic` = "housekeeping", `subtopic` = "extra-towels"

3. **Translation Quality**:
   - Guest (Bulgarian) sends message → Hotel receives in German (not English)
   - Hotel (German) sends message → Guest receives in Bulgarian (not English)

## Database Columns

### guest_messages table:

- `original_language`: ISO code (e.g., "bg", "de")
- `target_language`: ISO code (e.g., "de", "bg")
- `topic`: Text (e.g., "maintenance")
- `subtopic`: Text (e.g., "plumbing-issue")
- `translated_text`: Translated message text
- `is_translated`: Boolean
