import rssTopicFeeds from "../data/rssTopicFeeds";

/**
 * Fetch and parse RSS feed into article objects
 * Uses Netlify proxy to bypass CORS.
 */
async function fetchRSSFeed(url, topic) {
  try {
    const proxyUrl = `/.netlify/functions/rssProxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
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
      topic,
      sourceType: "rss",
    }));

    return items;
  } catch (err) {
    console.error(`[RSS Error] ${url}:`, err);
    return [];
  }
}

/**
 * Helper: filter junk (ads, obits, weird blurbs)
 */
function filterArticles(articles, city, teams) {
  const badWords = ["obituary", "apply for", "fellowship", "sale", "discount"];
  const lowerCity = city?.toLowerCase() || "";

  return articles.filter((a) => {
    const text = `${a.title} ${a.description}`.toLowerCase();

    // Skip junk
    if (badWords.some((w) => text.includes(w))) return false;

    // Skip foreign stuff
    if (/[а-яА-Я]/.test(text) || /【.+】/.test(text)) return false;

    // Boost location or teams
    if (lowerCity && text.includes(lowerCity)) return true;
    if (teams?.some((t) => text.includes(t.toLowerCase()))) return true;

    return true; // fallback: keep
  });
}

/**
 * Main function: get headlines per topic
 */
export default async function getLiveWireHeadlines({
  topics = [],
  teams = {},
  maxPerTopic = 3,
}) {
  const results = {};

  for (const topic of topics) {
    const feeds = rssTopicFeeds[topic] || [];
    let articles = [];

    for (const url of feeds) {
      const feedItems = await fetchRSSFeed(url, topic);
      articles = articles.concat(feedItems);
    }

    // Filter + shuffle
    let filtered = filterArticles(articles, teams.city, teams.extra || []);
    filtered = filtered.sort(() => 0.5 - Math.random());

    // Limit per topic
    results[topic] = filtered.slice(0, maxPerTopic);
  }

  return results;
}
