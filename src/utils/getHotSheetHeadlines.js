// src/utils/getHotSheetHeadlines.js
import subtopicFeeds from "../data/rssSubtopicFeeds";
import { fetchHotSheetFromSheet } from "./fetchHotSheetFromSheet";

// Helper: RSS fetch via Netlify proxy
async function fetchRSSFeed(url, subtopic) {
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
      subtopic,
      sourceType: "rss",
    }));
  } catch (err) {
    console.error(`[RSS Error] ${url}:`, err);
    return [];
  }
}

// Main merge function
export async function getHotSheetHeadlines({ subtopics = [], maxPerSubtopic = 3 }) {
  const results = {};
  const sheetData = await fetchHotSheetFromSheet();

  for (const subtopic of subtopics) {
    const fromSheet = sheetData[subtopic] || [];
    let mergedArticles = [];

    // Try RSS first
    const feeds = subtopicFeeds[subtopic] || [];
    let rssHeadline = null;
    for (const url of feeds) {
      const rssItems = await fetchRSSFeed(url, subtopic);
      if (rssItems.length) {
        rssHeadline = rssItems[0]; // grab first/latest headline
        break;
      }
    }

    // Build entries with RSS headline + sheet fact/ask
    if (fromSheet.length > 0) {
      mergedArticles = fromSheet.map((entry, i) => ({
        title: rssHeadline?.title || entry.title || subtopic,
        description: entry.fact || "",
        ask: entry.ask || "",
        link: rssHeadline?.link || "",
        publishedAt: rssHeadline?.publishedAt || new Date().toISOString(),
        source: rssHeadline?.source || "Hot Sheet",
        subtopic,
        sourceType: rssHeadline ? "rss+sheet" : "sheet",
      }));
    }

    // If nothing at all, fallback dummy
    if (!mergedArticles.length) {
      mergedArticles = [
        {
          title: `No Hot Sheet available for ${subtopic}`,
          description: "",
          ask: "",
          link: "",
          publishedAt: new Date().toISOString(),
          source: "Talk More Tonight",
          subtopic,
          sourceType: "empty",
        },
      ];
    }

    results[subtopic] = mergedArticles.slice(0, maxPerSubtopic);
  }

  return results;
}
