export async function fetchThingsWeLoveFromSheet() {
  const url = 'https://script.google.com/macros/s/AKfycbwYBKkFAVZ7MVtENc6tZfToesQn2iJ-7_RAzeSFtrs3qMhZ8mlGmIVOEOjqM0nS7dvi/exec';
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    const text = await response.json();
    const data = JSON.parse(text.contents);

    return data;
  } catch (error) {
    console.error('Error fetching Things We Love from sheet:', error);
    return [];
  }
}
