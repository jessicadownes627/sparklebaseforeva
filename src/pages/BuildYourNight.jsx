// ✅ Full BuildYourNight.jsx with dropdown scrolls fully integrated
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import PageHeader from "../components/PageHeader";
import energyThemes from "../data/energyThemes";
import stateCityOptions from "../data/cityStateOptions";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    key: "relationshipStatus",
    question: "What is your relationship status?",
    options: [
      { label: "First Date", value: "firstDate", message: "New connections—how exciting! ✨" },
      { label: "Dating", value: "dating", message: "Love is in the air! 💕" },
      { label: "Married / Long-Term", value: "longTerm", message: "A love story with chapters. 📚" },
      { label: "Just Friends", value: "justFriends", message: "Friends have the best fun! 🤗" },
    ],
  },
  {
    key: "dateVibe",
    question: "What kind of date would you like?",
    options: [
      { label: "Romantic", value: "romantic", message: "Sparks are flying already! ❤️" },
      { label: "Fun", value: "fun", message: "Laughter guaranteed! 😄" },
      { label: "Chill", value: "chill", message: "Low-key vibes are the best. 😌" },
      { label: "Adventurous", value: "adventurous", message: "Bring on the adventure! 🌟" },
    ],
  },
  {
    key: "foodStyle",
    question: "What kind of food experience are you in the mood for?",
    options: [
      { label: "Keep It Casual", value: "casual", message: "Laid-back and easy—love it! 😎" },
      { label: "A Meal with Ambience", value: "fancy", message: "Ambience makes all the difference. ✨" },
      { label: "Drinks or Dessert", value: "drinks", message: "Sweet choice! 🍰" },
      { label: "Surprise Me", value: "mix", message: "Adventurous! You’re keeping things interesting. 🎲" },
    ],
  },
  {
    key: "timeOfDay",
    question: "When are you heading out?",
    options: [
      { label: "Morning", value: "morning", message: "Rise and shine! ☀️" },
      { label: "Afternoon", value: "afternoon", message: "Perfect timing! 🍹" },
      { label: "Evening", value: "evening", message: "Night owls unite! 🌙" },
    ],
  },
  {
    key: "outfitStyle",
    question: "What's your outfit vibe?",
    options: [
      { label: "Laid-back & Easy", value: "laidback", message: "Effortlessly cool. 😎" },
      { label: "Confident & Sharp", value: "sharp", message: "You’re bringing your A-game! 💪" },
      { label: "Statement Look", value: "statement", message: "Turning heads, we see you! 🔥" },
      { label: "Playful & Polished", value: "playful", message: "Fun and flawless—perfection! 🎉" },
    ],
  },
];


const BuildYourNight = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const energy = userData.energy || "Dreamy ✨";
  const theme = energyThemes[energy];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [city, setCity] = useState(userData.city || "");
  const [state, setState] = useState(userData.state || "");

  const handleSelect = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleOutfitContinue = () => {
    if (answers.outfitStyle) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = () => {
const finalData = { ...userData, ...answers, city, state, energy };
    console.log("🧠 Final userData object to save:", finalData);
    setUserData(finalData);
    navigate("/events");
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} px-4 py-10`}>
      <PageHeader />
      <div className="max-w-xl mx-auto space-y-6">
        {currentIndex > 0 && (
          <p className="text-sm text-center text-gray-500 italic">
            Want to change something? Tap a bubble below to edit.
          </p>
        )}

        {questions.slice(0, currentIndex).map((q, idx) => (
          <motion.button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="w-full text-left bg-white/70 p-4 rounded-xl shadow border hover:bg-purple-50 transition"
          >
            <p className="text-sm mb-1 opacity-70">
              {q.question} <span className="text-xs text-purple-400 ml-1">✏️</span>
            </p>
            <p className="font-semibold">
              {typeof q.options?.[0] === "object"
                ? q.options.find((opt) => opt.value === answers[q.key])?.label
                : answers[q.key]}
            </p>
          </motion.button>
        ))}

    <AnimatePresence mode="wait">
  {currentIndex < questions.length && (
    <motion.div key={questions[currentIndex].key} className="bg-white/90 p-6 rounded-2xl shadow-xl">
      <p className="text-sm text-center mb-2">Question {currentIndex + 1} of {questions.length}</p>
      <h2 className="text-xl text-center font-semibold mb-4">{questions[currentIndex].question}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {questions[currentIndex].options.map((opt) => {
          const label = typeof opt === "object" ? opt.label : opt;
          const value = typeof opt === "object" ? opt.value : opt;
          return (
            <button
              key={value}
              onClick={() => handleSelect(questions[currentIndex].key, value)}
              className={`bg-white text-[#0a2540] border px-4 py-2 rounded-xl text-sm shadow ${answers[questions[currentIndex].key] === value ? "ring-2 ring-purple-400" : ""}`}
            >
              {label}
            </button>
          );
        })}
      </div>
      
      {/* <<< ADD THIS BELOW THE BUTTONS >>> */}
      {answers[questions[currentIndex].key] && (() => {
        const selectedValue = answers[questions[currentIndex].key];
        const selectedOptionObj = questions[currentIndex].options.find(
          opt => (typeof opt === "object" ? opt.value : opt) === selectedValue
        );
        return selectedOptionObj?.message ? (
          <p className="text-xs text-pink-400 mt-4 italic text-center transition-all">
            {selectedOptionObj.message}
          </p>
        ) : null;
      })()}
      {/* <<< END AFFIRMATION MESSAGE >>> */}

      {questions[currentIndex].key === "outfitStyle" && (
        <button onClick={handleOutfitContinue} className="mt-4 w-full py-2 bg-purple-500 text-white rounded-xl">Continue</button>
      )}
      {currentIndex > 0 && (
        <button onClick={handleBack} className="mt-4 text-sm underline text-gray-500 hover:text-purple-600">
          ← Go Back
        </button>
      )}
    </motion.div>
  )}
</AnimatePresence>


        {currentIndex >= questions.length && (
          <motion.div className="bg-white/90 p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-semibold text-center mb-4">Where are we planning this date?</h2>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              className="w-full p-2 mb-4 border rounded"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity("");
              }}
            >
              <option value="">Select a state</option>
              {Object.keys(stateCityOptions).sort().map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {state && (
              <>
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  className="w-full p-2 mb-4 border rounded"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select a city</option>
                  {stateCityOptions[state]?.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </>
            )}

            <button
              onClick={handleFinish}
              disabled={!city || !state}
              className={`w-full py-3 rounded-xl font-semibold text-lg shadow-md transition ${city && state ? "bg-purple-500 text-white" : "bg-white text-gray-400 border"}`}
            >
              ✨ Let’s Plan This Date! ✨
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BuildYourNight;