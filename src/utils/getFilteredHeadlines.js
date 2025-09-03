// src/utils/getFilteredHeadlines.js
import feeds from "../data/rssTopicFeeds";
import topicEmojiMap from "../data/topicEmojiMap";
import { fetchCuratedFallbacksFromSheet } from "./fetchCuratedFallbacksFromSheet";

const BAD_WORDS = [
  "apply",
  "fellowship",
  "grant",
  "scholarship",
  "residency",
  "submit",
  "talent show",
  "local council",
  "call for papers",
];

// In-memory cache
const CACHE = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Fetch RSS feed XML
async function fetchRSS(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    return [...xml.querySelectorAll("item")].map((item) => ({
      title: item.querySelector("title")?.textContent || "",
      description: item.querySelector("description")?.textContent || "",
      link: item.querySelector("link")?.textContent || "",
      publishedAt: item.querySelector("pubDate")?.textContent || "",
      source: new URL(url).hostname.replace("www.", ""),
      type: "Live",
    }));
  } catch (err) {
    console.error("RSS fetch error:", err);
    return [];
  }
}

// Filter junk + cap at 3
function filterAndTrim(articles, topic) {
  return articles
    .filter((a) => {
      const text = (a.title + " " + a.description).toLowerCase();
      if (BAD_WORDS.some((w) => text.includes(w))) return false;
      if (!text.includes("us") && !text.includes("america") && !text.includes("new york") && !text.includes("los angeles")) {
        // rough location filter
        return false;
      }
      return true;
    })
    .slice(0, 3)
    .map((a) => ({
      ...a,
      topic,
    }));
}

// Main function
export async function getFilteredHeadlines(topics = []) {
  const now = Date.now();
  const result = {};

  for (const topic of topics) {
    // Check cache
    if (CACHE[topic] && now - CACHE[topic].timestamp < CACHE_TTL) {
      result[topic] = CACHE[topic].data;
      continue;
    }

    let liveArticles = [];
    if (feeds[topic]) {
      const rssArticles = (
        await Promise.all(feeds[topic].map((url) => fetchRSS(url)))
      ).flat();
      liveArticles = filterAndTrim(rssArticles, topic);
    }

    // If no live, fallback to curated
    if (liveArticles.length === 0) {
      const curated = await fetchCuratedFallbacksFromSheet();
      liveArticles =
        curated[topic]?.slice(0, 3).map((a) => ({
          ...a,
          type: "Curated",
          topic,
        })) || [];
    }

    // Store in cache
    CACHE[topic] = {
      timestamp: now,
      data: liveArticles,
    };

    result[topic] = liveArticles;
  }

  return result;
}

// Force refresh (ignores cache)
export async function refreshHeadlines(topics = []) {
  for (const topic of topics) {
    delete CACHE[topic];
  }
  return getFilteredHeadlines(topics);
}
