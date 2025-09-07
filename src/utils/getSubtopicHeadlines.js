// src/utils/getSubtopicHeadlines.js
import feeds from "../data/rssTopicFeeds";
import subtopicOptions from "../data/subtopicOptions";
import { fetchHotSheetFromSheet } from "./fetchHotSheetFromSheet";

/**
 * Fetch from NewsData.io (via Netlify proxy)
 */
async function fetchNewsDataHeadlines(subtopic) {
  try {
    const cleanSub = subtopic.replace(/[^\w\s]/gi, "");
    const url = `/.netlify/functions/newsdata?q=${encodeURIComponent(cleanSub)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return (data.results || []).map((item) => ({
      title: item.title,
      description: item.description || "",
      link: item.link,
      publishedAt: item.pubDate || new Date().toISOString(),
      source: item.source_name || "NewsData",
      subtopic,
      sourceType: "api",
    }));
  } catch (err) {
    console.error("[API Error]", err);
    return [];
  }
}

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
      publishedAt: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
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
 * Main: API → RSS → Curated → Dummy
 * Always merge in the `ask` from Google Sheet
 */
export default async function getSubtopicHeadlines({ subtopics = [], city }) {
  const results = {};
  const hotSheetData = await fetchHotSheetFromSheet();

  // Normalize input
  const subs = Array.isArray(subtopics)
    ? subtopics
    : Object.values(subtopics || {});

  for (const sub of subs) {
    const parentTopic = Object.keys(subtopicOptions).find((topic) =>
      subtopicOptions[topic].includes(sub)
    );
    if (!parentTopic) continue;

    const urls = feeds[parentTopic] || [];
    let articles = [];

    // 1. API first
    const apiItems = await fetchNewsDataHeadlines(sub);
    articles = articles.concat(apiItems);

    // 2. RSS if empty
    if (articles.length === 0) {
      for (const url of urls) {
        const rssItems = await fetchRSSFeed(url, sub);
        articles = articles.concat(rssItems);
      }
    }

    // 3. Curated from Google Sheet
    if (articles.length === 0 && hotSheetData[sub]) {
      articles = hotSheetData[sub].map((item) => ({
        ...item,
        subtopic: sub,
        sourceType: "curated",
      }));
    }

    // 4. Dummy
    if (articles.length === 0) {
      articles = [
        {
          title: `No live news for ${sub}`,
          description: "",
          link: "",
          publishedAt: new Date().toISOString(),
          source: "Talk More Tonight",
          subtopic: sub,
          sourceType: "empty",
        },
      ];
    }

    // ✅ Always merge in the `ask` (conversation starter)
    if (hotSheetData[sub] && hotSheetData[sub][0]?.ask) {
      articles = articles.map((a) => ({
        ...a,
        ask: hotSheetData[sub][0].ask,
      }));
    }

    // City boost
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
