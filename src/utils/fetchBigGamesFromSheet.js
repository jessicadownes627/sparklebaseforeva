export async function fetchBigGamesFromSheet() {
  const url = "https://script.google.com/macros/s/AKfycbxl4cLRgRFS4u9ZsnJ90GicAa3jqhQ413LpSz3AjvVKhfPBbHIX6L9n7XRuhBZXhNfXQw/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const data = await response.json();

    // Filter out rows missing essential fields
    const filteredData = data.filter(
      (item) =>
        item.Sport?.trim() &&
        item.Event?.trim() &&
        item["Date(s)"]?.trim()
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching Big Games from sheet:", error);
    return [];
  }
}
