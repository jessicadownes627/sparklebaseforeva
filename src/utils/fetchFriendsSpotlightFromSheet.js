// utils/fetchFriendsSpotlightFromSheet.js

export const fetchFriendsSpotlightFromSheet = async () => {
  const scriptUrl = "https://script.google.com/macros/s/AKfycbyDCBtZOfw0yuYzcCnNJ2HihHF62IqxRUPu92fN0dAFgVIlQQkIS1ATz5O6p_CQCw9fLw/exec";

  try {
    const response = await fetch(scriptUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Apps Script fetch failed:", error);
    return [];
  }
};
