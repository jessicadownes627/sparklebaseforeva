// src/utils/fetchGoogleNewsRSS.js
// No dependencies. Works in browser (React) via DOMParser.
// Uses allorigins to dodge CORS.

const BASE = "https://news.google.com/rss";
const proxy = (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

const stripEmoji = (s = "") =>
  s.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDEFF])/g,
    ""
  ).trim();

// --- small helpers -----------------------------------------------------------

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const memCache = new Map(); // key: url, value: { ts, text }

async function fetchWithTimeout(url, { timeoutMs = 8000, retries = 1 } = {}) {
  // serve warm cache immediately (still fetch in background to refresh)
  const cached = memCache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.text;
  }

  let attempt = 0;
  while (attempt <= retries) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      memCache.set(url, { ts: Date.now(), text });
      return text;
    } catch (err) {
      clearTimeout(timer);
      if (attempt > retries) {
        // last attempt failed — fall back to stale cache if we have it
        if (cached) return cached.text;
        throw err;
      }
      // brief backoff before retry
      await new Promise((r) => setTimeout(r, 250));
    }
  }
}

function buildFeedUrl({ q = "", lang = "en", region = "US" } = {}) {
  return q
    ? `${BASE}/search?q=${encodeURIComponent(q)}&hl=${lang}&gl=${region}&ceid=${region}:${lang}`
    : `${BASE}?hl=${lang}&gl=${region}&ceid=${region}:${lang}`;
}

function parseRss(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const items = Array.from(doc.querySelectorAll("item"));
  return items.map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || "";
    const source = item.querySelector("source")?.textContent?.trim() || "Google News";
    const description = item.querySelector("description")?.textContent?.trim() || "";
    return {
      title,
      url: link,
      description, // keep raw; UI strips/clamps
      source,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : "",
    };
  });
}

// --- public API --------------------------------------------------------------

/** Get up to `limit` articles for one topic (topic can have emoji) */
export async function fetchGoogleNewsForTopic(
  topic,
  { lang = "en", region = "US", limit = 3, keywords = [] } = {}
) {
  const base = stripEmoji(topic);
  // OR query: topic + any provided keywords
  const q = [base, ...keywords]
    .filter(Boolean)
    .map((k) => (/\s/.test(k) ? `"${k}"` : k))
    .join(" OR ");

  const url = proxy(buildFeedUrl({ q, lang, region }));
  try {
    const text = await fetchWithTimeout(url, { timeoutMs: 8000, retries: 1 });
    const items = parseRss(text);
    return items.slice(0, limit).map((a) => ({ ...a, topic: base, isFallback: false }));
  } catch {
    return [];
  }
}

/** Batch by topics → { [topicWithoutEmoji]: Article[] } (parallel) */
export async function fetchGoogleNewsByTopics(
  topics = [],
  { lang = "en", region = "US", limitPerTopic = 3, keywordMap = {} } = {}
) {
  const tasks = topics.map(async (t) => {
    const key = stripEmoji(t);
    const kws = keywordMap[key] || [];
    const items = await fetchGoogleNewsForTopic(t, {
      lang,
      region,
      limit: limitPerTopic,
      keywords: kws,
    });
    return [key, items];
  });

  const pairs = await Promise.all(tasks);
  return pairs.reduce((acc, [key, items]) => {
    if (items && items.length) acc[key] = items;
    return acc;
  }, {});
}

export default fetchGoogleNewsByTopics;
