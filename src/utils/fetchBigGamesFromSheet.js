// src/utils/fetchBigGamesFromSheet.js
export async function fetchBigGamesFromSheet() {
  const url =
    "https://script.google.com/macros/s/AKfycbxl4cLRgRFS4u9ZsnJ90GicAa3jqhQ413LpSz3AjvVKhfPBbHIX6L9n7XRuhBZXhNfXQw/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const data = await response.json();

    const now = new Date();

    // Filter: only future events, with valid fields
    const filteredData = data.filter((item) => {
      const sport = item.Sport?.trim();
      const event = item.Event?.trim();
      const dateStr = item["Date(s)"]?.trim();

      if (!sport || !event || !dateStr) return false;

      const eventDate = new Date(dateStr);
      if (isNaN(eventDate.getTime())) return false;

      return eventDate >= now;
    });

    // ✅ Limit to 4 items max
    return filteredData.slice(0, 4);
  } catch (error) {
    console.error("Error fetching Big Games from sheet:", error);
    return [];
  }
}
