// src/utils/rssFeeds/rssParser.js

// ✅ This is a browser-safe RSS/Atom feed parser
// No external libraries required — works with TAPinto feeds in the browser

export const parseFeed = async (feedUrl) => {
  try {
    const response = await fetch(feedUrl);
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const items = [...xmlDoc.querySelectorAll("entry, item")].slice(0, 5);
    return items.map((item) => {
      const linkTag = item.querySelector("link");
      const url = linkTag?.getAttribute("href") || linkTag?.textContent || "";

      return {
        title: item.querySelector("title")?.textContent || "No title",
        description: item.querySelector("summary, description")?.textContent || "No description",
        url,
        publishedAt: item.querySelector("updated, pubDate")?.textContent || "",
      };
    });
  } catch (error) {
    console.error("Browser-safe RSS parsing failed:", error);
    return [];
  }
};