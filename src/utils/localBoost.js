// src/utils/localBoost.js
// Tiny helper to lightly re-rank news by city mentions without touching fetch logic.

const DEFAULT_ALIAS_MAP = {
  "New York": ["New York", "NYC", "N.Y.C.", "Manhattan", "Brooklyn", "Yankees", "Mets", "Knicks", "Rangers", "Giants", "Jets"],
  "Los Angeles": ["Los Angeles", "L.A.", "LA", "SoCal", "Hollywood", "Dodgers", "Lakers", "Rams", "Kings", "USC", "UCLA"],
  "Chicago": ["Chicago", "Chi-Town", "Bulls", "Cubs", "White Sox", "Bears", "Blackhawks"],
  "Dallas": ["Dallas", "DFW", "Cowboys", "Mavs", "Stars", "Rangers (Texas)"],
  "Miami": ["Miami", "South Florida", "Heat", "Marlins", "Dolphins", "Panthers"],
  // Add a few more of your top cities if you want; otherwise the city name alone is used.
};

const norm = (s) => (s || "").toLowerCase();

/**
 * Build a score function for a given city.
 * If the article title/description contains any alias, returns 1, else 0.
 */
export function makeLocBoost(city, aliasMap = DEFAULT_ALIAS_MAP) {
  if (!city) return { score: () => 0, aliases: [] };
  const aliases = aliasMap[city] || [city];
  const needles = aliases.map(a => norm(a));
  const score = (title = "", description = "") => {
    const hay = norm(`${title} ${description}`);
    return needles.some(n => hay.includes(n)) ? 1 : 0;
  };
  return { score, aliases };
}

/**
 * Non-destructive re-rank that prefers local matches, then your existing sort (date).
 * Pass in the same array you already render.
 */
export function rerankWithLocation(articles = [], city, aliasMap) {
  const { score } = makeLocBoost(city, aliasMap);
  // Stable copy first
  return [...articles].sort((a, b) => {
    const sa = score(a.title, a.description);
    const sb = score(b.title, b.description);
    if (sa !== sb) return sb - sa; // local first
    // keep newest next (matches your current vibe)
    return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
  });
}
