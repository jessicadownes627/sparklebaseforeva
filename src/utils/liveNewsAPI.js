// src/utils/liveNewsAPI.js

const API_KEY = import.meta.env.VITE_BING_NEWS_API_KEY;
const ENDPOINT = import.meta.env.VITE_BING_NEWS_ENDPOINT || "https://api.bing.microsoft.com/v7.0/news/search";

export const fetchLiveNews = async ({ topics = [], subtopics = {}, city = "", state = "" }) => {
  try {
    const keywords = topics.flatMap(topic => [topic, ...(subtopics[topic] || [])]);
    const query = [...keywords, city, state].filter(Boolean).join(" OR ");

    const url = `${ENDPOINT}?q=${encodeURIComponent(query)}&mkt=en-US&count=10&originalImg=true&sortBy=Date`;

    const res = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY
      }
    });

    const data = await res.json();
    if (!data.value) return [];

    return data.value.map(article => ({
      title: article.name,
      description: article.description,
      url: article.url,
      publishedAt: article.datePublished,
      language: "en"
    }));
  } catch (err) {
    console.error("🔥 Bing News fetch failed:", err);
    return [];
  }
};
