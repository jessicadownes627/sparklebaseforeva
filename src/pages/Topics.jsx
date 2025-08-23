// src/pages/Topics.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import PageHeader from "../components/PageHeader";
import energyThemes from "../data/energyThemes";
import subtopicOptions from "../data/subtopicOptions";
import { AnimatePresence, motion } from "framer-motion";
import cityTeamMap from "../data/cityTeamMap";

// 🔧 NEW: use canonical sport helpers (fixes Baseball/MLB key mismatches)
import {
  SPORT_KEYS,
  normalizeSportKey,
  getAllTeamsForSport,
} from "../utils/sportsHelpers";

// ⛔️ REMOVED: leagueTeams import (we now pull from helpers)
// import leagueTeams from "../data/leagueTeams";

const topicGroups = {
  "🧠 Smart & Curious": [
    "Politics 🗳️", "Talk of the Country 🇺🇸", "Tech & Gadgets 💻", "Business & Money 💼",
    "Legal Drama ⚖️", "True Crime 🔪", "Environment & Climate 🌍", "AI & Future Tech 🤖"
  ],
  "🌍 Culture & Entertainment": [
    "Travel ✈️", "Food & Restaurants 🍝", "Health & Fitness 🧘", "Fashion 👗",
    "Shopping 🛍️", "Book Buzz 📚", "Art & Museums 🖼️", "Dating & Relationships ❤️", "Viral & Memes 📱"
  ],
  "🎬 Screens & Sound": [
    "Music 🎵", "Film 🎬", "TV Shows 📺", "Streaming & Reality 💅",
    "Celebrity News 🌟", "Award Shows & Red Carpets 🎭", "Gaming 🎮", "Indie Films 🎬", "Podcasts 🎧"
  ],
  "🏆 Sports & Action": [
    "Football 🏈", "Basketball 🏀", "Baseball ⚾", "Hockey 🏒", "Golf ⛳",
    "College Sports 🎓", "Olympics 🏅", "Sports Betting 🎲"
  ],
  "🎉 What’s Hot": [
    "Concert Tours 🎤", "Festivals 🎪", "Trending Events 🎉", "Holiday Happenings 🎁",
    "Major Weather Events ⛈️", "Space & UFOs 🛸", "Wildcard 🃏"
  ]
};

// Helpers
const stripEmoji = (s = "") =>
  String(s)
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDEFF])/g, "")
    .trim();

  // Make a topic like "Baseball ⚾" or "Baseball (MLB)" → "baseball"
const sportTopicToKey = (topic = "") => {
  const s = stripEmoji(topic).toLowerCase();
  if (s.includes("baseball")) return "baseball";
  if (s.includes("football")) return "football";
  if (s.includes("basketball")) return "basketball";
  if (s.includes("hockey")) return "hockey";
  return "";
};


// Canonical sport names (lowercased) we care about for favorites UI
const SPORTS_TOPICS_LOWER = new Set(["football", "basketball", "baseball", "hockey"]);

const STATE_TO_CODE = {
  "new jersey": "NJ", "nj": "NJ",
  "new york": "NY", "ny": "NY",
  "pennsylvania": "PA", "pa": "PA",
  "florida": "FL", "fl": "FL",
  "california": "CA", "ca": "CA",
  "texas": "TX", "tx": "TX",
  "illinois": "IL", "il": "IL",
};

const STATE_TEAM_SUGGESTIONS = {
  NJ: [
    "New York Jets","New York Giants",
    "New York Yankees","New York Mets",
    "New Jersey Devils","New York Rangers","New York Islanders",
    "Brooklyn Nets","New York Knicks",
    "Philadelphia Eagles","Philadelphia Phillies"
  ],
  NY: [
    "Buffalo Bills","New York Jets","New York Giants",
    "New York Yankees","New York Mets",
    "New York Knicks","Brooklyn Nets",
    "New York Rangers","New York Islanders","Buffalo Sabres"
  ],
  PA: [
    "Philadelphia Eagles","Pittsburgh Steelers",
    "Philadelphia Phillies","Pittsburgh Pirates",
    "Philadelphia 76ers","Pittsburgh Penguins","Philadelphia Flyers"
  ],
  CA: [
    "Los Angeles Dodgers","San Francisco Giants","San Diego Padres",
    "Los Angeles Lakers","Golden State Warriors","LA Clippers",
    "San Francisco 49ers","LA Rams","Las Vegas Raiders",
    "LA Kings","Anaheim Ducks","San Jose Sharks"
  ],
  FL: [
    "Miami Dolphins","Tampa Bay Buccaneers","Jacksonville Jaguars",
    "Miami Heat","Orlando Magic",
    "Tampa Bay Rays","Miami Marlins",
    "Florida Panthers","Tampa Bay Lightning"
  ],
  TX: [
    "Dallas Cowboys","Houston Texans",
    "Texas Rangers","Houston Astros",
    "Dallas Mavericks","San Antonio Spurs","Houston Rockets",
    "Dallas Stars"
  ],
  IL: [
    "Chicago Bears","Chicago Cubs","Chicago White Sox",
    "Chicago Bulls","Chicago Blackhawks"
  ],
};

