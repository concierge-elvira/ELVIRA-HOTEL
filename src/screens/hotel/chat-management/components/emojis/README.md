# Emoji System

This folder contains a WhatsApp-style emoji picker for the chat management system.

## Structure

```
emojis/
├── emojiData.ts       # Emoji categories and data
├── EmojiPicker.tsx    # WhatsApp-style emoji picker
├── QuickEmojiBar.tsx  # Quick access emoji bar
└── index.ts           # Exports
```

## Features

### EmojiPicker Component (WhatsApp Style)

- **Clean Design**: Inspired by WhatsApp's emoji picker interface
- **3 Tabs**: Emojis (active), GIF (disabled), Stickers (disabled)
- **8 Categories**: Smileys, Gestures, Hearts, Celebrations, Symbols, Food, Travel, Activities
- **200+ Emojis**: Comprehensive emoji collection organized by category
- **Search Functionality**: Real-time search by name or keywords
- **Recent Emojis**: Quick access bar showing 8 most frequently used emojis
- **Category Navigation**: Bottom icon bar for quick category switching
- **Smooth Scrolling**: Automatic category switching as you scroll
- **Auto-close**: Closes when clicking outside the picker

### QuickEmojiBar Component

- Horizontal bar with 8 most commonly used emojis
- Can be used as a standalone component
- Perfect for message reactions or quick emoji selection

## Usage

### EmojiPicker

```tsx
import { EmojiPicker } from "./emojis";

function MyComponent() {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    console.log("Selected:", emoji);
  };

  return (
    <div className="relative">
      {showPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
      <button onClick={() => setShowPicker(!showPicker)}>😊</button>
    </div>
  );
}
```

### QuickEmojiBar

```tsx
import { QuickEmojiBar } from "./emojis";

function MyComponent() {
  const handleEmojiSelect = (emoji: string) => {
    console.log("Selected:", emoji);
  };

  return <QuickEmojiBar onEmojiSelect={handleEmojiSelect} />;
}
```

## Emoji Categories

1. **Smileys & People** (😊): Facial expressions and emotions
2. **Gestures** (👍): Hand gestures and body language
3. **Hearts & Love** (❤️): Various heart emojis and love symbols
4. **Celebrations** (🎉): Party, gifts, and celebration emojis
5. **Symbols & Objects** (💯): Common symbols and objects
6. **Food & Drink** (🍕): Food and beverage emojis
7. **Travel & Places** (✈️): Travel, locations, and nature
8. **Activities & Sports** (⚽): Sports, hobbies, and activities

## Quick Access Emojis

The following 8 emojis are available in quick access:

- 😊 Smiling Face
- 😂 Laughing
- ❤️ Red Heart
- 👍 Thumbs Up
- 💡 Light Bulb
- 🔥 Fire
- 💯 Hundred Points
- 🎉 Party Popper

## Customization

To add or modify emojis, edit `emojiData.ts`:

```typescript
export const emojiCategories: EmojiCategory[] = [
  {
    id: "custom",
    name: "Custom Category",
    icon: "🎨",
    emojis: [
      { emoji: "🎨", name: "Art", keywords: ["art", "paint", "creative"] },
      // Add more emojis...
    ],
  },
];
```

## Integration

The emoji picker is integrated into the `MessageInput` component and appears when clicking the emoji button. It's positioned absolutely above the input field.

## Accessibility

- All emojis have descriptive titles
- Keyboard navigation supported
- Search functionality for easy discovery
- Clear visual feedback on hover
