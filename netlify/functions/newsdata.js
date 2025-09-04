import fetch from "node-fetch";

export async function handler(event) {
  const { q } = event.queryStringParameters;
  const apiKey = process.env.VITE_NEWSDATA_KEY; // set this in Netlify env vars

  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(
    q
  )}&language=en`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
