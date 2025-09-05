import fetch from "node-fetch";

export async function handler(event) {
  const url = event.queryStringParameters.url;
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing url parameter" }),
    };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: text,
    };
  } catch (error) {
    console.error("rssProxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

