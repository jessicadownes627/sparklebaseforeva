// ✅ CLEAN + FINAL News.jsx — fully fixed, all features intact
// ✅ FINAL News.jsx – fully working, powered by Sheets + NewsData.io
import React, { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import TapIntoCard from "../components/TapIntoCard";
import confetti from "canvas-confetti";
import { fetchHotSheetFromSheet } from "../utils/fetchHotSheetFromSheet";
import { fetchThingsWeLoveFromSheet } from "../utils/fetchThingsWeLoveFromSheet";
import { fetchBigGamesFromSheet } from "../utils/fetchBigGamesFromSheet";
import { getTAPintoHeadlinesForCity } from "../utils/rssFeeds";
import { getLiveWireHeadlinesFromNewsData } from "../utils/getLiveWireHeadlinesFromNewsData";
import { fetchCuratedFallbacksFromSheet } from "../utils/fetchCuratedFallbacksFromSheet";
import conversationDeck from "../data/conversationDeck";
import topicEmojiMap from "../data/topicEmojiMap";
import pocketCompanionDeck from "../data/pocketCompanionDeck";
import cityTeamMap from "../data/cityTeamMap";
import thingsWeLoveFallback from "../data/thingsWeLoveFallback";
import bigGamesFallback from "../data/bigGamesFallback";
import DateNightFunSection from "../components/DateNightFunSection";
import curatedFallbacksLocal from "../data/curatedFallbacks";


function getSportEmoji(sport) {
  if (!sport) return "🏅";
  const foundKey = Object.keys(topicEmojiMap).find((key) =>
    key.toLowerCase().startsWith(sport.toLowerCase())
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

const News = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  const [tapintoHeadlines, setTapintoHeadlines] = useState([]);
  const [liveWireHeadlines, setLiveWireHeadlines] = useState({});
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [hotSheet, setHotSheet] = useState([]);
  const [filteredHotSheet, setFilteredHotSheet] = useState({});
  const [curatedFallbacks, setCuratedFallbacks] = useState([]);
  const [thingsWeLove, setThingsWeLove] = useState([]);
  const [bigGames, setBigGames] = useState([]);
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
  } = userData;
  
useEffect(() => {
  if (!city) return;
  getTAPintoHeadlinesForCity(city)
    .then((data) => {
      setTapintoHeadlines(data);
      console.log("✅ TapInto headlines fetched:", data);
    })
    .catch((error) => {
      console.error("❌ Error fetching TapInto headlines:", error);
    });
}, [city]);

  const cityTeams = cityTeamMap[city.toLowerCase()];

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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hot, love, games, fallbacks] = await Promise.all([
          fetchHotSheetFromSheet(
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFcfO2X43yTcfzsAS5WY80lwEXfC5zNQDiPAS1We9jNSPXgiqFMs7CfoQOTv1C0RFn-dxU5NrkpuyY/pub?output=csv"
          ),
          fetchThingsWeLoveFromSheet().catch(() => thingsWeLoveFallback),
          fetchBigGamesFromSheet().catch(() => bigGamesFallback),
          fetchCuratedFallbacksFromSheet().catch(() => curatedFallbacksLocal),
        ]);

        setHotSheet(hot);
        setThingsWeLove(love);
        setBigGames(games);
        setCuratedFallbacks(fallbacks);

        const matched = hot.filter(
          (item) =>
            selectedTopics.includes(item.topic?.trim()) &&
            subtopicAnswers[item.topic?.trim()]?.includes(item.subtopic?.trim())
        );
        const grouped = {};
        matched.forEach((entry) => {
          if (!grouped[entry.topic]) grouped[entry.topic] = [];
          grouped[entry.topic].push(entry);
        });
        setFilteredHotSheet(grouped);
      } catch (err) {
        console.error("🔥 Error loading sheets:", err);
      }
    };

    const fetchLive = async () => {
      const results = await getLiveWireHeadlinesFromNewsData(selectedTopics);
      setLiveWireHeadlines(results);
    };

    fetchAll();
    fetchLive();
  }, [selectedTopics, subtopicAnswers]);

  const handleCelebrateAndReturn = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => navigate("/"), 1200);
  };

  const validBigGames = bigGames.filter(
  (game) =>
    game &&
    game.Event && game.Event.trim() !== "" &&
    game.Sport && game.Sport.trim() !== "" &&
    game["Date(s)"] && game["Date(s)"].trim() !== ""
);
const gamesToShow = validBigGames.slice(0, 4);


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#312e81] to-[#a78bfa] text-white px-4 py-10 relative">
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
        <section className="relative rounded-xl p-4 bg-[#0a2540] text-white shadow border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/stars-explosion.svg')] bg-cover bg-center opacity-60 pointer-events-none z-0" />
          <div className="relative z-10">
            <TapIntoCard city={city} theme="dark" textColor="text-white" />
          </div>
        </section>
      )}


