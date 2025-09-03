// src/news/fetchDateWorthyHeadlines.js

/**
 * Fetch "date-worthy" live headlines per topic using:
 *   1. Topic-specific RSS feeds
 *   2. NewsData.io API (lightweight)
 *   3. Curated fallback (handled in News.jsx)
 */

import { isDateWorthy, scoreArticleForDateNight, dedupeArticles } from "./dateHeuristics";
import { TITLE_SEEDS, DOMAIN_ALLOW } from "../data/topicSeeds";
import rssTopicFeeds from "../data/rssTopicFeeds";

// --- tiny utils -------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

function normalizeArticle(a = {}) {
  const title = a.title || a.heading || a.name || "";
  const description = a.description || a.excerpt || a.summary || a.content || "";
  const url = a.url || a.link || a.source_url || "";
  const pub =
    a.pubDate ||
    a.published_at ||
    a.publishedAt ||
    a.date ||
    a.updated_at ||
    a.updated ||
    "";
  const source = a.source_id || a.source || a.site || a.publisher || "";

  return {
    ...a,
    title,
    description,
    url,
    link: url,
    pubDate: pub,
    publishedAt: pub,
    source,
  };
}

// --- NewsData.io plumbing ---------------------------------------------------
const NEWSDATA_BASE = "https://newsdata.io/api/1/news";

function buildNewsdataUrl({ apiKey, q, domains = [], page = 1, language = "en" }) {
  const params = new URLSearchParams();
  params.set("apikey", apiKey);
  params.set("language", language);
  params.set("page", String(page));
  if (q && q.trim()) params.set("q", q.trim());
  const allow = uniq(domains);
  if (allow.length) params.set("domain", allow.join(","));
  return `${NEWSDATA_BASE}?${params.toString()}`;
}

async function fetchNewsDataForTopic({ topic, apiKey, seeds = [], domains = [] }) {
  if (!apiKey) return [];

  const seedList = (seeds || []).filter(Boolean);
  const attempts = [
    { q: seedList.slice(0, 3).map((s) => `"${s}"`).join(" OR ") },
    { q: `"${topic}"` },
    { q: (String(topic).split(/\s+/)[0] || String(topic)) },
  ].filter((a) => a.q && a.q.trim());

  const tryOnce = async (q) => {
    const url = buildNewsdataUrl({ apiKey, q, domains });
    console.log("[newsdata] request →", { topic, q });

    const res = await fetch(url);
    if (res.status === 429) {
      console.debug("[newsdata] 429 rate limit for q=", q);
      await sleep(1500);
      return [];
    }
    if (!res.ok) {
      console.warn("[newsdata] non-OK", res.status, "q=", q);
      return [];
    }

    const data = await res.json();
    const raw = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.articles)
      ? data.articles
      : [];
    return raw
      .map(normalizeArticle)
      .filter((a) => a.title && a.url)
      .map((a) => ({ ...a, sourceType: "newsdata" }));
  };

  for (const attempt of attempts) {
    const items = await tryOnce(attempt.q);
    if (items.length) return items;
  }
  return [];
}

// --- RSS support (rss2json) -------------------------------------------------
async function fetchRssForTopic({ topic, feeds = [] }) {
  const out = [];
  for (const feed of feeds) {
    try {
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`;
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      if (!Array.isArray(data.items)) continue;

      const items = data.items.map((item) =>
        normalizeArticle({
          title: item.title,
          description: item.description,
          url: item.link,
          pubDate: item.pubDate,
          source: new URL(item.link).hostname.replace(/^www\./, ""),
          sourceType: "rss",
        })
      );

      console.log(`[RSS] ✅ fetched ${items.length} from ${feed} for topic ${topic}`);
      out.push(...items);
    } catch (e) {
      console.warn("[RSS] ❌ error for", feed, e?.message || e);
    }
  }
  return out;
}

// --- Public orchestrator ----------------------------------------------------
export async function fetchDateWorthyHeadlines({
  selectedTopics = undefined,
  topics = [],
  city = "",
  teams = [],
  newsdataApiKey = "",
  extraRSS = rssTopicFeeds,
  perTopic = 3,
} = {}) {
  const topicsIn = (selectedTopics ?? topics ?? []).filter(Boolean);
  const out = {};
  const GAP_MS = 250;

  for (const topic of topicsIn) {
    const seeds = (TITLE_SEEDS?.[topic] || []).filter(Boolean);
    let newsdataItems = [];
    let rssItems = [];

    // 1. RSS
    try {
      const feeds = Array.isArray(extraRSS?.[topic]) ? extraRSS[topic] : [];
      if (feeds.length) {
        rssItems = await fetchRssForTopic({ topic, feeds });
      }
    } catch (e) {
      console.warn("[LiveWire] rss error:", e?.message || e);
    }

    // 2. NewsData
    try {
      newsdataItems = await fetchNewsDataForTopic({
        topic,
        apiKey: newsdataApiKey,
        seeds,
        domains: DOMAIN_ALLOW?.[topic] || [],
      });
    } catch (e) {
      console.warn("[LiveWire] newsdata error:", e?.message || e);
    }

    // 3. Merge + heuristics
    let merged = dedupeArticles([...(rssItems || []), ...(newsdataItems || [])]);
    let filtered = merged.filter((a) => isDateWorthy(a, { topic, city, teams }));

    if (!filtered.length) {
      filtered = (rssItems.length ? rssItems : newsdataItems).slice(0, perTopic);
    }

    filtered.sort((a, b) => {
      const sb = scoreArticleForDateNight(b, { topic, city, teams });
      const sa = scoreArticleForDateNight(a, { topic, city, teams });
      return sb - sa;
    });

    out[topic] = filtered.slice(0, perTopic);
    await sleep(GAP_MS);
  }

  if (typeof window !== "undefined") {
    window.__livewireDebug = out;
    console.log("[LiveWire] debug:", out);
  }

  return out;
}

export default fetchDateWorthyHeadlines;




