// netlify/functions/newsdata.js
export async function handler(event) {
  try {
    const { q } = event.queryStringParameters || {};
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing NEWS_API_KEY in environment variables");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing NEWS_API_KEY" }),
      };
    }

    if (!q) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing query parameter q" }),
      };
    }

    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(
      q
    )}&language=en`;

    console.log("🌐 Fetching NewsData URL:", url);

    const res = await fetch(url);
    const text = await res.text();

    // Debug raw response
    console.log("📥 Raw NewsData response (truncated):", text.slice(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to parse NewsData JSON:", err.message);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Invalid JSON from NewsData API",
          raw: text.slice(0, 200),
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("❌ NewsData function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
