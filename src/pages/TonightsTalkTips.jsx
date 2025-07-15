// src/pages/TalkTips.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import promptData from "../data/promptData";
import topicEventSuggestions from "../data/topicEventSuggestions";
import energyThemes from "../data/energyThemes";
import PageHeader from "../components/PageHeader";

const TalkTips = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const {
    selectedTopics = [],
    energy = "Dreamy ✨",
    dateName = "your date",
    userName = "you",
  } = userData;

  const theme = energyThemes[energy] || energyThemes["Dreamy ✨"];
  const [mode, setMode] = useState("quick"); // "quick" or "reader"
  const [revealedTopics, setRevealedTopics] = useState([]);

  const toggleTopic = (topic) => {
    setRevealedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleHeadlinesClick = () => navigate("/news");

  const renderCard = (topic) => {
    const topicData = promptData[topic]?.[energy];
    const topicSuggestions = topicEventSuggestions[topic] || [];
    const suggestion = topicSuggestions[0];

    if (!topicData) {
      return (
        <div key={topic} className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-xl">
          ⚠️ No data found for topic: <strong>{topic}</strong>
        </div>
      );
    }

    const isRevealed = revealedTopics.includes(topic);
    const label =
      mode === "reader"
        ? `📖 Read the Room: ${topic}`
        : `💬 Just the Hits: ${topic}`;

    return (
      <div
        key={topic}
        className="bg-white border border-gray-300 rounded-xl p-4 shadow hover:shadow-md transition-all max-w-md w-full"
      >
        <h3 className="font-semibold text-lg mb-1">{label}</h3>

        {suggestion && (
          <p className="text-sm italic text-purple-700 mb-2">
            💡 Date Idea: {suggestion}
          </p>
        )}

        <p className="italic text-sm mb-2 text-gray-700">
          {mode === "reader"
            ? topicData.readerIntro || topicData.summary || "Here’s what’s trending softly…"
            : topicData.summary}
        </p>

        {mode === "reader" || isRevealed ? (
          <div className="mt-2 space-y-2 text-sm">
            <p>
              🌟 <strong>Fun Fact:</strong> {topicData.fact}
            </p>
            <div>
              <p className="font-semibold text-red-500">❓ What to Ask:</p>
              <ul className="list-disc list-inside text-black">
                {topicData.ask.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-blue-600">📣 If It Clicks:</p>
              <ul className="list-disc list-inside text-black">
                {topicData.open.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <button
            aria-expanded={isRevealed}
            className="text-sm text-indigo-600 underline"
            onClick={() => toggleTopic(topic)}
          >
            Click to reveal ✨
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen px-4 py-6 ${theme.bg} ${theme.text}`}>
      <PageHeader glow={false} />

      <div className="text-center max-w-xl mx-auto mb-4">
        <h2 className="text-xl font-semibold mb-2">Know it. Speak it. Slay it. 🔥</h2>
        <p className="italic text-sm text-center mb-2">
          {mode === "reader"
            ? "More context. More connection. 📖 Read the Room."
            : "Fast takes and flirty facts. 💬 Just the Hits."}
        </p>

        <div className="flex justify-center gap-4 mt-3">
          <button
            onClick={() => setMode("quick")}
            className={`px-4 py-2 rounded-full border text-sm font-semibold shadow ${
              mode === "quick" ? "bg-purple-600 text-white" : "bg-white text-[#0a2540]"
            }`}
          >
            💬 Just the Hits
          </button>
          <button
            onClick={() => setMode("reader")}
            className={`px-4 py-2 rounded-full border text-sm font-semibold shadow ${
              mode === "reader" ? "bg-purple-600 text-white" : "bg-white text-[#0a2540]"
            }`}
          >
            📖 Read the Room
          </button>
        </div>
      </div>

      {selectedTopics.length === 0 ? (
        <p className="text-center text-gray-500">
          No topics selected yet — head to Topics to pick some!
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {selectedTopics.map((topic) => renderCard(topic))}
        </div>
      )}

      <div className="text-center space-x-4 mt-10">
        <Link to="/topics" className="underline text-sm">
          ← Back to Topics
        </Link>
        <button
          onClick={handleHeadlinesClick}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-full shadow"
        >
          → The Headlines
        </button>
      </div>
    </div>
  );
};

export default TalkTips;
