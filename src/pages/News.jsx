// ✅ CLEAN + FINAL News.jsx — polished & resilient
// ✅ Live (NewsData) + Google News RSS top-off + Google Sheets fallbacks

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import TapIntoCard from "../components/TapIntoCard";
import confetti from "canvas-confetti";

// Sheets + utils
import { fetchHotSheetFromSheet } from "../utils/fetchHotSheetFromSheet";
import { fetchThingsWeLoveFromSheet } from "../utils/fetchThingsWeLoveFromSheet";
import { fetchBigGamesFromSheet } from "../utils/fetchBigGamesFromSheet";
import { getTAPintoHeadlinesForCity } from "../utils/rssFeeds";

import { fetchKeywordMapFromSheet } from "../utils/fetchKeywordMapFromSheet";
import { fetchCuratedFallbacksFromSheet } from "../utils/fetchCuratedFallbacksFromSheet";
import { getLiveWireHeadlinesFromNewsData } from "../utils/getLiveWireHeadlinesFromNewsData";
import { rerankWithLocation } from "../utils/localBoost"; // ← already imported
import fetchGoogleNewsByTopics from "../utils/fetchGoogleNewsRSS"; // 👈 RSS util

import conversationDeck from "../data/conversationDeck";
import topicEmojiMap from "../data/topicEmojiMap";
import pocketCompanionDeck from "../data/pocketCompanionDeck";
import cityTeamMap from "../data/cityTeamMap";
import thingsWeLoveFallback from "../data/thingsWeLoveFallback";
import bigGamesFallback from "../data/bigGamesFallback";
import DateNightFunSection from "../components/DateNightFunSection";
import curatedFallbacksLocal from "../data/curatedFallbacks";

// ---- helpers
function getSportEmoji(sport) {
  if (!sport) return "🏅";
  const foundKey = Object.keys(topicEmojiMap).find((key) =>
    key.toLowerCase().startsWith(String(sport).toLowerCase())
  );
  return foundKey ? topicEmojiMap[foundKey] : "🏅";
}
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sportsSchedules = [
  { league: "Baseball", link: "https://www.espn.com/mlb/schedule" },
  { league: "Football", link: "https://www.espn.com/nfl/schedule" },
  { league: "Basketball", link: "https://www.espn.com/nba/schedule" },
  { league: "Hockey", link: "https://www.espn.com/nhl/schedule" },
];

// Strip emoji so keys match what live returns
const stripEmoji = (s = "") =>
  s
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDEFF])/g,
      ""
    )
    .trim();

// Remove HTML that sneaks into RSS descriptions
const stripHtml = (s = "") =>
  String(s).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

// NEW: short, safe snippet for quick mismatch detection (~110 chars)
const snippet = (s = "", max = 110) => {
  const clean = stripHtml(s);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + "…";
};

// Pretty label (with emoji) for a normalized key
const displayTopicLabel = (key, selectedTopics = []) =>
  selectedTopics.find((t) => stripEmoji(t) === key) || key;

// Tiny localStorage cache (speeds up Sheets)
const getCache = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const setCache = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

// Safe splitter for sheet bullets
const safeSplit = (val) =>
  Array.isArray(val) ? val : val?.split ? val.split(/[,•\n]/) : [];

// ---- Google Apps Script endpoints
const KEYWORD_SHEET =
  "https://script.google.com/macros/s/AKfycbyPcYmCl8DCGxWx1GPPWyiArQILldiWR8NDyymEJlUH9PX89LV8dJL5PRyygsXufKnb5w/exec";
const FALLBACK_SHEET =
  "https://script.google.com/macros/s/AKfycbxvSf4U9o7s2bWi-BQaSfSANc-E1OiMuxeqJO1USZOI4OXN-9jnrAb8E0-ws9fwtrhD/exec";

