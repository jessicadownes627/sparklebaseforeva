// src/pages/News.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Components
import TapIntoCard from "../components/TapIntoCard";
import DateNightFunSection from "../components/DateNightFunSection";
import LiveWireSection from "../components/news/LiveWireSection";
import HotSheetSection from "../components/news/HotSheetSection";
import SportsSection from "../components/news/SportsSection";
import ConversationDeckSection from "../components/news/ConversationDeckSection";
import BrighterSideSection from "../components/news/BrighterSideSection";
import PocketCompanionSection from "../components/news/PocketCompanionSection";

// Utils
import { fetchHotSheetFromSheet } from "../utils/fetchHotSheetFromSheet";
import { fetchThingsWeLoveFromSheet } from "../utils/fetchThingsWeLoveFromSheet";
import { fetchBigGamesFromSheet } from "../utils/fetchBigGamesFromSheet";
import getLiveWireHeadlines from "../utils/getLiveWireHeadlines";
import getSubtopicHeadlines from "../utils/getSubtopicHeadlines";
import getTeamsForCity from "../utils/getTeamsForCity";

// Data
import topicEmojiMap from "../data/topicEmojiMap";
import subtopicEmojiMap from "../data/subtopicEmojiMap";

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

  // TAPInto
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

  // LiveWire
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
 // Hot Sheet
useEffect(() => {
  const loadHotSheet = async () => {
    try {
      const normalizedSubs = Array.isArray(subtopicAnswers)
        ? subtopicAnswers
        : Object.values(subtopicAnswers || {});

      const subtopicHeadlines = await getSubtopicHeadlines({
        subtopics: normalizedSubs,
        city,
      });
      const sheetData = await fetchHotSheetFromSheet();
      const merged = {};
      normalizedSubs.forEach((sub) => {
        merged[sub] = [
          ...(subtopicHeadlines[sub] || []),
          ...(sheetData[sub] || []),
        ];
      });
      setHotSheet(merged);
    } catch (err) {
      console.error("❌ Hot Sheet error:", err);
      setHotSheet({});
    }
  };
  loadHotSheet();
}, [subtopicAnswers, city]);


  // Big Games
  useEffect(() => {
    const loadBigGames = async () => {
      try {
        const games = await fetchBigGamesFromSheet();
        setBigGames((games || []).slice(0, 4)); // max 4 events
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

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 text-white bg-gradient-to-br from-black via-[#0f172a] to-[#312e81]">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-script drop-shadow-glow mb-2">
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

      {/* LiveWire Section */}
      <LiveWireSection
        selectedTopics={selectedTopics}
        headlines={headlines}
        topicEmojiMap={topicEmojiMap}
      />

      {/* Hot Sheet Section */}
      <HotSheetSection
        hotSheet={hotSheet}
        expandedHotSheet={expandedHotSheet}
        setExpandedHotSheet={setExpandedHotSheet}
        dateName={dateName}
        subtopicEmojiMap={subtopicEmojiMap}
      />

      {/* 3-Column Grid: Sports / Conversation / Brighter Side */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto my-12">
        <div className="bg-[#0b1b34] rounded-2xl p-6 shadow border border-white/20">
          <SportsSection bigGames={bigGames} />
        </div>
        <div className="bg-[#0b1b34] rounded-2xl p-6 shadow border border-white/20">
          <ConversationDeckSection />
        </div>
        <div className="bg-[#0b1b34] rounded-2xl p-6 shadow border border-white/20">
          <BrighterSideSection brighterSide={brighterSide} />
        </div>
      </section>

      {/* Rapid Fire / Challenges */}
      <DateNightFunSection />

      {/* Pocket Companion */}
      <PocketCompanionSection />

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="font-script text-2xl drop-shadow-glow italic mb-6">
          We truly hope you and {dateName || "your date"} Talk More Tonight ✨
        </p>
        <p className="text-sm text-gray-400 mb-4">
          © 2025 Talk More Tonight™. All rights reserved.
        </p>
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
