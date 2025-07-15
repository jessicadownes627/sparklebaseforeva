import axios from "axios";
import curatedFallbacks from "../data/curatedFallbacks";

const BING_API_KEY = import.meta.env.VITE_BING_NEWS_API_KEY;
const BING_ENDPOINT = import.meta.env.VITE_BING_NEWS_ENDPOINT;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const isWithinHours = (publishedAt, maxHours = 48) => {
  const now = new Date();
  const pubDate = new Date(publishedAt);
  return (now - pubDate) / (1000 * 60 * 60) <= maxHours;
};

const dedupeArticles = (articles = []) => {
  const seen = new Set();
  return articles.filter(({ title }) => {
    const t = title?.trim().toLowerCase();
    if (!t || seen.has(t)) return false;
    seen.add(t);
    return true;
  });
};

const titleOrDescriptionMatches = (article, keywords) => {
  const text = `${article.title} ${article.description}`.toLowerCase();
  return keywords.some(k => text.includes(k.toLowerCase()));
};

const isUSBased = (article) => {
  const { url = "", title = "", description = "" } = article;
  const foreign = [".uk", ".de", ".fr", ".au", ".ca", ".nz", "germany", "africa"];
  const text = `${url} ${title} ${description}`.toLowerCase();
  return !foreign.some(f => text.includes(f));
};

const isCleanSports = (title = "") => {
  const bad = ["how to watch", "live stream", "betting", "odds"];
  return !bad.some(b => title.toLowerCase().includes(b));
};

export const getNewsArticles = async (keywords = [], topic = "", profession = "") => {
  const professionBoosts = {
    teacher: ["education", "school", "students"],
    nurse: ["healthcare", "hospital", "nurse"],
    tech: ["AI", "technology", "startups"],
    musician: ["concert", "music", "album"],
    chef: ["restaurant", "cooking", "dining"]
  };

  const fallbackKeywords = ["Trump", "Knicks", "Karen Read", "NBA Finals"];
  const boost = professionBoosts[profession?.toLowerCase()] || [];
  const queryTerms = [...keywords, ...boost].filter(Boolean);
  const query = queryTerms.length ? queryTerms.join(" OR ") : fallbackKeywords.join(" OR ");

  console.log("🔍 Query for topic:", topic);
  console.log("👉 Keywords used:", queryTerms);

  let results = [];

  try {
    const { data } = await axios.get(BING_ENDPOINT, {
      headers: { "Ocp-Apim-Subscription-Key": BING_API_KEY },
      params: {
        q: query,
        mkt: "en-US",
        freshness: "Day",
        sortBy: "Date",
        count: 15
      }
    });

    console.log(`✅ Bing returned ${data?.value?.length || 0} articles`);

    results = (data.value || []).map(article => ({
      title: article.name,
      description: article.description,
      url: article.url,
      publishedAt: article.datePublished
    }));
  } catch (err) {
    console.error("❌ Bing API failed:", err.message);
  }

  if (results.length === 0) {
    try {
      const { data } = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: query,
          language: "en",
          sortBy: "publishedAt",
          pageSize: 12,
          apiKey: NEWS_API_KEY
        }
      });

      console.log(`📰 NewsAPI returned ${data?.articles?.length || 0} articles`);

      results = (data.articles || []).map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt
      }));
    } catch (err) {
      console.error("❌ NewsAPI fallback failed:", err.message);
    }
  }

  const isSports = ["Baseball", "Football", "Basketball", "Hockey"].some(s => topic.includes(s));
  const maxHours = isSports ? 24 : 36;

  const filtered = dedupeArticles(results).filter(article => {
    const passes =
      article.title &&
      isWithinHours(article.publishedAt, maxHours) &&
      isUSBased(article) &&
      (!isSports || isCleanSports(article.title)) &&
      titleOrDescriptionMatches(article, keywords.length ? keywords : fallbackKeywords);

    if (!passes) {
      console.log("⚠️ Skipped:", article.title);
    }

    return passes;
  });

  if (filtered.length === 0 && curatedFallbacks[topic]) {
    console.log("🔄 Using curated fallback for topic:", topic);
    return curatedFallbacks[topic];
  }

  return filtered;
};

export const fetchNewsArticles = getNewsArticles;
