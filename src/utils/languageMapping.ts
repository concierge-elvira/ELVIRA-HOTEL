/**
 * Language Mapping Utilities
 *
 * Maps full language names to ISO 639-1 codes and provides
 * explicit language instructions for translation APIs
 */

/**
 * Map of common language names to ISO 639-1 codes
 */
export const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  // European languages
  German: "de",
  English: "en",
  Spanish: "es",
  French: "fr",
  Italian: "it",
  Portuguese: "pt",
  Dutch: "nl",
  Polish: "pl",
  Russian: "ru",
  Ukrainian: "uk",
  Bulgarian: "bg",
  Romanian: "ro",
  Czech: "cs",
  Slovak: "sk",
  Hungarian: "hu",
  Greek: "el",
  Swedish: "sv",
  Danish: "da",
  Norwegian: "no",
  Finnish: "fi",

  // Asian languages
  Chinese: "zh",
  Japanese: "ja",
  Korean: "ko",
  Thai: "th",
  Vietnamese: "vi",
  Indonesian: "id",
  Malay: "ms",
  Hindi: "hi",
  Arabic: "ar",
  Hebrew: "he",
  Turkish: "tr",

  // Other
  Catalan: "ca",
  Croatian: "hr",
  Serbian: "sr",
  Slovenian: "sl",
  Estonian: "et",
  Latvian: "lv",
  Lithuanian: "lt",
};

/**
 * Map of ISO 639-1 codes to full language names
 */
export const LANGUAGE_CODE_TO_NAME: Record<string, string> = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  pl: "Polish",
  ru: "Russian",
  uk: "Ukrainian",
  bg: "Bulgarian",
  ro: "Romanian",
  cs: "Czech",
  sk: "Slovak",
  hu: "Hungarian",
  el: "Greek",
  sv: "Swedish",
  da: "Danish",
  no: "Norwegian",
  fi: "Finnish",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  hi: "Hindi",
  ar: "Arabic",
  he: "Hebrew",
  tr: "Turkish",
  ca: "Catalan",
  hr: "Croatian",
  sr: "Serbian",
  sl: "Slovenian",
  et: "Estonian",
  lv: "Latvian",
  lt: "Lithuanian",
};

/**
 * Normalize language input to ISO 639-1 code
 * Handles both full names and codes
 */
export function normalizeLanguageToCode(
  language: string | null | undefined
): string {
  if (!language) return "en";

  const trimmed = language.trim();

  // If it's already a 2-letter code, return it
  if (trimmed.length === 2 && LANGUAGE_CODE_TO_NAME[trimmed.toLowerCase()]) {
    return trimmed.toLowerCase();
  }

  // If it's a full name, convert to code
  if (LANGUAGE_NAME_TO_CODE[trimmed]) {
    return LANGUAGE_NAME_TO_CODE[trimmed];
  }

  // If we can't find it, default to English
  console.warn(`Unknown language: ${language}, defaulting to 'en'`);
  return "en";
}

/**
 * Get full language name from code
 */
export function getLanguageName(code: string | null | undefined): string {
  if (!code) return "English";

  const normalized = code.toLowerCase().trim();
  return LANGUAGE_CODE_TO_NAME[normalized] || "English";
}

/**
 * Create explicit translation instruction for OpenAI
 * This helps ensure OpenAI translates to the correct language
 */
export function createTranslationInstruction(targetLanguage: string): string {
  const code = normalizeLanguageToCode(targetLanguage);
  const name = getLanguageName(code);

  return `${name} (language code: ${code})`;
}
