// utils/fetchHotSheetFromSheet.js
export async function fetchHotSheetFromSheet() {
  const url = "https://script.google.com/macros/s/AKfycbxSc8SO5stnpAnDb1DUZbnbCKOfLshK16PBvrnZ3Btzmf9KvsdIlHeySAJvIJ4mRMzQ/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const data = await response.json();
    return data; // HotSheet news array
  } catch (error) {
    console.error("Error fetching HotSheet news from sheet:", error);
    return [];
  }
}
