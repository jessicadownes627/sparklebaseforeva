// src/utils/getLiveWireHeadlinesFromNewsData.js
// Named export. ALWAYS returns an array of articles.
// [{ topic, title, url, description, source, publishedAt, isFallback:false }]

const stripEmoji = (s = "") =>
  s.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDEFF])/g,
    ""
  ).trim();

const quoteIfSpaced = (t = "") => (/\s/.test(t) ? `"${t}"` : t);

const MAX_KEYWORDS = 8; // keep NewsData query sane

function passesBadWords(a, badWords = []) {
  if (!badWords?.length) return true;
  const hay = `${a.title || ""} ${a.description || ""}`.toLowerCase();
  return !badWords.some((w) => w && hay.includes(String(w).toLowerCase()));
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((a) => {
    const key = (a.url || a.title || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getLiveWireHeadlinesFromNewsData(
  { topics = [], keywordMap = {}, badWordsByTopic = {} } = {},
  { apiKey, maxPerTopic = 3, pagesPerTopic = 1, lang = "en", country = "us" } = {}
) {
  if (!apiKey) return []; // let RSS handle it if no key

  const baseTopics = (topics || []).map((t) => stripEmoji(t));
  const perTopic = baseTopics.map(async (topic) => {
    // build query terms: topic + keywords (capped)
    const kws = (keywordMap[topic] || []).filter(Boolean).slice(0, MAX_KEYWORDS);
    const terms = [topic, ...kws].filter(Boolean).map(quoteIfSpaced);
    const q = terms.length ? terms.join(" OR ") : quoteIfSpaced(topic); // never empty

    let collected = [];
    let nextToken = null; // NewsData passes back a token for pagination

    for (let i = 0; i < pagesPerTopic && collected.length < maxPerTopic; i++) {
      // first request has NO page param; subsequent use &page=<token>
      const baseUrl =
        `https://newsdata.io/api/1/news` +
        `?apikey=${encodeURIComponent(apiKey)}` +
        `&q=${encodeURIComponent(q)}` +
        `&language=${encodeURIComponent(lang)}` +
        `&country=${encodeURIComponent(country)}`;
      const url = nextToken ? `${baseUrl}&page=${encodeURIComponent(nextToken)}` : baseUrl;

      try {
        const res = await fetch(url);
        if (!res.ok) {
          // 422 or others — stop live for this topic; RSS will top off
          break;
        }
        const data = await res.json();

        const mapped = (data?.results || []).map((it) => ({
          topic,
          title: it.title || "",
          url: it.link || "",
          description: it.description || "",
          source: it.source_id || it.source || "NewsData",
          publishedAt: it.pubDate ? new Date(it.pubDate).toISOString() : "",
          isFallback: false,
        }));

        const filtered = mapped.filter((a) => passesBadWords(a, badWordsByTopic[topic]));
        collected = dedupe([...collected, ...filtered]).slice(0, maxPerTopic);

        nextToken = data?.nextPage || null;
        if (!nextToken) break; // no more pages
      } catch {
        break; // network hiccup — let RSS fill
      }
    }

    return collected;
  });

  try {
    const arrays = await Promise.all(perTopic);
    return arrays.flat(); // ALWAYS an array
  } catch {
    return []; // never throw to caller
  }
}
