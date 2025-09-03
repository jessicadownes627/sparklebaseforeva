// src/utils/rssFetcher.js
export async function fetchRSSItems(feedUrl) {
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return (data.items || []).map((item) => ({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
      source: item.source_id || data.feed?.title || "RSS",
    }));
  } catch (err) {
    console.error("RSS fetch error:", feedUrl, err);
    return [];
  }
}
