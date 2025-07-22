// ✅ FULL FINAL News.jsx — wrapped properly with all sections
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import TapIntoCard from "../components/TapIntoCard";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import curatedFallbacks from "../data/curatedFallbacks";
import hotSheetBlurbs from "../data/hotSheetBlurbs";
import { fetchNewsArticles } from "../utils/fetchNews";
import { getTAPintoHeadlinesForCity } from "../utils/rssFeeds";
import conversationDeck from "../data/conversationDeck";
import topicEmojiMap from "../data/topicEmojiMap";
import sportsScheduleLinks from "../data/sportsScheduleLinks";
import cityTeamMap from "../data/cityTeamMap";

const News = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [tapintoHeadlines, setTapintoHeadlines] = useState([]);
  const [liveWireHeadlines, setLiveWireHeadlines] = useState({});
  const [expandedTopics, setExpandedTopics] = useState([]);

  const {
    userName = "You",
    dateName = "your date",
    city = "",
    state = "",
    selectedTopics = [],
    subtopicAnswers = {},
  } = userData;

  useEffect(() => {
    const fetchTAP = async () => {
      const headlines = await getTAPintoHeadlinesForCity(city);
      setTapintoHeadlines(headlines || []);
    };
    fetchTAP();
  }, [city]);

  useEffect(() => {
    const fetchLive = async () => {
      const results = await fetchNewsArticles(
        selectedTopics,
        selectedTopics.join(", "),
        "",
        city,
        state
      );
      const grouped = {};
      if (results?.length) {
        results.forEach((story) => {
          const topic =
            selectedTopics.find(
              (t) =>
                story.title.includes(t) || story.description.includes(t)
            ) || "General";
          if (!grouped[topic]) grouped[topic] = [];
          grouped[topic].push(story);
        });
      } else {
        selectedTopics.forEach((topic) => {
          if (curatedFallbacks[topic]) {
            grouped[topic] = curatedFallbacks[topic];
          }
        });
      }
      setLiveWireHeadlines(grouped);
    };
    fetchLive();
  }, [selectedTopics, city, state]);

  const getHotSheetBlurbs = () => {
    const grouped = {};
    selectedTopics.forEach((topic) => {
      const subs = (subtopicAnswers[topic] || []).slice(0, 2);
      subs.forEach((sub) => {
        const blurbs = hotSheetBlurbs?.[topic]?.[sub] || [];
        if (blurbs.length) {
          if (!grouped[topic]) grouped[topic] = [];
          grouped[topic].push({ subtopic: sub, blurbs });
        }
      });
    });
    return grouped;
  };

  const groupedHotSheet = getHotSheetBlurbs();
  const [shuffledConvoCards] = useState(() =>
    [...conversationDeck].sort(() => 0.5 - Math.random()).slice(0, 3)
  );

  const cityTeams = cityTeamMap[city.toLowerCase()];

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleCelebrateAndReturn = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => navigate("/"), 1200);
  };

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
        {tapintoHeadlines.length > 0 && (
  <section className="relative rounded-xl p-4 bg-[#0a2540] text-white shadow border border-white/20 overflow-hidden">
    <div className="absolute inset-0 bg-[url('/stars-explosion.svg')] bg-cover bg-center opacity-60 pointer-events-none z-0" />
    <div className="relative z-10">
      <TapIntoCard city={city} theme="dark" textColor="text-white" />
    </div>
  </section>
)}

