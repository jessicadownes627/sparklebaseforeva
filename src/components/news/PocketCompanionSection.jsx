// src/components/news/PocketCompanionSection.jsx
import React, { useEffect, useState } from "react";
import pocketCompanionDeck from "../../data/pocketCompanionDeck";

const PocketCompanionSection = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setCards([
      getRandom(pocketCompanionDeck.confidence),
      getRandom(pocketCompanionDeck.sayThis),
      getRandom(pocketCompanionDeck.finalThought),
    ]);
  }, []);

  return (
    <section className="mt-10 max-w-5xl mx-auto p-6 bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">🌙 Your Pocket Companion</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-black text-white p-4 rounded-xl shadow"
          >
            {card}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PocketCompanionSection;
