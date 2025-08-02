// utils/fetchCuratedFallbacksFromSheet.js
export async function fetchCuratedFallbacksFromSheet() {
  const url = "https://script.google.com/macros/s/AKfycbxvSf4U9o7s2bWi-BQaSfSANc-E1OiMuxeqJO1USZOI4OXN-9jnrAb8E0-ws9fwtrhD/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Curated Fallbacks from sheet:", error);
    return [];
  }
}