{Object.keys(liveWireHeadlines).length > 0 && (
  <section className="bg-[#1e293b] rounded-xl p-5 shadow border border-white/20">
    <h2 className="text-lg font-bold text-white mb-3">🗞️ Tonight’s Headlines</h2>
    <p className="text-center text-white/70 italic mb-6">
      “Big city, bold energy — let’s see what tonight brings.”
    </p>
    {Object.entries(liveWireHeadlines).map(([topic, stories], i) => (
      <div key={i} className="mb-5">
        <h3 className="text-md font-semibold text-white mb-1">{topic}</h3>
        {stories.slice(0, 2).map((story, index) => {
          const formattedDate = new Date(story.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return (
            <div key={index} className="rounded-md px-4 py-3 bg-[#111827] text-white mb-2 border border-white/10 shadow-sm hover:bg-[#1f2937]">
              <p className="text-sm font-medium underline underline-offset-2 decoration-white/40 hover:decoration-white">{story.title}</p>
              <p className="text-xs italic text-white/70">{story.description}</p>
              <p className="text-[10px] text-white/40 italic mt-1">{formattedDate}</p>
            </div>
          );
        })}
      </div>
    ))}
    <p className="text-[12px] text-white/40 italic text-center mt-6">
      These are curated fallback headlines. Live content will be powered by real news APIs — including Apple News if approved.
    </p>
  </section>
)}

<section className="bg-black rounded-xl p-5 shadow border border-white/20">
  <h2 className="text-lg font-semibold mb-4">🔥 The Hot Sheet: Tailored by Subtopic</h2>
  {Object.entries(groupedHotSheet).map(([topic, items], i) => (
    <div key={i} className="mb-6">
      <button onClick={() => toggleTopic(topic)} className="w-full text-left font-semibold text-white hover:bg-[#333] px-4 py-3 rounded-md transition border-b border-gray-700">
        <span>{topic}</span> <span className="ml-1">{expandedTopics.includes(topic) ? "▲" : "▼"}</span>
      </button>
      {expandedTopics.includes(topic) && (
        <div className="bg-[#111] rounded-md shadow-inner mt-2 px-4 py-4">
          {items.map((item, j) => (
            <div key={j} className="mb-4">
              <h4 className="font-semibold text-sm mb-1">{item.subtopic}</h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                {item.blurbs.map((blurb, b) => (
                  <li key={b}>{blurb.replace("[dateName]", dateName)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</section>

<section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  {/* Sports Column */}
  <div className="bg-[#1e1b4b] rounded-xl p-5 shadow border border-white/20">
    <h2 className="text-lg font-bold text-white mb-3">🏟️ Tonight in Sports</h2>
    <ul className="text-sm space-y-2 mb-4">
      {Object.entries(sportsScheduleLinks).map(([league, link]) => (
        <li key={league}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white hover:text-indigo-200"
          >
            {league} Schedule →
          </a>
        </li>
      ))}
    </ul>
    <h3 className="text-md font-semibold text-white mt-6 mb-2">🏆 Big Games Ahead</h3>
    <ul className="text-sm space-y-2">
      <li>🎾 US Open Tennis — Aug 25–Sept 7, 2025 (New York)</li>
      <li>⛳ Ryder Cup — Sept 26–28, 2025 (Long Island)</li>
      <li>⚾ World Series — Late October 2025 (Teams & Cities TBD)</li>
      <li>🏀 NBA All-Star Weekend — Feb 14–16, 2026 (San Francisco)</li>
      <li>🏈 Super Bowl LX — Feb 8, 2026 (Santa Clara)</li>
      <li>⚽ FIFA World Cup — June–July 2026 (USA, CAN, MEX)</li>
      <li>🚴 Tour de France — July 2026</li>
    </ul>
    {cityTeams && (
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
  <div className="bg-black rounded-xl p-5 shadow border border-white/20">
    <h2 className="text-lg font-bold text-white mb-3">🗣️ Conversation Deck</h2>
    <div className="space-y-4">
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
  </div>

  {/* Things We Love */}
  <div className="bg-[#1e293b] rounded-xl p-5 shadow border border-white/20">
    <h2 className="text-lg font-bold text-white mb-3">🌟 Things We Love This Week</h2>

   <div>
    <a
      href="https://people.com/after-hiding-the-relationship-from-their-students-teachers-revealed-they-got-engaged-exclusive-11769783"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-indigo-300 underline"
    >
      💍 Teachers Surprise Class with Engagement Announcement — Viral TikTok
    </a>
    <ul className="list-disc list-inside text-xs text-white/80 mt-1 space-y-1">
      <li>They kept their romance hidden from students and then→ surprise proposal</li>
      <li>6.5 million TikTok views and major feel‑good energy</li>
      <li>Perfect for a positive, real‑life romantic chat</li>
    </ul>
  </div>

    {/* 📰 Trending Story */}
    <div>
      <a
        href="https://www.vice.com/en/article/summer-shading-is-the-worst-dating-trend-of-2025"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-indigo-300 underline"
      >
        📰 “Summer Shading” Is the Worst Dating Trend of 2025
      </a>
      <ul className="list-disc list-inside text-xs text-white/80 mt-1 space-y-1">
        <li>When “catching feelings” takes a summer nap 🌞</li>
        <li>Silent? Vague texts? You might be getting summer-shaded</li>
        <li>Timely & talk-worthy — perfect date convo starter</li>
      </ul>
    </div>
  </div>
</section> {/* ✅ This is the missing section close that fixes the error */}



        {/* 🎁 Pocket Companion Section */}
        <section className="bg-white/5 rounded-xl p-6 shadow border border-white/10">
          <h3 className="text-lg font-bold text-center mb-4">🌙 Your Pocket Companion</h3>
          <p className="text-sm italic text-white/80 text-center mb-6">
            A few final sparks before you head out...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">Last-Minute Confidence</p>
              <p className="text-xs italic text-white/70">
                {userName}, you’ve already done the hard part — just be present, be curious, and let yourself shine.
              </p>
            </div>
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">Say This Tonight</p>
              <p className="text-xs italic text-white/70">
                “This has been fun already — I’m glad we’re doing this.” (Watch their smile.)
              </p>
            </div>
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">One Last Thought</p>
              <p className="text-xs italic text-white/70">
                Dates aren’t about being perfect. They’re about *connecting.* And you’re more ready than you know.
              </p>
            </div>
          </div>
        </section>

        {/* Final Message and Button */}
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
};

export default News;