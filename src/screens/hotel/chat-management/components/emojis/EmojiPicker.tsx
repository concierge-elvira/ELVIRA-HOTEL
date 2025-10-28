import { useState, useRef } from "react";
import { emojiCategories, quickEmojis } from "./emojiData";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("smileys");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  const scrollToCategory = (categoryId: string) => {
    const categoryElement = categoryRefs.current[categoryId];
    if (categoryElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const offsetTop = categoryElement.offsetTop - container.offsetTop - 10;
      container.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    setActiveCategory(categoryId);
  };

  // Handle scroll to update active category
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollTop + 50;

    // Find which category is currently in view
    for (const category of emojiCategories) {
      const element = categoryRefs.current[category.id];
      if (element) {
        const offsetTop = element.offsetTop - container.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveCategory(category.id);
          break;
        }
      }
    }
  };

  const filteredEmojis = searchQuery
    ? emojiCategories
        .flatMap((cat) => cat.emojis)
        .filter(
          (emoji) =>
            emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emoji.keywords.some((keyword) =>
              keyword.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    : null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-[360px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
      {/* Search Bar */}
      <div className="p-2.5 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border-0 rounded-md focus:outline-none focus:bg-gray-100 transition-colors"
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Recent Emojis */}
      {!searchQuery && (
        <div className="px-2.5 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between gap-1">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji.emoji}
                onClick={() => handleEmojiClick(emoji.emoji)}
                className="text-xl p-1.5 hover:bg-gray-200 rounded-md transition-all hover:scale-110"
                title={emoji.name}
              >
                {emoji.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Grid with Categories */}
      <div
        ref={scrollContainerRef}
        className="h-[280px] overflow-y-auto overflow-x-hidden px-2"
        onScroll={handleScroll}
        style={{ scrollbarWidth: "thin" }}
      >
        {searchQuery ? (
          // Search Results
          <div className="py-2">
            <div className="text-[11px] font-semibold text-gray-600 mb-2 px-1">
              Search Results
            </div>
            <div className="grid grid-cols-8 gap-0.5">
              {filteredEmojis && filteredEmojis.length > 0 ? (
                filteredEmojis.map((emoji, index) => (
                  <button
                    key={`${emoji.emoji}-${index}`}
                    onClick={() => handleEmojiClick(emoji.emoji)}
                    className="text-2xl p-1.5 hover:bg-gray-100 rounded-md transition-all hover:scale-110 active:scale-95"
                    title={emoji.name}
                  >
                    {emoji.emoji}
                  </button>
                ))
              ) : (
                <div className="col-span-8 text-center py-8 text-gray-400 text-sm">
                  No emojis found
                </div>
              )}
            </div>
          </div>
        ) : (
          // All Categories
          emojiCategories.map((category) => (
            <div
              key={category.id}
              ref={(el) => {
                categoryRefs.current[category.id] = el;
              }}
              className="py-2"
            >
              <div className="text-[11px] font-semibold text-gray-600 mb-1.5 px-1 sticky top-0 bg-white pt-1 pb-0.5 z-10">
                {category.name}
              </div>
              <div className="grid grid-cols-8 gap-0.5">
                {category.emojis.map((emoji, index) => (
                  <button
                    key={`${emoji.emoji}-${index}`}
                    onClick={() => handleEmojiClick(emoji.emoji)}
                    className="text-2xl p-1.5 hover:bg-gray-100 rounded-md transition-all hover:scale-110 active:scale-95"
                    title={emoji.name}
                  >
                    {emoji.emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Footer Icons */}
      {!searchQuery && (
        <div className="flex items-center justify-around border-t border-gray-200 bg-white px-2 py-2">
          {emojiCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`text-lg p-1.5 rounded-md transition-all ${
                activeCategory === category.id
                  ? "text-emerald-600 bg-emerald-50 scale-105"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title={category.name}
            >
              {category.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
