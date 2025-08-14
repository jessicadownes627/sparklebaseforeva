// src/pages/Welcome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

const energyStyles = {
  "Dreamy ✨": {
    button: "bg-purple-200 text-purple-800 border-purple-300",
    action: "bg-purple-500 hover:bg-purple-600 text-white",
  },
  "Bold 🔥": {
    button: "bg-orange-200 text-red-800 border-orange-300",
    action: "bg-red-500 hover:bg-red-600 text-white",
  },
  "Chill 🌙": {
    button: "bg-blue-200 text-blue-800 border-blue-300",
    action: "bg-blue-500 hover:bg-blue-600 text-white",
  },
};

const Welcome = () => {
  const navigate = useNavigate();
  const { setUserData } = useUser();

  const [userName, setUserName] = useState("");
  const [dateName, setDateName] = useState("");
  const [energy, setEnergy] = useState("");
  const [when, setWhen] = useState("");

  const isComplete = userName && dateName && energy && when;

  const handleStart = () => {
    if (!isComplete) return;
    setUserData({ userName, dateName, energy, when });
    navigate("/build-your-night");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 text-midnight flex flex-col justify-center items-center px-4 py-10">
      {/* Keep your original header + subhead */}
      <h1 className="text-5xl font-script drop-shadow-glow text-center mb-2">
        Talk More Tonight
      </h1>
      <p className="text-center text-base mb-6 opacity-80 italic">
        ✨ Talk to us... before you talk to them. ✨
      </p>

      <motion.div
        className="w-full max-w-md glass-card rounded-3xl px-6 py-8 backdrop-blur-md bg-white/30 shadow-xl border border-white/40 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <input
          type="text"
          placeholder="Your name (e.g. Lorraine)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 bg-white/60 backdrop-blur-sm"
        />
        <input
          type="text"
          placeholder="Their name (e.g. George)"
          value={dateName}
          onChange={(e) => setDateName(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 bg-white/60 backdrop-blur-sm"
        />

        <div>
          <p className="text-sm italic text-center opacity-70 mb-2">
            When is your date?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {["Tonight", "Planning Ahead"].map((option) => (
              <button
                key={option}
                onClick={() => setWhen(option)}
                className={`py-2 rounded-xl border font-medium transition text-sm ${
                  when === option
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white/60 backdrop-blur-sm text-black border-gray-300 hover:bg-opacity-80"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-center mb-2 font-semibold">
            How are you feeling right now?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["Dreamy ✨", "Bold 🔥", "Chill 🌙"].map((option) => (
              <button
                key={option}
                onClick={() => setEnergy(option)}
                className={`p-3 rounded-xl border text-center transition shadow-sm text-sm ${
                  energy === option
                    ? energyStyles[option].button
                    : "bg-white/60 backdrop-blur-sm text-black hover:bg-opacity-80"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!isComplete}
          className={`w-full px-4 py-3 rounded-xl font-semibold text-center transition shadow-md text-lg ${
            isComplete
              ? energyStyles[energy]?.action + " animate-pulseSlow"
              : "bg-white text-midnight border border-pink-300 opacity-50 cursor-not-allowed"
          }`}
        >
          Let’s Talk
        </button>

        {/* subtle, pretty disclaimer */}
        <p className="text-[11px] text-center text-violet-600 mt-3 leading-snug">
          <span className="font-medium text-violet-700">Heads-up:</span>{" "}
          some news and topics may reference alcohol, gambling, or other{" "}
          <span className="italic">real-world themes</span>.{" "}
          <span className="underline decoration-dotted underline-offset-2">
            Take what serves you
          </span>
          , skip what doesn’t. <span aria-hidden>💖</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Welcome;