{/* LiveWire or fallback */}
{Object.keys(liveWireHeadlines).length > 0 ? (
  <section className="bg-[#1e293b] rounded-xl p-5 shadow border border-white/20">
    <h2 className="text-lg font-bold text-white mb-3">🗞️ Tonight’s Headlines</h2>
    <p className="text-center text-white/70 italic mb-2">
      Not every article will be a match — kinda like dating 😉
    </p>

    {Object.entries(liveWireHeadlines)
      .filter(([topic]) => selectedTopics.includes(topic))
      .map(([topic, stories], i) => (
        <div key={i} className="mb-5">
          <h3 className="text-md font-semibold text-white mb-1">{topic}</h3>
          {stories.slice(0, 2).map((story, index) => (
            <div
              key={index}
              className="rounded-md px-4 py-3 bg-[#111827] text-white mb-2 border border-white/10 shadow-sm"
            >
              <a
                href={story.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-indigo-300 underline"
              >
                {story.title}
              </a>
              <p className="text-xs italic text-white/70 mt-1">{story.description}</p>
              <p className="text-[10px] text-white/40 italic mt-2">
                {story.publishedAt?.slice(0, 10)} • {story.source}
              </p>
            </div>
          ))}
        </div>
      ))}

    <p className="text-center text-white/40 italic text-xs mt-6">
      Powered by APIs and RSS feeds
    </p>
  </section>
) : (
  <section className="bg-[#1e293b] rounded-xl p-5">
    <h2 className="text-lg font-bold text-white mb-3">🗞️ Tonight’s Headlines</h2>
    <p className="text-center text-white/70 italic mb-2">
      Not every article will be a match — kinda like dating 😉
    </p>
    <p className="text-white/70 italic mb-4 text-center">
      No live headlines available. Showing curated news instead.
    </p>

    {Array.isArray(curatedFallbacks) &&
      curatedFallbacks
        .filter(story => selectedTopics.includes(story.topic))
        .map((story, i) => (
          <div key={i} className="rounded-md px-4 py-3 bg-[#111827] text-white mb-2 border border-white/10">
            <p className="underline text-base font-semibold text-white">{story.title}</p>
            <p className="text-xs italic text-white/70 mt-1">{story.description}</p>
            <p className="text-[10px] text-white/40 italic mt-2">
              {story.publishedAt?.slice(0, 10)} • {story.source}
            </p>
          </div>
        ))}

    <p className="text-center text-white/40 italic text-xs mt-6">
      Powered by hand-picked headlines… because great conversations deserve great headlines. 
    </p>
  </section>
)}




{/* 🔥 Hot Sheet Section */}
        {filteredHotSheet && Object.keys(filteredHotSheet).length > 0 && (
          <section className="bg-black rounded-xl p-5 shadow border border-white/20">
            <h2 className="text-lg font-semibold mb-4">🔥 The Hot Sheet</h2>
            {Object.entries(filteredHotSheet).map(([topic, entries], i) => (
              <div key={i} className="mb-6">
                <button onClick={() => toggleTopic(topic)} className="w-full text-left font-semibold">
                  {topic} {expandedTopics.includes(topic) ? "▲" : "▼"}
                </button>
                {expandedTopics.includes(topic) && (
                  <div className="bg-[#111] rounded-md mt-2 px-4 py-4">
                    {entries.map((entry, j) => (
                      <div key={j} className="mb-4">
                        <h4 className="font-semibold text-sm mb-1">{entry.subtopic}</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                          {entry.blurb && <li>{entry.blurb}</li>}
                          {entry.ask && <li className="italic text-gray-300">{entry.ask.replace("[dateName]", dateName)}</li>}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}




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

  <h3 className="text-md font-semibold text-white mt-6 mb-2">🏆 Big Games Ahead</h3>
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
  <span className="text-xs text-white/70 ml-2">({item.Sport})</span>
</div>

          <div className="mt-1 text-xs text-indigo-200">{item["Date(s)"]}</div>
          <div className="text-xs text-indigo-200">{item.Location}</div>
          <div className="mt-1 text-xs italic text-yellow-300 leading-snug break-words">
            {item.Notes}
          </div>
        </li>
      ))
    ) : (
      <p className="text-sm italic text-white/60">No upcoming games available right now.</p>
    )}
  </ul>

  {cityTeams && Object.keys(cityTeams).length > 0 && (
    <div className="mt-6">
      <h3 className="text-md font-semibold text-white mb-2">🏙️ Your Local Teams</h3>
      {Object.entries(cityTeams).map(([sport, teams]) => (
        <div key={sport} className="mb-2">
          <p className="text-sm font-semibold capitalize">{sport}</p>
          <p className="text-xs italic text-white/70">{teams.join(" • ")}</p>
        </div>
      ))}
    </div>
  )}
</div>



        {/* Conversation Deck */}
   {/* Conversation Deck */}
<div className="bg-black rounded-xl p-5 shadow border border-white/20">
  <h2 className="text-lg font-bold text-white mb-3">🗣️ Conversation Deck</h2>
  <div className={`space-y-4 transition-opacity duration-500 ease-in-out ${isFading ? "opacity-0" : "opacity-100"}`}>
    {shuffledConvoCards.map((card, index) => (
      <div key={index} className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left text-white">
        <p className="text-sm font-semibold mb-2">💬 {card.prompt}</p>
        <p className="text-xs italic text-white/70">{card.blurb}</p>
      </div>
    ))}
  </div>
  <button onClick={reshuffleCards} className="mt-6 text-sm text-indigo-300 underline hover:text-indigo-100">
    🔄 Shuffle Cards
  </button>
</div>


        {/* Things We Love */}
        <div className="bg-[#1e293b] rounded-xl p-5 shadow border border-white/20">
        <h2 className="text-lg font-bold text-white mb-3">🌟 The Brighter Side</h2>
          {thingsWeLove.length > 0 ? (
            thingsWeLove.map((item, index) => (
              <div key={index} className="mb-4">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-300 underline">
                  {item.title}
                </a>
                <ul className="list-disc list-inside text-xs text-white/80 mt-1 space-y-1">
                  {item.bullets.split(/[,•\n]/).map((line, i) => (
                    <li key={i}>{line.trim()}</li>
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
  <h3 className="text-lg font-bold text-center mb-4">🌙 Your Pocket Companion</h3>
  <p className="text-sm italic text-white/80 text-center mb-6">
    A few final sparks before you head out...
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
      <p className="text-sm font-semibold text-white mb-1">Last-Minute Confidence</p>
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
        <p className="text-sm text-white/60">© 2025 Talk More Tonight™. All rights reserved.</p>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleCelebrateAndReturn}
          className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-purple-600 hover:to-indigo-600"
        >
          🌟 Back to Home
        </button>
      </div>
    </div>
    </div>
  );
}; // ← this closes the News function properly

export default News;
