import rssCityMap from "./rssCityMap";
import { parseFeed } from "./rssParser";

// Normalize once (lowercase keys) but DO NOT edit Mike’s map.
const RSS_CITY_MAP_NORM = Object.fromEntries(
  Object.entries(rssCityMap).map(([k, v]) => [k.toLowerCase().trim(), v])
);

// Optional alias/corrections layer (keep empty unless Mike confirms)
// Example usage later if needed:
// const TAPINTO_KEY_ALIASES = { "coconut creek, fl": "coconut creek, nj" };
const TAPINTO_KEY_ALIASES = {};

export const getTAPintoHeadlinesForCity = async (city) => {
  try {
    const raw = String(city || "").toLowerCase().trim();
    if (!raw) return [];

    // split "City, ST" if provided
    const [name, st = ""] = raw.split(",").map(s => s.trim());

    // 1) exact "city, st" first (preferred)
    const exactKey = st ? `${name}, ${st}` : name;

    // alias redirect if you ever add one (keeps Mike’s list untouched)
    const aliasedKey = TAPINTO_KEY_ALIASES[exactKey] || exactKey;

    let entry = RSS_CITY_MAP_NORM[aliasedKey];

    // 2) SAFE fallback: only when NO state provided AND there is exactly one match
    // across all states for this city name.
    if (!entry && !st) {
      const candidates = Object.entries(RSS_CITY_MAP_NORM).filter(([k]) =>
        k.startsWith(`${name}, `)
      );
      if (candidates.length === 1) {
        entry = candidates[0][1];
      }
    }

    if (!entry) return []; // No TAPinto for this exact city/state (correct)

    const { feedUrl } = entry;
    const items = await parseFeed(feedUrl);
    return Array.isArray(items) ? items : [];
  } catch (err) {
    console.error("❌ TAPinto error:", err);
    return [];
  }
};
