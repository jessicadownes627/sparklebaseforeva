// utils/fetchHotSheetFromSheet.js
export async function fetchHotSheetFromSheet() {
  const url =
    "https://script.google.com/macros/s/AKfycbxSc8SO5stnpAnDb1DUZbnbCKOfLshK16PBvrnZ3Btzmf9KvsdIlHeySAJvIJ4mRMzQ/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const data = await response.json();

    // Expect rows like: { topic, subtopic, blurb, ask }
    return data.map((row) => ({
      topic: row.topic,
      subtopic: row.subtopic,
      blurb: row.blurb,
      ask: row.ask,
    }));
  } catch (error) {
    console.error("❌ Error fetching Hot Sheet:", error);
    return [];
  }
}
