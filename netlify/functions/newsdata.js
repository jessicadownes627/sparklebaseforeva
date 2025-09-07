// netlify/functions/newsdata.js
export async function handler(event) {
  try {
    const API_KEY = process.env.NEWS_DATA_API_KEY;
    const q = event.queryStringParameters.q || "news";

    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${encodeURIComponent(q)}&language=en`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`NewsData API error: ${res.status}`);
    }
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