const News = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  const [tapintoHeadlines, setTapintoHeadlines] = useState([]);
  const [liveWireHeadlines, setLiveWireHeadlines] = useState({}); // { topic: [articles] }
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [hotSheet, setHotSheet] = useState(() => getCache("hotSheet", []));
  const [filteredHotSheet, setFilteredHotSheet] = useState({});
  const [thingsWeLove, setThingsWeLove] = useState(() => getCache("thingsWeLove", []));
  const [bigGames, setBigGames] = useState(() => getCache("bigGames", []));
  const [shuffledConvoCards, setShuffledConvoCards] = useState(() =>
    [...conversationDeck].sort(() => 0.5 - Math.random()).slice(0, 3)
  );
  const [isFading, setIsFading] = useState(false);

  const {
    userName = "You",
    dateName = "your date",
    city = "",
    selectedTopics = [],
    subtopicAnswers = {},
  } = userData || {};

  // Normalize subtopic answers once (handles emoji in sheet & choices)
  const normalizedSubtopicAnswers = useMemo(() => {
    const out = {};
    Object.entries(subtopicAnswers || {}).forEach(([topicWithEmoji, arr]) => {
      out[stripEmoji(topicWithEmoji)] = (arr || []).map((s) => stripEmoji(s));
    });
    return out;
  }, [subtopicAnswers]);

  // ---- TAPinto (local news)
  useEffect(() => {
    if (!city) return;
    getTAPintoHeadlinesForCity(city)
      .then((data) => setTapintoHeadlines(Array.isArray(data) ? data : []))
      .catch((error) => console.error("❌ TAPinto error:", error));
  }, [city]);

  const cityTeams = city ? cityTeamMap[city.toLowerCase()] : null;

  const companion = useMemo(
    () => ({
      confidence: getRandom(pocketCompanionDeck.confidence),
      sayThis: getRandom(pocketCompanionDeck.sayThis),
      finalThought: getRandom(pocketCompanionDeck.finalThought),
    }),
    []
  );

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const reshuffleCards = () => {
    setIsFading(true);
    setTimeout(() => {
      setShuffledConvoCards(
        [...conversationDeck].sort(() => 0.5 - Math.random()).slice(0, 3)
      );
      setIsFading(false);
    }, 300);
  };

  // ---- Live headlines with top-off + curated fallback
  const fetchLive = async () => {
    try {
      const apiKey =
        import.meta.env?.VITE_NEWSDATA_API_KEY ||
        process.env?.VITE_NEWSDATA_API_KEY;

      // 1) keywords + bad words (Apps Script)
      const { keywordMap, badWordsByTopic } = await fetchKeywordMapFromSheet(
        KEYWORD_SHEET
      );

      // Normalize keys to emoji-free so they match selectedTopics and RSS/NewsData
      const normKeywordMap = {};
      Object.entries(keywordMap || {}).forEach(([k, v]) => {
        normKeywordMap[stripEmoji(k)] = Array.isArray(v) ? v : [];
      });
      const normBadWords = {};
      Object.entries(badWordsByTopic || {}).forEach(([k, v]) => {
        normBadWords[stripEmoji(k)] = Array.isArray(v) ? v : [];
      });

      const baseTopics = (selectedTopics || []).map((t) => stripEmoji(t));

      // Breadcrumb logs for sanity checks
      console.log("🔑 apiKey present:", !!apiKey);
      console.log("🎯 selected topics:", selectedTopics);
      console.log("🎯 baseTopics (stripped):", baseTopics);

      // ✳️ Cap to 2 per topic
      const desiredPerTopic = 2;
      let groupedLive = {};

      // 2) NewsData live
      if (apiKey) {
        const liveArr = await getLiveWireHeadlinesFromNewsData(
          { topics: selectedTopics, keywordMap: normKeywordMap, badWordsByTopic: normBadWords },
          { apiKey, maxPerTopic: desiredPerTopic, pagesPerTopic: 1 }
        );
        groupedLive = (liveArr || []).reduce((acc, a) => {
          (acc[a.topic] ||= []).push({ ...a, isFallback: false });
          return acc;
        }, {});
        console.log("🟢 NewsData LIVE:", groupedLive);
      }

      // 3) Google News RSS top-off (also primary if no API key)
      const needsRss = baseTopics.filter(
        (t) => (groupedLive[t]?.length || 0) < desiredPerTopic
      );
      let groupedRss = {};
      if (needsRss.length) {
        groupedRss = await fetchGoogleNewsByTopics(needsRss, {
          limitPerTopic: desiredPerTopic,
          keywordMap: normKeywordMap,
        });
        console.log("🛰️ Google News RSS:", groupedRss);
      }

      // 4) Merge per topic (live first, then RSS) up to desiredPerTopic
      const merged = {};
      const allTopics = new Set([
        ...baseTopics,
        ...Object.keys(groupedLive),
        ...Object.keys(groupedRss),
      ]);
      for (const t of allTopics) {
        const live = (groupedLive[t] || []).slice(0, desiredPerTopic);
        const needAfterLive = Math.max(0, desiredPerTopic - live.length);
        const rss = (groupedRss[t] || []).slice(0, needAfterLive);
        if (live.length || rss.length) merged[t] = [...live, ...rss];
      }

      // 5) Curated fallback ONLY for topics still short
      const topicsNeedingCurated = Array.from(allTopics).filter(
        (t) => (merged[t]?.length || 0) < desiredPerTopic
      );

      if (topicsNeedingCurated.length) {
        const curatedArr =
          (await fetchCuratedFallbacksFromSheet(FALLBACK_SHEET, {
            topicsFilter: topicsNeedingCurated,
            limitPerTopic: desiredPerTopic,
          }).catch(() => curatedFallbacksLocal)) || [];

        const groupedCurated = curatedArr.reduce((acc, a) => {
          const key = stripEmoji(a.topic);
          (acc[key] ||= []).push({ ...a, isFallback: true });
          return acc;
        }, {});

        for (const t of topicsNeedingCurated) {
          const have = merged[t] || [];
          const need = Math.max(0, desiredPerTopic - have.length);
          const adds = (groupedCurated[t] || []).slice(0, need);
          if (adds.length) merged[t] = [...have, ...adds];
        }
        console.log("🟡 Curated top-off:", topicsNeedingCurated);
      }

      // ⭐ Local re-rank per topic (non-destructive, zero-risk)
      if (city) {
        Object.keys(merged).forEach((t) => {
          merged[t] = rerankWithLocation(merged[t] || [], city);
        });
      }

      // Breadcrumb counts
      Object.entries(merged).forEach(([t, arr]) =>
        console.log(`📰 ${t}: ${arr.length} items (live>rss>curated, loc-sorted)`)
      );

      setLiveWireHeadlines(merged);
    } catch (e) {
      console.error("LiveWire error → fallbacks:", e);
      // Hard fallback (all curated) if something really breaks
      const fbArr =
        (await fetchCuratedFallbacksFromSheet(FALLBACK_SHEET, {
          topicsFilter: selectedTopics,
          limitPerTopic: 2,
        }).catch(() => curatedFallbacksLocal)) || [];
      const groupedFb = fbArr.reduce((acc, a) => {
        (acc[stripEmoji(a.topic)] ||= []).push({ ...a, isFallback: true });
        return acc;
      }, {});

      // ⭐ Local re-rank in fallback too
      if (city) {
        Object.keys(groupedFb).forEach((t) => {
          groupedFb[t] = rerankWithLocation(groupedFb[t] || [], city);
        });
      }

      setLiveWireHeadlines(groupedFb);
    }
  };

  // ---- Sheets + Live load
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hot, love, games] = await Promise.all([
          fetchHotSheetFromSheet(
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFcfO2X43yTcfzsAS5WY80lwEXfC5zNQDiPAS1We9jNSPXgiqFMs7CfoQOTv1C0RFn-dxU5NrkpuyY/pub?output=csv"
          ),
          fetchThingsWeLoveFromSheet().catch(() => thingsWeLoveFallback),
          fetchBigGamesFromSheet().catch(() => bigGamesFallback),
        ]);

        const hotArr = Array.isArray(hot) ? hot : [];
        const loveArr = Array.isArray(love) ? love : [];
        const gamesArr = Array.isArray(games) ? games : [];

        setHotSheet(hotArr);
        setCache("hotSheet", hotArr);
        setThingsWeLove(loveArr);
        setCache("thingsWeLove", loveArr);
        setBigGames(gamesArr);
        setCache("bigGames", gamesArr);

        // Hot Sheet filter (topic + subtopics)
        const matched = hotArr.filter((item) => {
          const topicKey = stripEmoji(item.topic);
          const subs = normalizedSubtopicAnswers[topicKey] || [];
          return (
            selectedTopics.some((t) => stripEmoji(t) === topicKey) &&
            (subs.length === 0 || subs.includes(stripEmoji(item.subtopic)))
          );
        });

        const grouped = {};
        matched.forEach((entry) => {
          const k = stripEmoji(entry.topic);
          (grouped[k] ||= []).push(entry);
        });
        setFilteredHotSheet(grouped);
      } catch (err) {
        console.error("🔥 Error loading sheets:", err);
      }
    };

    fetchAll();
    // Only fetch live when topics are available
    if ((selectedTopics || []).length > 0) {
      fetchLive(); // decides live/rss/curated
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopics, subtopicAnswers, city]); // include city so local re-rank updates if user changes it

  const handleCelebrateAndReturn = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => navigate("/"), 1200);
  };

  const validBigGames = (bigGames || []).filter(
    (game) =>
      game && game.Event?.trim() && game.Sport?.trim() && game["Date(s)"]?.trim()
  );
  const gamesToShow = validBigGames.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#a78bfa] text-white px-4 py-10 relative">
      <div className="absolute inset-0 bg-[url('/stars-explosion.svg')] bg-cover bg-center opacity-40 pointer-events-none z-0" />
      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        <div className="text-center mb-10">
          <h1 className="font-script text-4xl sm:text-5xl text-white drop-shadow-[0_0_6px_#ffffffaa]">
            Talk More Tonight
          </h1>
          <p className="mt-2 text-white/80 italic text-sm sm:text-base">
            {userName}, here's the news for tonight
          </p>
        </div>

        {/* TAPinto headlines */}
        {tapintoHeadlines.length > 0 && (
          <section className="relative rounded-2xl px-6 py-8 bg-[#0b1b34] text-white shadow border border-white/20 overflow-hidden w-full max-w-5xl mx-auto my-10">
            <div className="absolute inset-0 bg-[url('/stars-explosion.svg')] bg-cover bg-center opacity-60 pointer-events-none z-0" />
            <div className="relative z-10 max-w-3xl w-full mx-auto px-4">
              <h3 className="text-2xl font-bold mb-4 text-center">Top Headlines 🗞️</h3>
              <TapIntoCard city={city} theme="dark" textColor="text-white" />
            </div>
          </section>
        )}

        {/* Live/RSS/Curated (grouped) */}
        <section className="bg-[#1e293b] rounded-xl p-5 shadow border border-white/20 transition-opacity duration-300">
          <h2 className="text-lg font-bold text-white mb-3">🗞️ Tonight’s Headlines</h2>
          <p className="text-center text-white/70 italic mb-2">
            Not every article will be a match — kinda like dating 😉
          </p>

          {Object.entries(liveWireHeadlines)
            .filter(([topic]) =>
              selectedTopics.some((t) => stripEmoji(t) === topic)
            )
            .map(([topic, stories], i) => (
              <div key={i} className="mb-5">
                <h3 className="text-md font-semibold text-white mb-1">
                  {displayTopicLabel(topic, selectedTopics)}
                </h3>
                {(stories || []).slice(0, 2).map((story, index) => (
                  <div
                    key={index}
                    className="rounded-md px-3 py-2 bg-[#111827] text-white mb-2 border border-white/10 shadow-sm"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${
                          story?.isFallback
                            ? "bg-teal-500/20 text-teal-200 border border-teal-500/40" // Mint CURATED
                            : "bg-indigo-500/20 text-indigo-200 border border-indigo-500/40" // Blue LIVE
                        }`}
                      >
                        {story?.isFallback ? "Curated" : "Live"}
                      </span>

                      {story?.isFallback ? (
                        <span className="text-sm font-semibold leading-snug break-words">
                          {story.title}
                        </span>
                      ) : (
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold leading-snug hover:underline break-words"
                        >
                          {story.title}
                        </a>
                      )}
                    </div>

                    {story?.description ? (
                      <p className="text-[12px] text-white/70 mt-1 leading-snug break-words">
                        {snippet(story.description, 110)}
                      </p>
                    ) : null}

                    <div className="mt-1 text-[10px] text-white/45">
                      {(story?.publishedAt || "").slice(0, 10)} • {story?.source}
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {Object.keys(liveWireHeadlines).length === 0 && (
            <>
              <p className="text-center text-white/70 italic mb-4">
                No live headlines yet. Showing curated news instead.
              </p>
              {/* Curated list (emoji-safe) */}
              {Array.isArray(curatedFallbacksLocal) &&
                curatedFallbacksLocal
                  .filter((s) =>
                    selectedTopics.some(
                      (t) => stripEmoji(t) === stripEmoji(s.topic)
                    )
                  )
                  .map((story, i) => (
                    <div
                      key={i}
                      className="rounded-md px-3 py-2 bg-[#111827] text-white mb-2 border border-white/10"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide bg-teal-500/20 text-teal-200 border border-teal-500/40 shrink-0">
                          Curated
                        </span>
                        <span className="text-sm font-semibold leading-snug text-white break-words">
                          {story.title}
                        </span>
                      </div>

                      {story?.description ? (
                        <p className="text-[12px] text-white/70 mt-1 leading-snug break-words">
                          {snippet(story.description, 110)}
                        </p>
                      ) : null}

                      <div className="mt-1 text-[10px] text-white/45">
                        {(story?.publishedAt || "").slice(0, 10)} • {story?.source}
                      </div>
                    </div>
                  ))}
            </>
          )}
        </section>

        {/* 🔥 The Hot Sheet */}
        <section className="bg-black rounded-xl p-5 shadow border border-white/20">
          <h2 className="text-lg font-semibold mb-4">🔥 The Hot Sheet</h2>

          {Object.keys(filteredHotSheet || {}).length > 0 ? (
            Object.entries(filteredHotSheet).map(([topic, entries], i) => (
              <div key={i} className="mb-6">
                <button
                  onClick={() => toggleTopic(topic)}
                  className="w-full text-left font-semibold"
                >
                  {displayTopicLabel(topic, selectedTopics)}{" "}
                  {expandedTopics.includes(topic) ? "▲" : "▼"}
                </button>
                {expandedTopics.includes(topic) && (
                  <div className="bg-[#111] rounded-md mt-2 px-4 py-4">
                    {(entries || []).map((entry, j) => (
                      <div key={j} className="mb-4">
                        <h4 className="font-semibold text-sm mb-1">
                          {entry.subtopic}
                        </h4>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                          {entry.blurb && <li>{entry.blurb}</li>}
                          {entry.ask && (
                            <li className="italic text-gray-300">
                              {entry.ask.replace("[dateName]", dateName)}
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm italic text-white/50">
              Loading your curated Hot Sheet…
            </p>
          )}
        </section>

        {/* 3-Column Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Sports */}
          <div className="bg-[#1e1b4b] rounded-xl p-5 shadow border border-white/20">
            <h2 className="text-lg font-bold text-white mb-3">🏟️ Tonight in Sports</h2>

            <ul className="text-sm space-y-2 mb-4">
              {sportsSchedules.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-white hover:text-indigo-200"
                  >
                    {item.league} Schedule →
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-md font-semibold text-white mt-6 mb-2">
              🏆 Big Games Ahead
            </h3>
            <ul className="text-sm space-y-4">
              {gamesToShow.length > 0 ? (
                gamesToShow.map((item, index) => (
                  <li
                    key={index}
                    className="bg-white/5 p-3 rounded-md border border-white/10 text-white"
                  >
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-lg">{getSportEmoji(item.Sport)}</span>
                      {item.Event}
                      <span className="text-xs text-white/70 ml-2">
                        ({item.Sport})
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-indigo-200">
                      {item["Date(s)"]}
                    </div>
                    <div className="text-xs text-indigo-200">{item.Location}</div>
                    {item?.Notes && (
                      <div className="mt-1 text-xs italic text-yellow-300 leading-snug break-words">
                        {item.Notes}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-sm italic text-white/60">
                  No upcoming games available right now.
                </p>
              )}
            </ul>

            {cityTeams && Object.keys(cityTeams).length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-white mb-2">
                  🏙️ Your Local Teams
                </h3>
                {Object.entries(cityTeams).map(([sport, teams]) => (
                  <div key={sport} className="mb-2">
                    <p className="text-sm font-semibold capitalize">{sport}</p>
                    <p className="text-xs italic text-white/70">
                      {(teams || []).join(" • ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation Deck */}
          <div className="bg-black rounded-xl p-5 shadow border border-white/20">
            <h2 className="text-lg font-bold text-white mb-3">🗣️ Conversation Deck</h2>
            <div
              className={`space-y-4 transition-opacity duration-500 ease-in-out ${
                isFading ? "opacity-0" : "opacity-100"
              }`}
            >
              {shuffledConvoCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left text-white"
                >
                  <p className="text-sm font-semibold mb-2">💬 {card.prompt}</p>
                  <p className="text-xs italic text-white/70">{card.blurb}</p>
                </div>
              ))}
            </div>
            <button
              onClick={reshuffleCards}
              className="mt-6 text-sm text-indigo-300 underline hover:text-indigo-100"
            >
              🔄 Shuffle Cards
            </button>
          </div>

          {/* Things We Love */}
          <div className="bg-[#1e293b] rounded-xl p-5 shadow border border-white/20">
            <h2 className="text-lg font-bold text-white mb-3">🌟 The Brighter Side</h2>
            {thingsWeLove.length > 0 ? (
              thingsWeLove.map((item, index) => (
                <div key={index} className="mb-4">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-300 underline"
                  >
                    {item.title}
                  </a>
                  <ul className="list-disc list-inside text-xs text-white/80 mt-1 space-y-1">
                    {safeSplit(item.bullets).map((line, i) => (
                      <li key={i}>{String(line).trim()}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-xs italic text-white/50">Loading the good stuff…</p>
            )}
          </div>
        </section>

        <DateNightFunSection />

        {/* Pocket Companion */}
        <section className="bg-white/5 rounded-xl p-6 shadow border border-white/10">
          <h3 className="text-lg font-bold text-center mb-4">
            🌙 Your Pocket Companion
          </h3>
          <p className="text-sm italic text-white/80 text-center mb-6">
            A few final sparks before you head out...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">
                Last-Minute Confidence
              </p>
              <p className="text-xs italic text-white/70">{companion.confidence}</p>
            </div>
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">Say This Tonight</p>
              <p className="text-xs italic text-white/70">{companion.sayThis}</p>
            </div>
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">One Last Thought</p>
              <p className="text-xs italic text-white/70">{companion.finalThought}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center mt-16 space-y-2">
          <p className="text-xl sm:text-2xl font-script italic text-white drop-shadow-[0_0_6px_#ffffffaa]">
            We truly hope you and {dateName} <strong>Talk More Tonight</strong>.
          </p>
          <p className="text-sm text-white/60">
            © 2025 Talk More Tonight™. All rights reserved.
          </p>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={handleCelebrateAndReturn}
            className="mt-8 bg-gradient-to-br from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-purple-600 hover:to-indigo-600"
          >
            🌟 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;
