// src/pages/News.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Components
import TapIntoCard from "../components/TapIntoCard";
import DateNightFunSection from "../components/DateNightFunSection";

// Sheets + utils
import { fetchHotSheetFromSheet } from "../utils/fetchHotSheetFromSheet";
import { fetchThingsWeLoveFromSheet } from "../utils/fetchThingsWeLoveFromSheet";
import { fetchBigGamesFromSheet } from "../utils/fetchBigGamesFromSheet";
import { getTAPintoHeadlinesForCity } from "../utils/rssFeeds";
import { getLiveWireHeadlines } from "../utils/getLiveWireHeadlines";
import getTeamsForCity from "../utils/getTeamsForCity";
import { getHotSheetHeadlines } from "../utils/getHotSheetHeadlines";

// Data
import topicEmojiMap from "../data/topicEmojiMap";
import subtopicOptions from "../data/subtopicOptions";
import conversationDeck from "../data/conversationDeck";
import pocketCompanionDeck from "../data/pocketCompanionDeck";

// Sports helpers
const ESPN_SCHEDULES = {
  Baseball: "https://www.espn.com/mlb/schedule",
  Football: "https://www.espn.com/nfl/schedule",
  Basketball: "https://www.espn.com/nba/schedule",
  Hockey: "https://www.espn.com/nhl/schedule",
};

