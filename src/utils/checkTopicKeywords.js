// src/utils/checkTopicKeywords.js

import newsKeywordMap from "../data/newsKeywordMap";

// This should match your topic labels from Topics.jsx
const topicLabels = [
  "Politics 🗳️",
  "Talk of the Country 🇺🇸",
  "Tech & Gadgets 💻",
  "Business & Money 💼",
  "Legal Drama ⚖️",
  "Podcasts 🎧", 
  "True Crime 🔪",
  "Environment & Climate 🌍",
  "AI & Future Tech 🤖",
  "Travel ✈️",
  "Food & Restaurants 🍝",
  "Health & Fitness 🧘",
  "Fashion 👗",
  "Shopping 🛍️",
  "Book Buzz 📚",
  "Art & Museums 🖼️",
  "Dating & Relationships ❤️",
  "Viral & Memes 📱",
  "Music 🎵",
  "Film 🎬",
  "TV Shows 📺",
  "Streaming & Reality 💅",
  "Celebrity News 🌟",
  "Award Shows & Red Carpets 🎭",
  "Gaming 🎮",
  "Indie Films 🎬",
  "Football 🏈",
  "Basketball 🏀",
  "Baseball ⚾",
  "Hockey 🏒",
  "Golf ⛳",
  "College Sports 🎓",
  "Olympics 🏅",
  "Sports Betting 🎲",
  "Concert Tours 🎤",
  "Festivals 🎪",
  "Trending Events 🎉",
  "Holiday Happenings 🎁",
  "Major Weather Events ⛈️",
  "Space & UFOs 🛸",
  "Wildcard 🃏"
];

// Run the check
export function validateNewsKeywordMap() {
  const missing = [];

  topicLabels.forEach((label) => {
    if (!newsKeywordMap.hasOwnProperty(label)) {
      missing.push(label);
    }
  });

  if (missing.length === 0) {
    console.log("✅ All topics are present in newsKeywordMap.js!");
  } else {
    console.warn("🚨 Missing topics in newsKeywordMap.js:", missing);
  }
}
