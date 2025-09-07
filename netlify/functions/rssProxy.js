// netlify/functions/rssProxy.js
export async function handler(event) {
  try {
    const url = event.queryStringParameters.url;
    if (!url) {
      return { statusCode: 400, body: "Missing URL parameter" };
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`RSS fetch error: ${res.status}`);
    }
    const text = await res.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/xml" },
      body: text,
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return {
      statusCode: 500,
      body: `Error: ${err.message}`,
    };
  }
}
