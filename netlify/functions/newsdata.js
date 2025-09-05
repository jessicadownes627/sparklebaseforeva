import fetch from "node-fetch";

export async function handler(event) {
  const { q } = event.queryStringParameters || {};
  const apiKey = process.env.NEWSDATA_API_KEY; // ✅ use a clear, simple env var name

  if (!q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing q parameter" }),
    };
  }

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing NEWSDATA_API_KEY environment variable" }),
    };
  }

  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(
    q
  )}&language=en`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // ✅ avoids CORS issues
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("newsdata error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
