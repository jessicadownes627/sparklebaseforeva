// utils/fetchCuratedFallbacksFromSheet.js
export async function fetchCuratedFallbacksFromSheet() {
  const url = "https://script.google.com/macros/s/AKfycbxvSf4U9o7s2bWi-BQaSfSANc-E1OiMuxeqJO1USZOI4OXN-9jnrAb8E0-ws9fwtrhD/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const data = await response.json();

    // Transform into object keyed by topic
    const grouped = {};
    data.forEach((row) => {
      const topic = row.topic?.trim();
      if (!topic) return;

      if (!grouped[topic]) grouped[topic] = [];
      grouped[topic].push({
        title: row.title,
        description: row.description,
        source: row.source,
        publishedAt: row.publishedAt,
      });
    });

    console.log("✅ Curated Fallbacks Loaded:", grouped);
    return grouped;
  } catch (error) {
    console.error("❌ Error fetching Curated Fallbacks from sheet:", error);
    return {};
  }
}
