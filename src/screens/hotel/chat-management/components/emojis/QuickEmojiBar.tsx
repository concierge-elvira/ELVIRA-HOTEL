import { quickEmojis } from "./emojiData";

interface QuickEmojiBarProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
}

export function QuickEmojiBar({
  onEmojiSelect,
  className = "",
}: QuickEmojiBarProps) {
  return (
    <div
      className={`flex items-center gap-1 p-2 bg-white rounded-lg border border-gray-200 ${className}`}
    >
      <span className="text-xs text-gray-500 mr-1">Quick:</span>
      {quickEmojis.map((emoji) => (
        <button
          key={emoji.emoji}
          onClick={() => onEmojiSelect(emoji.emoji)}
          className="text-xl p-1.5 hover:bg-gray-100 rounded transition-colors"
          title={emoji.name}
        >
          {emoji.emoji}
        </button>
      ))}
    </div>
  );
}
