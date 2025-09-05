// src/components/news/ConversationDeckSection.jsx
import React, { useState } from "react";
import conversationDeck from "../../data/conversationDeck";

const ConversationDeckSection = () => {
  const [cards, setCards] = useState(
    [...conversationDeck].sort(() => Math.random() - 0.5).slice(0, 3)
  );

  return (
    <section className="rounded-2xl px-6 py-6 bg-black shadow">
      <h3 className="text-xl font-bold mb-4">💬 Conversation Deck</h3>
      <div className="space-y-3">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg shadow text-sm">
            {card.prompt}
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          setCards([...conversationDeck].sort(() => Math.random() - 0.5).slice(0, 3))
        }
        className="mt-4 text-blue-400 underline"
      >
        🔄 Shuffle Cards
      </button>
    </section>
  );
};

export default ConversationDeckSection;

