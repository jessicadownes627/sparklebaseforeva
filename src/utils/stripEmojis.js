// utils/stripEmojis.js
export const stripEmojis = (str) =>
  str.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/g,
    ""
  ).trim();
