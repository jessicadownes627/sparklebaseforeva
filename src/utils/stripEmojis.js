// src/utils/stripEmojis.js

/**
 * Removes emojis from a string.
 * Keeps everything else intact (letters, numbers, punctuation).
 */
export function stripEmoji(str = "") {
  if (!str) return "";
  return str
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\u24C2|[\uD83C-\uDBFF\uDC00-\uDFFF])+/g,
      ""
    )
    .trim();
}