const getStateCode = (raw = "") => {
  const s = String(raw || "").trim();
  const parts = s.split(",").map(p => p.trim());
  if (parts.length === 2 && /^[A-Za-z]{2}$/.test(parts[1])) return parts[1].toUpperCase();
  const key = s.toLowerCase();
  return STATE_TO_CODE[key] || "";
};

const Topics = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const {
    userName = "you",
    dateName = "your date",
    energy = "Dreamy ✨",
    subtopicAnswers = {}
  } = userData;

  const theme = energyThemes[energy];

  // Topic selection
  const [selectedTopics, setSelectedTopics] = useState(userData.selectedTopics || []);
  const [openGroups, setOpenGroups] = useState([]);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [shake, setShake] = useState(false);

  // Partner-team toggle
  const [includeDateTeams, setIncludeDateTeams] = useState(userData.includeDateTeams || false);

  // Store favorites as array of objects: [{ sport: 'football', team: 'Dallas Cowboys' }, ...]
  const [dateTeams, setDateTeams] = useState(userData.dateTeams || []);

// Show partner-team section only if a pro sport is selected
const hasSportsSelected = useMemo(() => {
  return (selectedTopics || []).some(t => !!sportTopicToKey(t));
}, [selectedTopics]);


// Which sports are selected (normalized to lower)
const selectedSportsSet = useMemo(() => {
  const set = new Set();
  (selectedTopics || []).forEach(t => {
    const key = sportTopicToKey(t); // "baseball" | "football" | ...
    if (key) set.add(key);
  });
  return set;
}, [selectedTopics]);

  // City → sport → teams
  const lowerCityTeamIndex = useMemo(() => {
    const out = {};
    Object.keys(cityTeamMap || {}).forEach(k => (out[k.toLowerCase()] = cityTeamMap[k]));
    return out;
  }, []);

  const cityRaw = (userData?.city || "").trim();
  const cityKeyLower = cityRaw.toLowerCase();
  const cityOnlyLower = cityKeyLower.split(",")[0]?.trim();

  const cityTeamsObj = useMemo(() => {
    return lowerCityTeamIndex[cityKeyLower] ||
           lowerCityTeamIndex[cityOnlyLower] ||
           null;
  }, [lowerCityTeamIndex, cityKeyLower, cityOnlyLower]);

  // Suggestions (city-first, then state fallback)
  const cityTeamSuggestions = useMemo(() => {
    if (!cityTeamsObj) return [];
    const out = [];
    Object.entries(cityTeamsObj).forEach(([sport, teams]) => {
      const lowerKey = normalizeSportKey(sport).toLowerCase();
      if (selectedSportsSet.size === 0 || selectedSportsSet.has(lowerKey)) {
        out.push(...(teams || []));
      }
    });
    return Array.from(new Set(out)).slice(0, 24);
  }, [cityTeamsObj, selectedSportsSet]);

  const stateCode = useMemo(() => getStateCode(cityRaw), [cityRaw]);
  const fallbackStateSuggestions = useMemo(
    () => STATE_TEAM_SUGGESTIONS[stateCode] || [],
    [stateCode]
  );

  const teamSuggestions = cityTeamSuggestions.length
    ? cityTeamSuggestions
    : fallbackStateSuggestions;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(prev => prev.filter(t => t !== topic));
      const updated = { ...subtopicAnswers };
      delete updated[topic];
      setUserData({ ...userData, subtopicAnswers: updated });
    } else if (selectedTopics.length < 5) {
      setSelectedTopics(prev => [...prev, topic]);
    } else {
      setShowLimitMessage(true);
      setShake(true);
      setTimeout(() => {
        setShowLimitMessage(false);
        setShake(false);
      }, 900);
    }
  };

  const toggleGroup = (group) => {
    setOpenGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleClearAll = () => {
    setSelectedTopics([]);
    setOpenGroups([]);
    setIncludeDateTeams(false);
    setDateTeams([]);

    setUserData({
      ...userData,
      selectedTopics: [],
      subtopicAnswers: {},
      includeDateTeams: false,
      dateTeams: [],
    });
  };

  // util for array-of-objects dateTeams [{sport,team}] → check by sport key
  const getTeamFor = (sportLower) =>
    dateTeams.find((t) => (t?.sport || "").toLowerCase() === sportLower)?.team || "";

  const setTeamFor = (sportLower, team) => {
    setDateTeams(prev => [
      ...prev.filter((t) => (t?.sport || "").toLowerCase() !== sportLower),
      { sport: sportLower, team }
    ]);
  };

  const handleSubmit = () => {
    if (selectedTopics.length === 0) return;

    // Save *everything* to context
    setUserData({
      ...userData,
      selectedTopics,
      subtopicAnswers: userData.subtopicAnswers,
      includeDateTeams,
      dateTeams,
    });

    navigate("/tonightstalktips");
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-[#0a2540] px-4 py-8`}>
      <PageHeader />

      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-1">
          {`${userName} — what’s your date into? Besides YOU! 😉`}
        </h2>
        <p className="text-sm opacity-80 mb-4">
          Pick up to 5 topics below. Click any group to explore ✨
        </p>
      </div>

      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-gray-200 py-2 mb-4 text-center rounded shadow-sm">
        <p className="text-sm font-medium text-[#0a2540]">
          {selectedTopics.length} / 5 topics selected
        </p>
      </div>

      {showLimitMessage && (
        <p className="text-center text-sm text-red-600 mb-4 transition-opacity duration-300">
          You’ve hit the limit — but clearly there’s a lot to talk about! 😎
        </p>
      )}

      <div className={`space-y-4 mb-10 ${shake ? "animate-shake" : ""}`}>
        {Object.entries(topicGroups).map(([group, topics]) => (
          <div key={group} className="border border-[#0a2540]/20 rounded-xl bg-white/60">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full text-left px-4 py-3 font-semibold text-[#0a2540] hover:bg-white rounded-t-xl text-lg"
            >
              {group}
            </button>
            <AnimatePresence>
              {openGroups.includes(group) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-4 pb-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`w-full py-2 px-4 rounded-full text-sm border flex items-center justify-between transition-all ${
                          selectedTopics.includes(topic)
                            ? "bg-white font-semibold border-blue-500 ring-2 ring-blue-300 shadow-sm"
                            : "bg-transparent border-[#0a2540] hover:bg-blue-100"
                        }`}
                      >
                        <span>{topic}</span>
                        {selectedTopics.includes(topic) && <span className="ml-2">✅</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Partner team picker with dropdowns */}
      {hasSportsSelected && (
        <div className="mb-10 rounded-xl border border-emerald-300/40 bg-emerald-50 p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDateTeams}
              onChange={(e) => setIncludeDateTeams(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            <span className="text-sm">
              Does {dateName} like a specific team?
              <span className="ml-2 text-xs text-emerald-700/80">
                (boost their team’s news)
              </span>
            </span>
          </label>

          {includeDateTeams && (
            <div className="mt-4 space-y-4">
              {/* Football dropdown (NFL) */}
              {selectedSportsSet.has("football") && (
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">
                    Favorite Football Team (NFL)
                  </label>
                  <select
                    value={getTeamFor("football")}
                    onChange={(e) => setTeamFor("football", e.target.value)}
                    className="w-full border border-emerald-300 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">-- Select a team --</option>
                    {getAllTeamsForSport("Football").map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Basketball dropdown (NBA) */}
              {selectedSportsSet.has("basketball") && (
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">
                    Favorite Basketball Team (NBA)
                  </label>
                  <select
                    value={getTeamFor("basketball")}
                    onChange={(e) => setTeamFor("basketball", e.target.value)}
                    className="w-full border border-emerald-300 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">-- Select a team --</option>
                    {getAllTeamsForSport("Basketball").map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Baseball dropdown (MLB) */}
              {selectedSportsSet.has("baseball") && (
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">
                    Favorite Baseball Team (MLB)
                  </label>
                  <select
                    value={getTeamFor("baseball")}
                    onChange={(e) => setTeamFor("baseball", e.target.value)}
                    className="w-full border border-emerald-300 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">-- Select a team --</option>
                    {getAllTeamsForSport("Baseball").map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Hockey dropdown (NHL) */}
              {selectedSportsSet.has("hockey") && (
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">
                    Favorite Hockey Team (NHL)
                  </label>
                  <select
                    value={getTeamFor("hockey")}
                    onChange={(e) => setTeamFor("hockey", e.target.value)}
                    className="w-full border border-emerald-300 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">-- Select a team --</option>
                    {getAllTeamsForSport("Hockey").map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* (Optional) Quick chips from local/state suggestions to inspire picks */}
      {hasSportsSelected && teamSuggestions.length > 0 && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wide text-emerald-900/70 mb-2">
            Local picks you might care about:
          </p>
          <div className="flex flex-wrap gap-2">
            {teamSuggestions.map((t) => {
              const isActive =
                dateTeams.some(d => d.team === t) ||
                dateTeams.some(d => d.team?.toLowerCase() === t.toLowerCase());
              return (
                <button
                  key={t}
                  onClick={() => {
                    // If any sport selected, add as that sport’s favorite only if empty;
                    // otherwise just add a generic entry. Keeps UX snappy.
                    const firstSport = [...selectedSportsSet][0] || "football";
                    setTeamFor(firstSport, t);
                  }}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    isActive
                      ? "bg-emerald-100 border-emerald-400 text-emerald-800"
                      : "bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-50"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtopics */}
      {selectedTopics.length > 0 && (
        <div className="mt-10 border-t border-white/30 pt-6">
          <h3 className="text-center text-xl font-semibold mb-4 text-indigo-700">
            ✨ A little extra magic...
          </h3>
          <p className="text-lg text-center text-gray-500 italic mb-2">
            Click up to 2 subtopics per category to guide what shows up on your News page, {userName}.
          </p>
          <p className="text-sm text-center text-gray-400 italic mb-6">
            We can’t promise world peace… but we’ll keep the headlines date-worthy 💌
          </p>

          {selectedTopics.map((topic) =>
            subtopicOptions[topic] ? (
              <div key={topic} className="mb-8">
                <p className="text-md font-semibold mb-3 text-indigo-800">{topic}</p>
                <div className="flex flex-wrap gap-2">
                  {subtopicOptions[topic].map((option) => {
                    const current = userData.subtopicAnswers?.[topic] || [];
                    const selected = current.includes(option);
                    const atLimit = current.length >= 2;

                    const handleClick = () => {
                      let updated = [];
                      if (selected) {
                        updated = current.filter((item) => item !== option);
                      } else if (!atLimit) {
                        updated = [...current, option];
                      } else {
                        return;
                      }

                      setUserData((prev) => ({
                        ...prev,
                        subtopicAnswers: {
                          ...prev.subtopicAnswers,
                          [topic]: updated,
                        },
                      }));
                    };

                    return (
                      <button
                        key={option}
                        onClick={handleClick}
                        disabled={!selected && atLimit}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${
                          selected
                            ? "bg-indigo-100 border-indigo-400 text-indigo-800 shadow-sm"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-indigo-50"
                        } ${!selected && atLimit ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <button
          onClick={() => navigate("/build-your-night")}
          className="text-sm underline hover:opacity-70"
        >
          ← Back to Planner
        </button>

        <button
          onClick={handleClearAll}
          className="text-sm underline text-gray-600 hover:text-red-500"
        >
          Clear All Topics
        </button>

        <button
          onClick={handleSubmit}
          disabled={selectedTopics.length === 0}
          className={`py-2 px-5 rounded-xl text-white font-semibold ${
            selectedTopics.length === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 shadow-md"
          }`}
        >
          Let's Talk More Tonight →
        </button>
      </div>
    </div>
  );
};

export default Topics;


