import rssTopicFeeds from "../data/rssTopicFeeds";
import { fetchCuratedFallbacksFromSheet } from "./fetchCuratedFallbacksFromSheet";

// Fetch from NewsData.io (via Netlify proxy)
async function fetchNewsDataHeadlines(topic) {
  try {
    const cleanTopic = topic.replace(/[^\w\s]/gi, "");
    const url = `/.netlify/functions/newsdata?q=${encodeURIComponent(cleanTopic)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return (data.results || []).map((item) => ({
      title: item.title,
      description: item.description || "",
      link: item.link,
      publishedAt: item.pubDate || new Date().toISOString(),
      source: item.source_name || "NewsData",
      topic,
      sourceType: "api",
    }));
  } catch (err) {
    console.error("[API Error]", err);
    return [];
  }
}

// RSS parser via Netlify proxy
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
      publishedAt:
        item.querySelector("pubDate")?.textContent || new Date().toISOString(),
      source: new URL(url).hostname.replace("www.", ""),
      topic,
      sourceType: "rss",
    }));
  } catch (err) {
    console.error(`[RSS Error] ${url}:`, err);
    return [];
  }
}

// Main function: merge API + RSS, fallback to curated
export async function getLiveWireHeadlines({ topics = [], maxPerTopic = 5 }) {
  const results = {};
  const curated = await fetchCuratedFallbacksFromSheet();

  for (const topic of topics) {
    let articles = [];

    // 1. API
    const apiItems = await fetchNewsDataHeadlines(topic);

    // 2. RSS
    let rssItems = [];
    const feeds = rssTopicFeeds[topic] || [];
    for (const url of feeds) {
      const feedItems = await fetchRSSFeed(url, topic);
      rssItems = [...rssItems, ...feedItems];
    }

    // 3. Merge API + RSS
    articles = [...apiItems, ...rssItems];

    // 4. Curated fallback if nothing live
    if (!articles.length && curated[topic]) {
      articles = curated[topic].map((item) => ({
        ...item,
        topic,
        sourceType: "curated",
      }));
    }

    // 5. Dummy placeholder
    if (!articles.length) {
      articles = [
        {
          title: `No news available for ${topic}`,
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
