
import React from "react";
import confetti from "canvas-confetti";

const MoodSectionStyled = ({ userName = "You", dateName = "your date", moodDeck = [], onRefresh }) => {
  const handleCelebrateAndReturn = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      onRefresh && onRefresh();
    }, 1000);
  };

  return (
    <div className="mt-12 px-4 py-6 bg-yellow-50 border border-yellow-300 rounded-2xl max-w-xl mx-auto shadow-md">
      <h2 className="text-xl font-semibold text-[#0a2540] mb-2 text-center">
        💖 Before You Go...
      </h2>
      <p className="text-sm text-gray-700 italic mb-4 text-center">
        Just a little boost for {userName} — because even a great date can come with butterflies.
      </p>

      <div className="space-y-4 text-left text-sm text-[#0a2540]">
        {moodDeck.map((item, i) => (
          <div key={i}>
            <p className="font-semibold">
              {item.label === "Confidence Boost" && "🌟 Confidence Boost"}
              {item.label === "Fun Prompt" && "💬 Conversation Spark"}
              {item.label === "Would You Rather" && "🎲 Would You Rather?"}
            </p>
            <p className="ml-2">{item.content.prompt || item.content}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleCelebrateAndReturn}
          className="bg-yellow-400 text-[#0a2540] px-6 py-2 rounded-full font-semibold shadow hover:bg-yellow-500"
        >
          🌟 Have Fun!
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-xs italic text-gray-500">
          {userName}, we truly hope you and {dateName} <strong>Talk More Tonight</strong>.
        </p>
        <p className="text-[10px] text-gray-400 mt-1">© 2025 Talk More Tonight™</p>
      </div>
    </div>
  );
};

export default MoodSectionStyled;