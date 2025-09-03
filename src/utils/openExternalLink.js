// utils/openExternalLink.js
import * as WebBrowser from "expo-web-browser";

export async function openExternalLink(url) {
  try {
    if (!url) return;
    await WebBrowser.openBrowserAsync(url, {
      // optional styling options
      enableBarCollapsing: true,
      showTitle: true,
      toolbarColor: "#0a2540", // your dark blue
      controlsColor: "#ffffff",
    });
  } catch (err) {
    console.error("Failed to open link:", err);
  }
}
