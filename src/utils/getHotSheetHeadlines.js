// src/utils/getHotSheetHeadlines.js
import rssTopicFeeds from "../data/rssTopicFeeds";
import { fetchHotSheetFromSheet } from "./fetchHotSheetFromSheet";

/**
 * Fetch and parse RSS feed into article objects
 */
async function fetchRSSFeed(url, subtopic) {
  try {
    const response = await fetch(
      `/api/rssProxy?url=${encodeURIComponent(url)}`
    ); // use your Netlify proxy
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const items = [...xml.querySelectorAll("item")].map((item) => ({
      title: item.querySelector("title")?.textContent || "",
      description: item.querySelector("description")?.textContent || "",
      link: item.querySelector("link")?.textContent || "",
      publishedAt: item.querySelector("pubDate")?.textContent || "",
      source: new URL(url).hostname.replace("www.", ""),
      subtopic,
      sourceType: "rss",
    }));

    return items;
  } catch (err) {
    console.error(`[RSS Error HotSheet] ${url}:`, err);
    return [];
  }
}

/**
 * Main function: build Hot Sheet entries
 */
export default async function getHotSheetHeadlines({
  subtopicAnswers = [],
  dateName = "your date",
  city = "",
  teams = [],
}) {
  const results = {};
  const sheetData = await fetchHotSheetFromSheet();

  for (const subtopic of subtopicAnswers) {
    let entries = [];

    // Try RSS feeds first
    const topicFeeds = rssTopicFeeds[subtopic] || [];
    for (const url of topicFeeds) {
      const feedItems = await fetchRSSFeed(url, subtopic);
      if (feedItems.length > 0) {
        entries = feedItems.map((item) => ({
          ...item,
          ask: sheetData[subtopic]?.[0]?.ask?.replace(
            "[dateName]",
            dateName
          ),
        }));
        break; // only need one live source
      }
    }

    // Fall back to curated if no live results
    if (entries.length === 0 && sheetData[subtopic]) {
      entries = sheetData[subtopic].map((row) => ({
        title: row.summary,
        description: row.fact,
        ask: row.ask?.replace("[dateName]", dateName),
        publishedAt: row.publishedAt || "Curated",
        source: "Talk More Tonight",
        sourceType: "curated",
      }));
    }

    if (entries.length > 0) results[subtopic] = entries;
  }

  return results;
}

