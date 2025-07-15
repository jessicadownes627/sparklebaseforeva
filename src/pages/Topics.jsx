// src/pages/Topics.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import PageHeader from "../components/PageHeader";
import energyThemes from "../data/energyThemes";
import subtopicOptions from "../data/subtopicOptions";
import { AnimatePresence, motion } from "framer-motion";

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

const Topics = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const { userName = "you", energy = "Dreamy ✨", subtopicAnswers = {} } = userData;
  const theme = energyThemes[energy];

  const [selectedTopics, setSelectedTopics] = useState(userData.selectedTopics || []);
  const [openGroups, setOpenGroups] = useState([]);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics((prev) => prev.filter((t) => t !== topic));
      const updatedAnswers = { ...subtopicAnswers };
      delete updatedAnswers[topic];
      setUserData({ ...userData, subtopicAnswers: updatedAnswers });
    } else if (selectedTopics.length < 5) {
      setSelectedTopics((prev) => [...prev, topic]);
    } else {
      setShowLimitMessage(true);
      setShake(true);
      setTimeout(() => {
        setShowLimitMessage(false);
        setShake(false);
      }, 1000);
    }
  };

  const toggleGroup = (group) => {
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleClearAll = () => {
    setSelectedTopics([]);
    setOpenGroups([]);
    setUserData({ ...userData, subtopicAnswers: {} });
  };

  const handleSubmit = () => {
    if (selectedTopics.length > 0) {
      setUserData({ ...userData, selectedTopics });
      navigate("/tonightstalktips");
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-[#0a2540] px-4 py-8`}>
      <PageHeader />
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-1">
          {`${userName} — what’s your date into… besides YOU? 😉`}
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

      <div className={`space-y-4 mb-12 ${shake ? "animate-shake" : ""}`}>
        {Object.entries(topicGroups).map(([group, topics]) => (
          <div key={group} className="border border-[#0a2540]/20 rounded-xl bg-white/50">
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
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`w-full py-2 px-4 rounded-full text-sm border flex items-center justify-between transition-all ${
                          selectedTopics.includes(topic)
                            ? "bg-white font-semibold border-blue-500 ring-2 ring-blue-300 shadow-md"
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

      {/* Subtopics */}
      {selectedTopics.length > 0 && (
        <div className="mt-10 border-t border-white/30 pt-6">
          <h3 className="text-center text-xl font-semibold mb-4 text-indigo-700">
            ✨ A little extra magic...
          </h3>
          <p className="text-sm text-center text-gray-500 italic mb-6">
            Click up to 2 subtopics per category to guide what shows up on your News page.
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
                        return; // prevent more than 2
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

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
          Let’s Talk More Tonight →
        </button>
      </div>
    </div>
  );
};

export default Topics;