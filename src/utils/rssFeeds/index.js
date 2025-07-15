import rssCityMap from "./rssCityMap";
import { parseFeed } from "./rssParser"; // assuming you have this for parsing Atom feeds

export const getTAPintoHeadlinesForCity = async (city) => {
  if (!city) return [];

  const match = Object.entries(rssCityMap).find(([key]) =>
    key.toLowerCase().includes(city.toLowerCase())
  );

  if (!match) return [];

  const { feedUrl } = match[1];
  return await parseFeed(feedUrl); // or however you're parsing your RSS feeds
};
