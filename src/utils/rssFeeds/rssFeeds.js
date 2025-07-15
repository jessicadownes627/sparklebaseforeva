import rssCityMap from "./rssCityMap";
import cityNameAliases from "../../data/cityNameAliases";

// 🧠 STEP 1: Fetch + parse any RSS feed
const getRssFeed = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const items = xmlDoc.getElementsByTagName("item");

    return Array.from(items).map((item) => ({
      title: item.getElementsByTagName("title")[0].textContent,
      link: item.getElementsByTagName("link")[0].textContent,
      description: item.getElementsByTagName("description")[0]?.textContent || "",
      publishedAt: item.getElementsByTagName("pubDate")[0]?.textContent || ""
    }));
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
};

// 🗺️ STEP 2: Normalize city input and match to rssCityMap
export const getTAPintoHeadlines = async (city, state) => {
  const cleanedCity = city?.trim().toLowerCase();
  const normalizedCity = cityNameAliases[cleanedCity] || city;

  const cityKey = `${normalizedCity}, ${state}`;
  const feedUrl = rssCityMap[cityKey]?.feedUrl;

  if (!feedUrl) {
    console.warn("❌ No TAPinto feed found for:", cityKey);
    return [];
  }

  return await getRssFeed(feedUrl);
};
