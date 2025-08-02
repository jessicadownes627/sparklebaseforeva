import Papa from "papaparse";

export async function fetchKeywordMapFromSheet() {
  const sheetUrl = "https://script.google.com/macros/s/AKfycbyPcYmCl8DCGxWx1GPPWyiArQILldiWR8NDyymEJlUH9PX89LV8dJL5PRyygsXufKnb5w/exec";
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(sheetUrl)}`;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    const json = await response.json();
    const csvText = json.contents;

    const parsed = Papa.parse(csvText.trim(), {
      header: true,
      skipEmptyLines: true,
    });

    const keywordMap = {};
    parsed.data.forEach((row) => {
      const topic = row.Topic?.trim();
      if (!topic) return;
      const keywordsRaw = row.Keywords || "";
      const keywords = keywordsRaw
        .split(",")
        .map((kw) => kw.trim())
        .filter(Boolean);

      if (!keywords.includes(topic)) {
        keywords.unshift(topic);
      }

      keywordMap[topic] = keywords;
    });

    return keywordMap;
  } catch (error) {
    console.error("Error fetching keyword map from sheet:", error);
    return {};
  }
}
