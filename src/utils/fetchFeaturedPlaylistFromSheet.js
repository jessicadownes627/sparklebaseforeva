export const fetchFeaturedPlaylistFromScript = async () => {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwqNN2Wbf82pcg5o8YUVCU3ovjDGtfD6cxkkVLZZ3yDTrJQmLkyt8btUTtYKZxqJWZD/exec");
    if (!response.ok) throw new Error("Non-200 response");
    const data = await response.json();
    if (data.error) {
      console.warn("No featured playlist:", data.error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error loading featured playlist:", err);
    return null;
  }
};
