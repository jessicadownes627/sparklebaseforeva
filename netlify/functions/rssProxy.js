// netlify/functions/rssProxy.js
export async function handler(event) {
  try {
    const { url } = event.queryStringParameters || {};
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing RSS feed URL" }),
      };
    }

    console.log("🌐 Fetching RSS feed:", url);

    const res = await fetch(url);
    const text = await res.text();

    // Debug first part of RSS
    console.log("📥 Raw RSS response (truncated):", text.slice(0, 200));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/xml" },
      body: text,
    };
  } catch (err) {
    console.error("❌ RSS Proxy function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
