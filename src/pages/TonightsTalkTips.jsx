// src/pages/TalkTips.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import promptData from "../data/promptData";
import topicEventSuggestions from "../data/topicEventSuggestions";
import energyThemes from "../data/energyThemes";
import PageHeader from "../components/PageHeader";

/* Normalize topic keys so "Baseball ⚾" → "Baseball" */
const stripEmoji = (s = "") =>
  String(s)
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDEFF])/g,
      ""
    )
    .trim();

/* Keep one idea per topic for the current browser session */
const SESSION_KEY = "talktips.ideaIndexByTopic.v2"; // bump to v2 to clear stale values
const loadIdeaMap = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
};
const saveIdeaMap = (m) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(m));
  } catch {}
};

const TalkTips = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  const {
    selectedTopics = [],
    energy = "Dreamy ✨",
    dateName = "your date",
    userName = "you",
  } = userData || {};

  const theme = energyThemes[energy] || energyThemes["Dreamy ✨"];

  const [mode, setMode] = useState("quick"); // "quick" or "reader"
  const [revealedTopics, setRevealedTopics] = useState([]);

  // Per-topic chosen idea index (stable for this browser tab/session)
  const [ideaIndexByTopic, setIdeaIndexByTopic] = useState(() => loadIdeaMap());

  // Reseed a NEW random idea per topic each visit (not the same as last time)
  useEffect(() => {
    setIdeaIndexByTopic((prev) => {
      const next = {};

      (selectedTopics || []).forEach((t) => {
        const key = stripEmoji(t); // normalize key
        const ideas =
          topicEventSuggestions[key] || topicEventSuggestions[t] || [];
        if (!ideas.length) return;

        const prevIdx = Number.isInteger(prev[key]) ? prev[key] : -1;
        let newIdx = 0;

        if (ideas.length === 1) {
          newIdx = 0;
        } else {
          // pick random that's NOT the previous index
          do {
            newIdx = Math.floor(Math.random() * ideas.length);
          } while (newIdx === prevIdx);
        }

        next[key] = newIdx; // store by normalized key
      });

      // Persist only currently selected topics for this session/tab
      saveIdeaMap(next);
      return next;
    });
  }, [selectedTopics]);

  const toggleTopic = (topic) => {
    setRevealedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleHeadlinesClick = () => navigate("/news");

  const renderCard = (topic) => {
    const key = stripEmoji(topic);

    // Pick the energy-specific copy with a safe fallback
    const topicDataAny = promptData[topic] || promptData[key] || {};
    const topicData =
      topicDataAny[energy] || Object.values(topicDataAny)[0] || null;

    const topicSuggestions =
      topicEventSuggestions[key] || topicEventSuggestions[topic] || [];
    const stored = ideaIndexByTopic[key] ?? ideaIndexByTopic[topic] ?? 0;
    const chosenIdx = topicSuggestions.length
      ? Math.min(stored, topicSuggestions.length - 1) // clamp for safety
      : 0;
    const suggestion = topicSuggestions[chosenIdx];

    if (!topicData) {
      return (
        <div
          key={topic}
          className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-xl"
        >
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
            ? topicData.readerIntro ||
              topicData.summary ||
              "Here’s what’s trending softly…"
            : topicData.summary}
        </p>

        {mode === "reader" || isRevealed ? (
          <div className="mt-2 space-y-2 text-sm">
            {topicData.fact && (
              <p>
                🌟 <strong>Fun Fact:</strong> {topicData.fact}
              </p>
            )}

            {Array.isArray(topicData.ask) && topicData.ask.length > 0 && (
              <div>
                <p className="font-semibold text-red-500">❓ What to Ask:</p>
                <ul className="list-disc list-inside text-black">
                  {topicData.ask.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(topicData.open) && topicData.open.length > 0 && (
              <div>
                <p className="font-semibold text-blue-600">📣 If It Clicks:</p>
                <ul className="list-disc list-inside text-black">
                  {topicData.open.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
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
