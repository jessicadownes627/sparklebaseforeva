// src/utils/dedupeArticles.js
export function dedupeArticles(articles) {
  const seen = new Set();
  return articles.filter((a) => {
    const normalized = (a.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]/gi, "")
      .trim();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
