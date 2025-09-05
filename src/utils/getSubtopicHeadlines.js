// src/utils/getSubtopicHeadlines.js
import feeds from "../data/rssTopicFeeds";
import subtopicOptions from "../data/subtopicOptions";
import subtopicAsks from "../data/subtopicAsks";
import { fetchCuratedFallbacksFromSheet } from "./fetchCuratedFallbacksFromSheet";

/**
 * Fetch RSS feed via Netlify proxy
 */
async function fetchRSSFeed(url, subtopic) {
  try {
    const proxyUrl = `/.netlify/functions/rssProxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");

    return [...xml.querySelectorAll("item")].map((item) => ({
      title: item.querySelector("title")?.textContent || "",
      description: item.querySelector("description")?.textContent || "",
      link: item.querySelector("link")?.textContent || "",
      publishedAt: item.querySelector("pubDate")?.textContent || "",
      source: new URL(url).hostname.replace("www.", ""),
      subtopic,
      sourceType: "rss",
    }));
  } catch (err) {
    console.error(`[RSS Error] ${url}:`, err);
    return [];
  }
}

/**
 * Fetch from NewsData.io (via Netlify proxy)
 */
async function fetchNewsDataHeadlines(subtopic) {
  const url = `/.netlify/functions/newsdata?q=${encodeURIComponent(subtopic)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return (data.results || []).map((item) => ({
      title: item.title,
      description: item.description || "",
      link: item.link,
      publishedAt: item.pubDate,
      source: item.source_name,
      subtopic,
      sourceType: "api",
    }));
  } catch (err) {
    console.error("[API Error]", err);
    return [];
  }
}

/**
 * Main: fetch headlines for chosen subtopics
 */
export default async function getSubtopicHeadlines({ subtopics = [], city }) {
  const results = {};
  const curated = await fetchCuratedFallbacksFromSheet();

  // Normalize subtopics input
  const subs = Array.isArray(subtopics)
    ? subtopics
    : Object.values(subtopics || {});

  for (const sub of subs) {
    // Find parent topic for RSS lookup
    const parentTopic = Object.keys(subtopicOptions).find((topic) =>
      subtopicOptions[topic].includes(sub)
    );
    if (!parentTopic) continue;

    const urls = feeds[parentTopic] || [];
    let articles = [];

    // 1. RSS
    for (const url of urls) {
      const items = await fetchRSSFeed(url, sub);
      articles = articles.concat(items);
    }

    // 2. API fallback
    if (articles.length === 0) {
      const apiItems = await fetchNewsDataHeadlines(sub);
      articles = apiItems;
    }

    // 3. Curated fallback
    if (articles.length === 0 && curated[sub]) {
      articles = curated[sub].map((item) => ({
        ...item,
        subtopic: sub,
        sourceType: "curated",
      }));
    }

    // 4. Dummy fallback
    if (articles.length === 0) {
      articles = [
        {
          title: `No live news for ${sub}`,
          description: "",
          link: "",
          publishedAt: new Date().toLocaleDateString(),
          source: "Talk More Tonight",
          subtopic: sub,
          sourceType: "empty",
        },
      ];
    }

    // ✅ Always attach Ask (from subtopicAsks.js)
    const ask = subtopicAsks[sub];
    articles = articles.map((a) => ({
      ...a,
      ask: ask ? ask : null,
    }));

    // Boost local city mentions
    const lowerCity = city?.toLowerCase();
    if (lowerCity) {
      articles = articles.sort((a, b) => {
        const aBoost = (a.title + a.description).toLowerCase().includes(lowerCity)
          ? 1
          : 0;
        const bBoost = (b.title + b.description).toLowerCase().includes(lowerCity)
          ? 1
          : 0;
        return bBoost - aBoost;
      });
    }

    results[sub] = articles.slice(0, 3);
  }

  return results;
}
