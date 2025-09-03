// src/utils/fetchThingsWeLoveFromSheet.js
export async function fetchThingsWeLoveFromSheet() {
  const url = 'https://script.google.com/macros/s/AKfycbzSV_CxcbLIv97dtkQJzjSDQQFPV4cEnGEtkxN8rOY7Z4ERn7F4Axcha2hlTrjF1IlF/exec';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching Things We Love from sheet:', error);
    return [];
  }
}
