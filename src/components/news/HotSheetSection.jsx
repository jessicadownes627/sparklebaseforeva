// src/components/news/HotSheetSection.jsx
import React, { useState } from "react";
import subtopicEmojiMap from "../../data/subtopicEmojiMap";

const HotSheetSection = ({ hotSheet, dateName }) => {
  const [expanded, setExpanded] = useState({});

  if (!hotSheet || Object.keys(hotSheet).length === 0) {
    return (
      <section className="rounded-2xl px-6 py-8 bg-black shadow max-w-5xl mx-auto mb-10">
        <h3 className="text-2xl font-bold mb-6 drop-shadow-glow">🔥 The Hot Sheet</h3>
        <p className="text-gray-400 italic">No Hot Sheet picks tonight.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl px-6 py-8 bg-black shadow max-w-5xl mx-auto mb-10">
      <h3 className="text-2xl font-bold mb-6 drop-shadow-glow">🔥 The Hot Sheet</h3>
      {Object.keys(hotSheet).map((subtopic) => {
        const isOpen = expanded[subtopic] || false;
        const entries = hotSheet[subtopic] || [];

        return (
          <div key={subtopic} className="mb-6">
            {/* Accordion button */}
            <button
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [subtopic]: !prev[subtopic] }))
              }
              className="flex items-center justify-between w-full text-left font-semibold text-white bg-[#1a1a1a] px-4 py-2 rounded-md"
            >
              <span>
                {subtopicEmojiMap[subtopic] || "🔥"} {subtopic}
              </span>
              <span>{isOpen ? "▲" : "▼"}</span>
            </button>

            {/* Entries */}
            {isOpen &&
              entries.map((entry, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a] p-4 rounded-md mb-3 shadow text-sm mt-2"
                >
                  {/* Pill for source */}
                  {entry.sourceType && (
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mb-2 ${
                        ["rss", "api"].includes(entry.sourceType)
                          ? "bg-blue-900/40 text-blue-400"
                          : entry.sourceType === "curated"
                          ? "bg-purple-900/40 text-purple-400"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {["rss", "api"].includes(entry.sourceType)
                        ? "LIVE"
                        : entry.sourceType === "curated"
                        ? "CURATED"
                        : "FALLBACK"}
                    </span>
                  )}

                  {/* Title */}
                  {entry.link ? (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold hover:underline block"
                    >
                      {entry.title || entry.summary}
                    </a>
                  ) : (
                    <p className="font-bold">{entry.summary || entry.title}</p>
                  )}

                  {/* Description or fact */}
                  {entry.description && (
                    <p className="text-gray-300 mt-1">{entry.description}</p>
                  )}
                  {entry.fact && <p className="text-gray-300 mt-1">{entry.fact}</p>}

                  {/* Personalized Ask — always render if available */}
                  {entry.ask && (
                    <p className="italic text-pink-400 mt-2">
                      {entry.ask.replace("[dateName]", dateName || "your date")}
                    </p>
                  )}

                  {/* Source + date */}
                  {(entry.publishedAt || entry.source) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.publishedAt
                        ? new Date(entry.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : ""}{" "}
                      · {entry.source}
                    </p>
                  )}
                </div>
              ))}
          </div>
        );
      })}
    </section>
  );
};

export default HotSheetSection;
