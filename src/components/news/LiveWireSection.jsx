// src/components/news/LiveWireSection.jsx
import React from "react";
import topicEmojiMap from "../../data/topicEmojiMap";

const LiveWireSection = ({ selectedTopics, headlines }) => {
  if (!selectedTopics?.length) return null;

  return (
    <section className="rounded-2xl px-6 py-8 bg-[#1a2333] shadow max-w-5xl mx-auto mb-10">
      <h3 className="text-2xl font-bold mb-2">📰 Tonight’s Headlines</h3>
      <p className="text-gray-300 mb-6 italic">
        Not every article will be a match — kinda like dating 😉
      </p>

      {selectedTopics.map((topic) => {
        const articles = headlines[topic] || [];

        return (
          <div key={topic} className="mb-6">
            <h4 className="text-lg font-semibold mb-2">
              {topicEmojiMap[topic]} {topic}
            </h4>

            {articles.length === 0 ? (
              <p className="text-gray-400 italic">No news found for this topic.</p>
            ) : (
              articles.slice(0, 3).map((article, i) => (
                <div
                  key={i}
                  className="bg-[#0d1423] p-4 rounded-md mb-3 shadow text-sm"
                >
                  {/* Pill for source */}
                  {article.sourceType && (
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mb-2 ${
                        ["rss", "api"].includes(article.sourceType)
                          ? "bg-blue-900/40 text-blue-400"
                          : article.sourceType === "curated"
                          ? "bg-purple-900/40 text-purple-400"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {["rss", "api"].includes(article.sourceType)
                        ? "LIVE"
                        : article.sourceType === "curated"
                        ? "CURATED"
                        : "FALLBACK"}
                    </span>
                  )}

                  {/* Title */}
                  {article.link ? (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold hover:underline block"
                    >
                      {article.title}
                    </a>
                  ) : (
                    <span className="font-bold text-gray-300 cursor-default block">
                      {article.title}
                    </span>
                  )}

                  {/* Description */}
                  {article.description && (
                    <p className="text-gray-300 mt-1">{article.description}</p>
                  )}

                  {/* Date + Source */}
                  {(article.publishedAt || article.source) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : ""}{" "}
                      · {article.source}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        );
      })}
    </section>
  );
};

export default LiveWireSection;
