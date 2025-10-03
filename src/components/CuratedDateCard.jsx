import React from "react";
import { useUser } from "../context/UserContext.jsx";

const CuratedDateCard = ({
  userName = "you",
  dateName = "your date",
  timeOfDay = "evening",
  dateVibe = "fun",
  foodStyle = "casual",
  planText = "The plan is on the way…"
}) => {
  const { userData } = useUser();
  const { city = "" } = userData || {};

  // ✨ Icons for visual punch
  const vibeIcon = { romantic: "❤️", fun: "🎉", chill: "🌙", adventurous: "🌟" }[dateVibe.toLowerCase()] || "✨";
  const foodIcon = { casual: "🍔", fancy: "🍷", drinks: "🍸", mix: "🎲" }[foodStyle.toLowerCase()] || "🍽️";
  const timeIcon = { morning: "☀️", afternoon: "🍹", evening: "🌃" }[timeOfDay.toLowerCase()] || "🕒";

  // 📝 Plan text handling
  const planIdeas = Array.isArray(planText)
    ? planText
    : typeof planText === "string"
    ? planText.split(".").map(s => s.trim()).filter(s => s.length > 5)
    : [];

  // 📩 Share logic
  const handleShare = () => {
    const textToShare = `✨ Date Night Plan ✨\n${userName} + ${dateName}\n${timeIcon} ${timeOfDay} | ${vibeIcon} ${dateVibe} | ${foodIcon} ${foodStyle}\n${city ? `📍 ${city}\n` : ""}💡 ${planIdeas[0] || "Plan coming soon!"}`;

    if (navigator.share) {
      navigator.share({
        title: "Talk More Tonight — Date Plan",
        text: textToShare,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(textToShare);
      alert("✅ Plan copied to clipboard!");
    }
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #ffffff 70%, #f3f0ff 100%)",
      }}
    >
      {/* 🔸 Tear-off ticket strip */}
      <div className="bg-indigo-600 text-white text-center py-1 text-xs font-semibold tracking-wider relative">
        ✨ TONIGHT’S GAME PLAN ✨
        <div
          className="absolute bottom-[-6px] left-0 w-full border-t-2 border-dashed border-indigo-300"
          style={{ height: "6px" }}
        />
      </div>

      <div className="p-4 space-y-4 text-[#0a2540] text-sm">
        {/* Greeting */}
        <p className="font-semibold">
          {userName}, you nailed the setup for your date with {dateName}.  
          Here’s the vibe you locked in 💫
        </p>

        {/* Summary bullets */}
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3 text-sm space-y-1">
          <p>{timeIcon} <span className="font-semibold capitalize">{timeOfDay}</span></p>
          <p>{vibeIcon} <span className="font-semibold capitalize">{dateVibe}</span></p>
          <p>{foodIcon} <span className="font-semibold capitalize">{foodStyle}</span></p>
          {city && <p>📍 {city}</p>}
        </div>

        {/* Plan headline */}
        {planIdeas.length > 0 ? (
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-4 rounded-lg shadow text-center">
            <p className="text-base font-bold text-purple-800 leading-snug">
              {planIdeas[0]}
            </p>
            <p className="text-xs italic text-purple-600 mt-2">
              You’ve got the plan — tonight’s story is just beginning. ✨
            </p>
          </div>
        ) : (
          <p className="italic text-gray-500 text-center">
            We didn’t find the perfect combo yet — but you’ll figure it out 😉
          </p>
        )}

        {/* Share button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          📩 Share This Plan
        </button>
      </div>
    </div>
  );
};

export default CuratedDateCard;



