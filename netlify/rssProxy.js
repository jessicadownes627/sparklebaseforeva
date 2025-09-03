import fetch from "node-fetch";

export async function handler(event) {
  const url = event.queryStringParameters.url;
  if (!url) {
    return { statusCode: 400, body: "Missing url" };
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*"
      },
      body: text
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
