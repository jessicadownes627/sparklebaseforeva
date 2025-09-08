// utils/getHotSheetHeadlines.js
import subtopicFeeds from "../data/rssSubtopicFeeds";
import { fetchHotSheetFromSheet } from "./fetchHotSheetFromSheet";

// Reuse RSS fetcher
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

// Main function: RSS → Sheet
export async function getHotSheetHeadlines({ subtopics = [], maxPerSubtopic = 3 }) {
  const results = {};
  const sheetData = await fetchHotSheetFromSheet();

  console.log("🔥 Requested subtopics:", subtopics);
  console.log("🔥 Sheet data sample:", sheetData.slice(0, 5));

  for (const subtopic of subtopics) {
    let articles = [];

    // 1. Try RSS
    const feeds = subtopicFeeds[subtopic] || [];
    for (const url of feeds) {
      const rssItems = await fetchRSSFeed(url, subtopic);
      if (rssItems.length) {
        articles = rssItems;
        break;
      }
    }

    // 2. Always enrich with Ask from Google Sheet
    const sheetRow = sheetData.find(
      (row) =>
        row.subtopic?.toLowerCase().trim() === subtopic?.toLowerCase().trim()
    );

    const askText =
      sheetRow?.ask || `Ask [dateName] what they think about ${subtopic}`;

    if (articles.length > 0) {
      // Add the "ask" from sheet to each RSS article
      articles = articles.map((article) => ({
        ...article,
        ask: askText,
      }));
    } else if (sheetRow) {
      // Fallback entirely to sheet (blurb + ask)
      articles = [
        {
          title: sheetRow.blurb || `No news available for ${subtopic}`,
          description: sheetRow.blurb || "",
          link: "",
          publishedAt: new Date().toISOString(),
          source: "Talk More Tonight",
          subtopic,
          sourceType: "sheet",
          ask: askText,
        },
      ];
    } else {
      // Absolute last resort dummy (still attach Ask)
      articles = [
        {
          title: `No news available for ${subtopic}`,
          description: "",
          link: "",
          publishedAt: new Date().toISOString(),
          source: "Talk More Tonight",
          subtopic,
          sourceType: "empty",
          ask: askText,
        },
      ];
    }

    results[subtopic] = articles.slice(0, maxPerSubtopic);
  }

  return results;
}
