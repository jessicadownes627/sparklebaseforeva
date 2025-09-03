// src/news/dateHeuristics.js

// Decide if an article is "date night worthy"
export function isDateWorthy(article) {
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();

  // exclude heavy stuff
  const badWords = ["murder", "crime", "lawsuit", "politics", "election", "war"];
  if (badWords.some(word => text.includes(word))) return false;

  // include fun stuff
  const goodWords = ["concert", "festival", "restaurant", "dining", "food", "event", "movie", "show", "comedy"];
  return goodWords.some(word => text.includes(word));
}

// Score an article (higher = better)
export function scoreArticleForDateNight(article) {
  let score = 0;
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();

  if (text.includes("concert") || text.includes("festival")) score += 3;
  if (text.includes("restaurant") || text.includes("food") || text.includes("dining")) score += 2;
  if (text.includes("movie") || text.includes("show") || text.includes("comedy")) score += 2;
  if (text.includes("sports")) score += 1;

  if (text.includes("murder") || text.includes("lawsuit")) score -= 5;
  if (text.includes("politics") || text.includes("election")) score -= 3;

  return score;
}

// Remove duplicate articles
export function dedupeArticles(articles = []) {
  const seen = new Set();
  return articles.filter(a => {
    const key = (a.url || a.title || "").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
