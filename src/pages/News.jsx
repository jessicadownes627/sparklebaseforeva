// src/pages/News.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Components
import TapIntoCard from "../components/TapIntoCard";
import DateNightFunSection from "../components/DateNightFunSection";

// Utils
import getLiveWireHeadlines from "../utils/getLiveWireHeadlines";
import { fetchHotSheetFromSheet } from "../utils/fetchHotSheetFromSheet";
import { fetchThingsWeLoveFromSheet } from "../utils/fetchThingsWeLoveFromSheet";
import { fetchBigGamesFromSheet } from "../utils/fetchBigGamesFromSheet";
import getTeamsForCity from "../utils/getTeamsForCity";

// Data
import topicEmojiMap from "../data/topicEmojiMap";
import conversationDeck from "../data/conversationDeck";
import pocketCompanionDeck from "../data/pocketCompanionDeck";

// Sports helpers
import { SPORT_KEYS } from "../utils/sportsHelpers";

const ESPN_SCHEDULES = {
  Baseball: "https://www.espn.com/mlb/schedule",
  Football: "https://www.espn.com/nfl/schedule",
  Basketball: "https://www.espn.com/nba/schedule",
  Hockey: "https://www.espn.com/nhl/schedule",
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

  // State
  const [tapintoHeadlines, setTapintoHeadlines] = useState([]);
  const [headlines, setHeadlines] = useState({});
  const [hotSheet, setHotSheet] = useState({});
  const [expandedHotSheet, setExpandedHotSheet] = useState({});
  const [bigGames, setBigGames] = useState([]);
  const [brighterSide, setBrighterSide] = useState([]);
  const [conversationCards, setConversationCards] = useState([]);
  const [pocketCards, setPocketCards] = useState([]);

  // TAPInto (local news)
  useEffect(() => {
    const loadTAPinto = async () => {
      try {
        if (!city) return;
        const { getTAPintoHeadlinesForCity } = await import("../utils/rssFeeds");
        const headlines = await getTAPintoHeadlinesForCity(city);
        setTapintoHeadlines(headlines || []);
      } catch {
        setTapintoHeadlines([]);
      }
    };
    loadTAPinto();
  }, [city]);

  // LiveWire (RSS → API → Curated → Dummy)
  useEffect(() => {
    const loadHeadlines = async () => {
      try {
        const localTeams = getTeamsForCity(city) || {};
        const teamsArray = includeDateTeams ? dateTeams : [];
        const allHeadlines = await getLiveWireHeadlines({
          topics: selectedTopics,
          teams: { ...localTeams, extra: teamsArray, city },
        });
        setHeadlines(allHeadlines || {});
      } catch (err) {
        console.error("Headline error:", err);
        setHeadlines({});
      }
    };
    loadHeadlines();
  }, [city, selectedTopics, includeDateTeams, dateTeams]);

  // Hot Sheet
  useEffect(() => {
    const loadHotSheet = async () => {
      try {
        const sheetData = await fetchHotSheetFromSheet();
        const filtered = {};
        subtopicAnswers.forEach((sub) => {
          if (sheetData[sub]) filtered[sub] = sheetData[sub];
        });
        setHotSheet(filtered);
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
        <h1 className="text-4xl md:text-5xl font-script neon-yellow-glow mb-2">
          Talk More Tonight
        </h1>
        <p className="text-gray-300 italic">Here’s the news for tonight…</p>
      </header>

      {/* TAPInto */}
      {tapintoHeadlines.length > 0 && (
        <section className="relative rounded-2xl px-6 py-8 bg-[#0b1b34] shadow border border-white/20 max-w-5xl mx-auto mb-10">
          <h3 className="text-2xl font-bold mb-4 text-center">🗞️ Top Headlines</h3>
          <TapIntoCard city={city} theme="dark" textColor="text-white" />
        </section>
      )}

      {/* Live Headlines */}
      <section className="rounded-2xl px-6 py-8 bg-[#1a2333] shadow max-w-5xl mx-auto mb-10">
        <h3 className="text-2xl font-bold mb-2">📰 Tonight’s Headlines</h3>
        <p className="text-gray-300 mb-6 italic">
          Not every article will be a match — kinda like dating 😉
        </p>
        {selectedTopics.map((topic) => {
          const articles = headlines[topic] || [];
          if (articles.length === 0) return null;

          return (
            <div key={topic} className="mb-6">
              <h4 className="text-lg font-semibold mb-2">
                {topicEmojiMap[topic]} {topic}
              </h4>
              {articles.slice(0, 3).map((article, i) => (
                <div key={i} className="bg-[#0d1423] p-4 rounded-md mb-3 shadow text-sm">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                        article.sourceType === "rss"
                          ? "bg-blue-900/40 text-blue-400"
                          : article.sourceType === "api"
                          ? "bg-green-900/40 text-green-400"
                          : article.sourceType === "curated"
                          ? "bg-purple-900/40 text-purple-400"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {article.sourceType?.toUpperCase()}
                    </span>
                    {article.link ? (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold hover:underline"
                      >
                        {article.title}
                      </a>
                    ) : (
                      <span className="font-bold text-gray-300 cursor-default">
                        {article.title}
                      </span>
                    )}
                  </div>
                  {article.description && (
                    <p className="text-gray-300 mt-1">{article.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {article.publishedAt} · {article.source}
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
          Object.keys(hotSheet).map((subtopic) => {
            const expanded = expandedHotSheet[subtopic] || false;
            return (
              <div key={subtopic} className="mb-6">
                <button
                  onClick={() =>
                    setExpandedHotSheet((prev) => ({
                      ...prev,
                      [subtopic]: !prev[subtopic],
                    }))
                  }
                  className="flex items-center justify-between w-full text-left font-semibold text-white bg-[#1a1a1a] px-4 py-2 rounded-md"
                >
                  <span>🔥 {subtopic}</span>
                  <span>{expanded ? "▲" : "▼"}</span>
                </button>
                {expanded &&
                  hotSheet[subtopic].map((entry, i) => (
                    <div
                      key={i}
                      className="bg-[#1a1a1a] p-4 rounded-md mb-3 shadow text-sm mt-2"
                    >
                      <p className="font-bold">{entry.summary}</p>
                      <p className="text-gray-300">{entry.fact}</p>
                      <p className="italic text-gray-400">{entry.ask}</p>
                    </div>
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
          <h3 className="text-xl font-bold text-yellow-300 mb-4 drop-shadow">
            🏟️ Tonight in Sports
          </h3>
          <ul className="space-y-2 mb-6">
            {SPORT_KEYS.map((sport) => (
              <li key={sport}>
                <a
                  href={ESPN_SCHEDULES[sport]}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {sport} Schedule →
                </a>
              </li>
            ))}
          </ul>
          <h4 className="text-lg font-semibold mb-4">🏆 Big Games Ahead</h4>
          <div className="space-y-3">
            {bigGames.map((game, i) => (
              <div key={i} className="bg-[#2a2360] p-4 rounded-lg shadow text-sm">
                <p className="font-bold">{game.Event}</p>
                <p className="text-gray-300">{game["Date(s)"]}</p>
                <p className="text-gray-400 italic">{game.Sport}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conversation Deck */}
        <section className="rounded-2xl px-6 py-6 bg-black shadow">
          <h3 className="text-xl font-bold mb-4">💬 Conversation Deck</h3>
          <div className="space-y-3">
            {conversationCards.map((card, i) => (
              <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg shadow text-sm">
                {card.prompt}
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
                <a href={story.url} target="_blank" rel="noreferrer" className="underline">
                  {story.title}
                </a>
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
        <p className="font-script text-2xl drop-shadow-glow italic mb-4">
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


