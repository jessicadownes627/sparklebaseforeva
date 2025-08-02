import Papa from "papaparse";
import { stripEmojis } from "./stripEmojis";

const KEYWORD_MAP_SHEET =
  "https://api.allorigins.hexaco.tech/raw?url=" +
  encodeURIComponent(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRAQpb396HIKf3qWbaUdq7h9RtV56aco-XM4fgRoy243h4zmUdAzOsoDOR1lBbyRyP41KSgy3Ew_tSm/pub?output=csv"
  );

const API_KEY = "pub_1ffd2315a26e431486ed7adce6a4d99a";

export async function getLiveWireHeadlinesFromNewsData(selectedTopics = []) {
  try {
    const res = await fetch(KEYWORD_MAP_SHEET);
    const csv = await res.text();
    const { data } = Papa.parse(csv, { header: true });

    const fetches = selectedTopics.map(async (topic) => {
      const match = data.find(
        (row) =>
          stripEmojis(row.topic?.trim()?.toLowerCase()) ===
          stripEmojis(topic?.toLowerCase())
      );
      const keywords = match?.keywords?.split(",") || [];
      if (keywords.length === 0) return null;

      const query = encodeURIComponent(keywords.join(" OR "));
      const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${query}&language=en&country=us`;

      try {
        const newsRes = await fetch(url);
        const newsData = await newsRes.json();
        if (newsData.results) {
          return {
            topic,
            results: newsData.results.map((item) => ({
              title: item.title,
              description: item.description,
              link: item.link,
              publishedAt: item.pubDate,
              source: item.source_id,
            })),
          };
        }
      } catch {
        return null;
      }
      return null;
    });

    const resultsArray = await Promise.all(fetches);

    const groupedHeadlines = {};
    resultsArray.forEach((res) => {
      if (res) groupedHeadlines[res.topic] = res.results;
    });

    return groupedHeadlines;
  } catch (err) {
    console.error("❌ LiveWire fetch error:", err);
    return {};
  }
}
