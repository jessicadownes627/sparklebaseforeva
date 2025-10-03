// src/utils/fetchDealsFromSheet.js
export async function fetchDealsFromSheet() {
  const url = "https://script.google.com/macros/s/AKfycbxffQ43YPf9sLXcrWV5JjFytSuab3gN2cT005xFZjTtIDfqjBhNm6myfwFSJRXY6gjDHQ/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const data = await response.json();

    // Filter out incomplete rows to keep the card clean
    const filtered = data.filter(
      (item) => item.DealTitle?.trim() && item.Description?.trim()
    );
    return filtered;
  } catch (err) {
    console.error("Error fetching deals from sheet:", err);
    return [];
  }
}
