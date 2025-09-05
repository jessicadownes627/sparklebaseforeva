// src/utils/getLiveWireHeadlines.js
import rssTopicFeeds from "../data/rssTopicFeeds";
import { fetchCuratedFallbacksFromSheet } from "./fetchCuratedFallbacksFromSheet";

/**
 * Fetch and parse RSS through Netlify proxy
 */
async function fetchRSSFeed(url, topic) {
  try {
    const proxyUrl = `/.netlify/functions/rssProxy?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const xml = new DOMParser().parseFromString(text, "text/xml");

    return [...xml.querySelectorAll("item")].map((item) => ({
      title: item.querySelector("title")?.textContent || "",
      description: item.querySelector("description")?.textContent || "",
      link: item.querySelector("link")?.textContent || "",
      publishedAt: item.querySelector("pubDate")?.textContent || "",
      source: new URL(url).hostname.replace("www.", ""),
      topic,
      sourceType: "rss", // will display as LIVE
    }));
  } catch (err) {
    console.error(`[RSS Error] ${url}:`, err);
    return [];
  }
}

/**
 * Fetch from NewsData.io (via Netlify proxy)
 */
async function fetchNewsDataHeadlines(topic) {
  try {
    const url = `/.netlify/functions/newsdata?q=${encodeURIComponent(topic)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return (data.results || []).map((item) => ({
      title: item.title,
      description: item.description || "",
      link: item.link,
      publishedAt: item.pubDate,
      source: item.source_name,
      topic,
      sourceType: "api", // will display as LIVE
    }));
  } catch (err) {
    console.error("[API Error]", err);
    return [];
  }
}

/**
 * Main function: RSS → API → Curated → Dummy
 */
export default async function getLiveWireHeadlines({
  topics = [],
  maxPerTopic = 5,
}) {
  const results = {};
  const curated = await fetchCuratedFallbacksFromSheet();

  for (const topic of topics) {
    let articles = [];

    // 1. RSS
    const feeds = rssTopicFeeds[topic] || [];
    for (const url of feeds) {
      const items = await fetchRSSFeed(url, topic);
      articles = articles.concat(items);
    }

    // 2. API if RSS empty
    if (articles.length === 0) {
      const apiItems = await fetchNewsDataHeadlines(topic);
      articles = apiItems;
    }

    // 3. Curated if still empty
    if (articles.length === 0 && curated[topic]) {
      articles = curated[topic].map((item) => ({
        ...item,
        topic,
        sourceType: "curated",
      }));
    }

    // 4. Dummy last resort
    if (articles.length === 0) {
      articles = [
        {
          title: `No live news for ${topic}`,
          description: "",
          link: "",
          publishedAt: new Date().toISOString(),
          source: "Talk More Tonight",
          topic,
          sourceType: "empty",
        },
      ];
    }

    results[topic] = articles.slice(0, maxPerTopic);
  }

  return results;
}
