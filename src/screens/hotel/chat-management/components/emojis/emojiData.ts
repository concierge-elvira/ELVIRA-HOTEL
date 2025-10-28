export interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
  emojis: Emoji[];
}

export interface Emoji {
  emoji: string;
  name: string;
  keywords: string[];
}

export const emojiCategories: EmojiCategory[] = [
  {
    id: "smileys",
    name: "Smileys & People",
    icon: "😊",
    emojis: [
      {
        emoji: "😊",
        name: "Smiling Face",
        keywords: ["smile", "happy", "joy"],
      },
      { emoji: "😂", name: "Laughing", keywords: ["laugh", "funny", "lol"] },
      { emoji: "😍", name: "Heart Eyes", keywords: ["love", "heart", "like"] },
      {
        emoji: "🥰",
        name: "Smiling Face with Hearts",
        keywords: ["love", "adore", "hearts"],
      },
      {
        emoji: "😎",
        name: "Cool",
        keywords: ["cool", "sunglasses", "awesome"],
      },
      { emoji: "🤗", name: "Hugging", keywords: ["hug", "embrace", "care"] },
      { emoji: "🤔", name: "Thinking", keywords: ["think", "hmm", "wonder"] },
      { emoji: "😴", name: "Sleeping", keywords: ["sleep", "tired", "zzz"] },
      { emoji: "😇", name: "Angel", keywords: ["angel", "innocent", "halo"] },
      { emoji: "🤩", name: "Star-Struck", keywords: ["star", "amazed", "wow"] },
      { emoji: "😢", name: "Crying", keywords: ["cry", "sad", "tears"] },
      { emoji: "😭", name: "Sobbing", keywords: ["sob", "cry", "upset"] },
      { emoji: "😡", name: "Angry", keywords: ["angry", "mad", "rage"] },
      {
        emoji: "🤯",
        name: "Mind Blown",
        keywords: ["shocked", "blown", "mind"],
      },
      { emoji: "😱", name: "Screaming", keywords: ["scream", "shock", "fear"] },
      { emoji: "🥱", name: "Yawning", keywords: ["yawn", "tired", "bored"] },
    ],
  },
  {
    id: "gestures",
    name: "Gestures",
    icon: "👍",
    emojis: [
      {
        emoji: "👍",
        name: "Thumbs Up",
        keywords: ["thumbs", "up", "yes", "ok", "good"],
      },
      {
        emoji: "👎",
        name: "Thumbs Down",
        keywords: ["thumbs", "down", "no", "bad"],
      },
      {
        emoji: "👏",
        name: "Clapping",
        keywords: ["clap", "applause", "bravo"],
      },
      {
        emoji: "🙌",
        name: "Raising Hands",
        keywords: ["hands", "celebrate", "yay"],
      },
      {
        emoji: "🤝",
        name: "Handshake",
        keywords: ["handshake", "deal", "agree"],
      },
      { emoji: "🙏", name: "Praying", keywords: ["pray", "thanks", "please"] },
      { emoji: "✌️", name: "Peace", keywords: ["peace", "victory", "v"] },
      {
        emoji: "🤞",
        name: "Crossed Fingers",
        keywords: ["fingers", "luck", "hope"],
      },
      { emoji: "👌", name: "OK Hand", keywords: ["ok", "okay", "perfect"] },
      { emoji: "✊", name: "Fist", keywords: ["fist", "power", "punch"] },
      { emoji: "👊", name: "Fist Bump", keywords: ["bump", "fist", "bro"] },
      {
        emoji: "🤙",
        name: "Call Me",
        keywords: ["call", "shaka", "hang loose"],
      },
    ],
  },
  {
    id: "hearts",
    name: "Hearts & Love",
    icon: "❤️",
    emojis: [
      { emoji: "❤️", name: "Red Heart", keywords: ["heart", "love", "red"] },
      { emoji: "💕", name: "Two Hearts", keywords: ["hearts", "love", "pink"] },
      {
        emoji: "💖",
        name: "Sparkling Heart",
        keywords: ["sparkle", "heart", "love"],
      },
      {
        emoji: "💗",
        name: "Growing Heart",
        keywords: ["growing", "heart", "love"],
      },
      {
        emoji: "💓",
        name: "Beating Heart",
        keywords: ["beating", "heart", "pulse"],
      },
      {
        emoji: "💝",
        name: "Heart with Ribbon",
        keywords: ["gift", "heart", "ribbon"],
      },
      {
        emoji: "💘",
        name: "Heart with Arrow",
        keywords: ["arrow", "heart", "cupid"],
      },
      {
        emoji: "💞",
        name: "Revolving Hearts",
        keywords: ["revolving", "hearts", "love"],
      },
      { emoji: "💙", name: "Blue Heart", keywords: ["blue", "heart", "love"] },
      {
        emoji: "💚",
        name: "Green Heart",
        keywords: ["green", "heart", "love"],
      },
      {
        emoji: "💛",
        name: "Yellow Heart",
        keywords: ["yellow", "heart", "love"],
      },
      {
        emoji: "🧡",
        name: "Orange Heart",
        keywords: ["orange", "heart", "love"],
      },
      {
        emoji: "💜",
        name: "Purple Heart",
        keywords: ["purple", "heart", "love"],
      },
      {
        emoji: "🖤",
        name: "Black Heart",
        keywords: ["black", "heart", "dark"],
      },
      {
        emoji: "🤍",
        name: "White Heart",
        keywords: ["white", "heart", "pure"],
      },
      { emoji: "🤎", name: "Brown Heart", keywords: ["brown", "heart"] },
    ],
  },
  {
    id: "celebrations",
    name: "Celebrations",
    icon: "🎉",
    emojis: [
      {
        emoji: "🎉",
        name: "Party Popper",
        keywords: ["party", "celebration", "confetti"],
      },
      {
        emoji: "🎊",
        name: "Confetti Ball",
        keywords: ["confetti", "party", "celebration"],
      },
      {
        emoji: "🎈",
        name: "Balloon",
        keywords: ["balloon", "party", "celebrate"],
      },
      { emoji: "🎁", name: "Gift", keywords: ["gift", "present", "birthday"] },
      {
        emoji: "🎂",
        name: "Birthday Cake",
        keywords: ["cake", "birthday", "celebration"],
      },
      {
        emoji: "🍾",
        name: "Champagne",
        keywords: ["champagne", "celebrate", "party"],
      },
      {
        emoji: "🥳",
        name: "Party Face",
        keywords: ["party", "celebrate", "fun"],
      },
      {
        emoji: "🎆",
        name: "Fireworks",
        keywords: ["fireworks", "celebration", "night"],
      },
      {
        emoji: "✨",
        name: "Sparkles",
        keywords: ["sparkles", "shine", "special"],
      },
      { emoji: "🌟", name: "Star", keywords: ["star", "shine", "special"] },
      { emoji: "💫", name: "Dizzy", keywords: ["dizzy", "star", "sparkle"] },
      { emoji: "⭐", name: "Star", keywords: ["star", "favorite", "best"] },
    ],
  },
  {
    id: "symbols",
    name: "Symbols & Objects",
    icon: "💯",
    emojis: [
      {
        emoji: "💯",
        name: "Hundred Points",
        keywords: ["100", "perfect", "score"],
      },
      {
        emoji: "💡",
        name: "Light Bulb",
        keywords: ["idea", "light", "bulb", "think"],
      },
      { emoji: "🔥", name: "Fire", keywords: ["fire", "hot", "lit", "flame"] },
      {
        emoji: "⚡",
        name: "Lightning",
        keywords: ["lightning", "fast", "bolt"],
      },
      { emoji: "💪", name: "Muscle", keywords: ["muscle", "strong", "power"] },
      { emoji: "🏆", name: "Trophy", keywords: ["trophy", "win", "champion"] },
      { emoji: "🎯", name: "Target", keywords: ["target", "goal", "bullseye"] },
      { emoji: "✅", name: "Check Mark", keywords: ["check", "done", "yes"] },
      { emoji: "❌", name: "Cross Mark", keywords: ["x", "no", "wrong"] },
      {
        emoji: "⚠️",
        name: "Warning",
        keywords: ["warning", "caution", "alert"],
      },
      { emoji: "🚀", name: "Rocket", keywords: ["rocket", "launch", "fast"] },
      { emoji: "💎", name: "Gem", keywords: ["gem", "diamond", "precious"] },
    ],
  },
  {
    id: "food",
    name: "Food & Drink",
    icon: "🍕",
    emojis: [
      { emoji: "☕", name: "Coffee", keywords: ["coffee", "drink", "cafe"] },
      { emoji: "🍕", name: "Pizza", keywords: ["pizza", "food", "italian"] },
      {
        emoji: "🍔",
        name: "Burger",
        keywords: ["burger", "food", "hamburger"],
      },
      { emoji: "🍟", name: "Fries", keywords: ["fries", "food", "french"] },
      { emoji: "🍿", name: "Popcorn", keywords: ["popcorn", "snack", "movie"] },
      { emoji: "🍰", name: "Cake", keywords: ["cake", "dessert", "sweet"] },
      { emoji: "🍪", name: "Cookie", keywords: ["cookie", "dessert", "snack"] },
      { emoji: "🍩", name: "Donut", keywords: ["donut", "dessert", "sweet"] },
      { emoji: "🍦", name: "Ice Cream", keywords: ["ice", "cream", "dessert"] },
      { emoji: "🍷", name: "Wine", keywords: ["wine", "drink", "alcohol"] },
      { emoji: "🍺", name: "Beer", keywords: ["beer", "drink", "alcohol"] },
      {
        emoji: "🥂",
        name: "Cheers",
        keywords: ["cheers", "toast", "celebrate"],
      },
    ],
  },
  {
    id: "travel",
    name: "Travel & Places",
    icon: "✈️",
    emojis: [
      {
        emoji: "✈️",
        name: "Airplane",
        keywords: ["plane", "travel", "flight"],
      },
      {
        emoji: "🏨",
        name: "Hotel",
        keywords: ["hotel", "accommodation", "building"],
      },
      { emoji: "🏖️", name: "Beach", keywords: ["beach", "vacation", "sand"] },
      { emoji: "🗺️", name: "Map", keywords: ["map", "travel", "navigate"] },
      {
        emoji: "🧳",
        name: "Luggage",
        keywords: ["luggage", "travel", "suitcase"],
      },
      {
        emoji: "🎒",
        name: "Backpack",
        keywords: ["backpack", "travel", "bag"],
      },
      {
        emoji: "🏔️",
        name: "Mountain",
        keywords: ["mountain", "nature", "climb"],
      },
      {
        emoji: "🏝️",
        name: "Island",
        keywords: ["island", "vacation", "tropical"],
      },
      { emoji: "🌅", name: "Sunrise", keywords: ["sunrise", "morning", "sun"] },
      { emoji: "🌃", name: "Night City", keywords: ["city", "night", "urban"] },
      { emoji: "🌊", name: "Wave", keywords: ["wave", "water", "ocean"] },
      { emoji: "⛱️", name: "Umbrella", keywords: ["umbrella", "beach", "sun"] },
    ],
  },
  {
    id: "activities",
    name: "Activities & Sports",
    icon: "⚽",
    emojis: [
      {
        emoji: "⚽",
        name: "Soccer Ball",
        keywords: ["soccer", "football", "ball"],
      },
      {
        emoji: "🏀",
        name: "Basketball",
        keywords: ["basketball", "ball", "sport"],
      },
      {
        emoji: "🏈",
        name: "Football",
        keywords: ["football", "american", "sport"],
      },
      {
        emoji: "⚾",
        name: "Baseball",
        keywords: ["baseball", "ball", "sport"],
      },
      { emoji: "🎾", name: "Tennis", keywords: ["tennis", "ball", "sport"] },
      {
        emoji: "🏐",
        name: "Volleyball",
        keywords: ["volleyball", "ball", "sport"],
      },
      {
        emoji: "🎮",
        name: "Video Game",
        keywords: ["game", "controller", "gaming"],
      },
      { emoji: "🎲", name: "Dice", keywords: ["dice", "game", "chance"] },
      { emoji: "🎵", name: "Music", keywords: ["music", "note", "sound"] },
      {
        emoji: "🎸",
        name: "Guitar",
        keywords: ["guitar", "music", "instrument"],
      },
      { emoji: "📚", name: "Books", keywords: ["books", "read", "study"] },
      {
        emoji: "💼",
        name: "Briefcase",
        keywords: ["briefcase", "work", "business"],
      },
    ],
  },
];

// Quick access emojis (most commonly used)
export const quickEmojis: Emoji[] = [
  { emoji: "😊", name: "Smiling Face", keywords: ["smile", "happy"] },
  { emoji: "😂", name: "Laughing", keywords: ["laugh", "lol"] },
  { emoji: "❤️", name: "Red Heart", keywords: ["heart", "love"] },
  { emoji: "👍", name: "Thumbs Up", keywords: ["thumbs", "up", "yes"] },
  { emoji: "💡", name: "Light Bulb", keywords: ["idea", "light"] },
  { emoji: "🔥", name: "Fire", keywords: ["fire", "hot"] },
  { emoji: "💯", name: "Hundred Points", keywords: ["100", "perfect"] },
  { emoji: "🎉", name: "Party Popper", keywords: ["party", "celebration"] },
];
