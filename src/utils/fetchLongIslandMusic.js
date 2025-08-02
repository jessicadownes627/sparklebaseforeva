export async function fetchLongIslandMusic() {
  const url = "https://script.google.com/macros/s/AKfycbxJGrCIT6ky7dym6gRcac8RSzuiO-ibm9gr1FWO-cXdVkehYgnplE3VxQxqFu145OM2/exec";
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    console.log("Fetched LI Music Events:", data);  // Add this for debugging
    return data;
  } catch (error) {
    console.error("Error fetching LI Music:", error);
    return [];
  }
}