// --- Helpers ---
const cleanDescription = (text) => {
  if (!text) return "";
  return text
    .replace(/<\/?[^>]+(>|$)/g, "") // strip HTML tags
    .replace(/&[#\w]+;/g, "") // strip entities
    .split(/(?<=[.!?])\s+/)[0]; // only first sentence
};

const renderAsk = (ask, dateName) =>
  ask ? ask.replace("[dateName]", dateName || "your date") : "";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const dedupeAndTrim = (articles, max = 3, seenTitles = new Set()) => {
  if (!Array.isArray(articles)) return [];
  const unique = [];
  for (const article of articles) {
    const key = article.title?.toLowerCase().trim();
    if (key && !seenTitles.has(key)) {
      seenTitles.add(key);
      unique.push(article);
    }
  }
  return unique.slice(0, max);
};

const News = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const {
    city,
    selectedTopics = [],
    subtopicAnswers = [],
    includeDateTeams = false,
    dateTeams = [],
    dateName,
  } = userData;

  const [tapintoHeadlines, setTapintoHeadlines] = useState([]);
  const [liveHeadlines, setLiveHeadlines] = useState({});
  const [hotSheet, setHotSheet] = useState({});
  const [bigGames, setBigGames] = useState([]);
  const [brighterSide, setBrighterSide] = useState([]);
  const [conversationCards, setConversationCards] = useState([]);
  const [pocketCards, setPocketCards] = useState([]);
  const seen = new Set();

  // TAPInto
  useEffect(() => {
    const loadTAPinto = async () => {
      if (!city) return;
      try {
        const headlines = await getTAPintoHeadlinesForCity(city);
        setTapintoHeadlines(headlines || []);
      } catch {
        setTapintoHeadlines([]);
      }
    };
    loadTAPinto();
  }, [city]);

  // LiveWire
  useEffect(() => {
    const loadLiveWire = async () => {
      try {
        const localTeams = getTeamsForCity(city) || {};
        const teamsArray = includeDateTeams ? dateTeams : [];
        const headlines = await getLiveWireHeadlines({
          topics: selectedTopics,
          teams: { ...localTeams, extra: teamsArray },
        });
        setLiveHeadlines(headlines || {});
      } catch {
        setLiveHeadlines({});
      }
    };
    loadLiveWire();
  }, [city, selectedTopics, includeDateTeams, dateTeams]);

  // Hot Sheet
  useEffect(() => {
    const loadHotSheet = async () => {
      try {
        const subs = Object.values(subtopicAnswers).flat();
        const headlines = await getHotSheetHeadlines({ subtopics: subs });
        setHotSheet(headlines || {});
      } catch {
        setHotSheet({});
      }
    };
    loadHotSheet();
  }, [subtopicAnswers]);

  // Big Games
  useEffect(() => {
    const loadBigGames = async () => {
      try {
        const games = await fetchBigGamesFromSheet();
        setBigGames(games || []);
      } catch {
        setBigGames([]);
      }
    };
    loadBigGames();
  }, []);

  // Brighter Side
  useEffect(() => {
    const loadBrighterSide = async () => {
      try {
        const stories = await fetchThingsWeLoveFromSheet();
        setBrighterSide(stories || []);
      } catch {
        setBrighterSide([]);
      }
    };
    loadBrighterSide();
  }, []);

  // Conversation Deck
  useEffect(() => {
    const shuffled = [...conversationDeck].sort(() => Math.random() - 0.5);
    setConversationCards(shuffled.slice(0, 3));
  }, []);

  // Pocket Companion
  useEffect(() => {
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setPocketCards([
      getRandom(pocketCompanionDeck.confidence),
      getRandom(pocketCompanionDeck.sayThis),
      getRandom(pocketCompanionDeck.finalThought),
    ]);
  }, []);

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 text-white bg-gradient-to-br from-black via-[#0f172a] to-[#312e81]">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-script text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] mb-2">
          Talk More Tonight
        </h1>
        <p className="text-gray-300 italic">Here’s the news for tonight…</p>
      </header>

      {/* TAPInto Spotlight */}
      {tapintoHeadlines.length > 0 && (
        <section className="relative rounded-2xl px-6 py-8 bg-[#0b1b34] shadow border border-white/20 max-w-5xl mx-auto mb-10">
          <h3 className="text-2xl font-bold mb-4 text-center">🗞️ Top Headlines</h3>
          <TapIntoCard city={city} theme="dark" textColor="text-white" />
        </section>
      )}

      {/* LiveWire */}
      <section className="rounded-2xl px-6 py-8 bg-[#1a2333] shadow max-w-5xl mx-auto mb-10">
        <h3 className="text-2xl font-bold mb-2">📰 Tonight’s Headlines</h3>
        <p className="text-gray-300 mb-6 italic">
          Not every article will be a match — kinda like dating 😉
        </p>
        {selectedTopics.map((topic) => {
          const live = dedupeAndTrim(liveHeadlines[topic], 3, seen);
          if (!live.length) return null;
          return (
            <div key={topic} className="mb-6">
              <h4 className="text-lg font-semibold mb-2">
                {topicEmojiMap[topic]} {topic}
              </h4>
              {live.map((article, i) => (
                <div key={i} className="bg-[#0d1423] p-4 rounded-md mb-3 shadow text-sm">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                        article.sourceType === "rss"
                          ? "bg-green-600/80"
                          : "bg-purple-600/80"
                      }`}
                    >
                      {article.sourceType === "rss" ? "LIVE" : "CURATED"}
                    </span>
                    {article.sourceType === "rss" ? (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold underline hover:text-blue-400"
                      >
                        {article.title}
                      </a>
                    ) : (
                      <span className="font-bold">{article.title}</span>
                    )}
                  </div>
                  {article.description && (
                    <p className="text-gray-300 text-sm mt-1">
                      {cleanDescription(article.description)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(article.publishedAt)} · {article.source}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </section>

      {/* Hot Sheet */}
      <section className="rounded-2xl px-6 py-8 bg-black shadow max-w-5xl mx-auto mb-10">
        <h3 className="text-2xl font-bold mb-6 drop-shadow-glow">🔥 The Hot Sheet</h3>
        {Object.keys(hotSheet).length > 0 ? (
          Object.entries(subtopicOptions).map(([topic, subs]) => {
            const validSubs = subs.filter((sub) => hotSheet[sub]);
            if (!validSubs.length) return null;
            return (
              <div key={topic} className="mb-10">
                <h4 className="text-xl font-bold mb-4">
                  {topicEmojiMap[topic.replace(/ .*/, "")]} {topic}
                </h4>
                {validSubs.map((sub) => (
                  <details key={sub} className="mb-4 bg-[#111827] rounded-lg shadow">
                    <summary className="cursor-pointer px-4 py-3 text-lg font-semibold hover:bg-[#1f2937] flex justify-between">
                      <span>{sub}</span>
                      <span className="text-indigo-400 text-sm">Tap to expand ↓</span>
                    </summary>
                    <div className="px-4 py-3 border-t border-gray-700">
                      {hotSheet[sub][0]?.ask && (
                        <p className="italic font-semibold text-sm text-teal-200">
                          {renderAsk(hotSheet[sub][0].ask, dateName)}
                        </p>
                      )}
                      {hotSheet[sub][0]?.blurb && (
                        <p className="text-gray-300 text-sm mt-2 mb-3">
                          {hotSheet[sub][0].blurb}
                        </p>
                      )}
                      <ul className="list-disc list-inside space-y-1">
                        {dedupeAndTrim(hotSheet[sub], 2, seen).map((entry, i) => (
                          <li key={i} className="text-sm">
                            {entry.sourceType === "rss" && entry.link ? (
                              <a
                                href={entry.link}
                                target="_blank"
                                rel="noreferrer"
                                className="underline hover:text-blue-400"
                              >
                                {entry.title}
                              </a>
                            ) : (
                              <span>{entry.title}</span>
                            )}
                            {entry.description && (
                              <span className="text-gray-400">
                                {" "}— {cleanDescription(entry.description)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 italic">No Hot Sheet picks tonight.</p>
        )}
      </section>

      {/* Sports + Deck + Brighter Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
        {/* Sports */}
        <section className="rounded-2xl px-6 py-6 bg-[#1a1740] shadow">
          <h3 className="text-xl font-bold mb-4">🏟️ Tonight in Sports</h3>
          <ul className="space-y-2 mb-6">
            {Object.keys(ESPN_SCHEDULES).map((s) => (
              <li key={s}>
                <a href={ESPN_SCHEDULES[s]} target="_blank" rel="noreferrer" className="underline hover:text-blue-400">
                  {s} Schedule →
                </a>
              </li>
            ))}
          </ul>
          <h4 className="text-lg font-semibold mb-4">🏆 Big Games Ahead</h4>
          <div className="space-y-3">
            {bigGames.slice(0, 4).map((g, i) => (
              <div key={i} className="bg-[#2a2360] p-4 rounded-lg text-sm">
                {g.sport && <p className="font-semibold text-indigo-200 mb-1">{g.sport}</p>}
                <p className="font-bold">{g.Event || g.title}</p>
                <p className="text-gray-300">{formatDate(g.date)}</p>
                {g.description && <p className="text-gray-400 italic">{g.description}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Conversation Deck */}
        <section className="rounded-2xl px-6 py-6 bg-black shadow">
          <h3 className="text-xl font-bold mb-4">💬 Conversation Deck</h3>
          <div className="space-y-3">
            {conversationCards.map((c, i) => (
              <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg shadow text-sm">
                {c.prompt}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const shuffled = [...conversationDeck].sort(() => Math.random() - 0.5);
              setConversationCards(shuffled.slice(0, 3));
            }}
            className="mt-4 text-blue-400 underline"
          >
            🔄 Shuffle Cards
          </button>
        </section>

        {/* Brighter Side */}
        <section className="rounded-2xl px-6 py-6 bg-[#0d1423] shadow">
          <h3 className="text-xl font-bold mb-4">🌟 The Brighter Side</h3>
          <ul className="space-y-2">
            {brighterSide.map((story, i) => (
              <li key={i}>
                {story.link ? (
                  <a href={story.link} target="_blank" rel="noreferrer" className="underline hover:text-blue-400">
                    {story.title}
                  </a>
                ) : (
                  <span>{story.title}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Date Night Fun */}
      <DateNightFunSection />

      {/* Pocket Companion */}
      <section className="mt-10 max-w-5xl mx-auto p-6 bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">🌙 Your Pocket Companion</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pocketCards.map((card, i) => (
            <div key={i} className="bg-black text-white p-4 rounded-xl shadow">
              {card}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 text-center">
        <p className="font-script text-2xl italic mb-4 text-white drop-shadow-glow">
          We truly hope you and {dateName || "your date"} Talk More Tonight ✨
        </p>
        <p className="text-sm text-gray-400">© 2025 Talk More Tonight™. All rights reserved.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-6 rounded-full shadow hover:scale-105 transition"
        >
          🌟 Back to Home
        </button>
      </footer>
    </div>
  );
};

export default News;

