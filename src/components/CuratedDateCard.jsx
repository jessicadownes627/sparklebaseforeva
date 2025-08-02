import React from "react";
import { useUser } from "../context/UserContext.jsx";

const CuratedDateCard = ({
  userName = "you",
  dateName = "your date",
  relationshipStatus = "dating",
  timeOfDay = "evening",
  dateVibe = "chill",
  foodStyle = "casual",
  nightType = "classic",
  planText = "The plan is on the way…"
}) => {
  const { userData } = useUser();
  const { city = "" } = userData || {};

  const vibeSummary = `${dateVibe?.toLowerCase()} ${timeOfDay} with ${
    foodStyle === "drinks"
      ? "drinks"
      : foodStyle === "mix"
      ? "a mix of styles"
      : `${foodStyle} food`
  }`;

  const greeting = `Hey ${userName}, you made such great choices for your date with ${dateName}! Here’s your custom date plan: ✨`;

  // ✅ Handles both arrays and strings now!
  const planIdeas = Array.isArray(planText)
    ? planText
    : typeof planText === "string"
    ? planText.split(".").map(s => s.trim()).filter(s => s.length > 5)
    : [];

  return (
    <div className="text-left space-y-4 text-sm text-[#0a2540]">
      <p className="font-semibold">{greeting}</p>
      <p className="italic">
        This {vibeSummary} called for something special — so we planned it.
      </p>

    {planIdeas.length > 0 ? (
  <div className="my-4">
    <div className="bg-green-50 border-l-4 border-green-400 px-4 py-4 rounded-lg shadow-sm">
      <p className="text-sm font-bold text-green-700 font-serif flex items-center">
        <span className="mr-2">💡</span>
        {planIdeas[0]}
      </p>
    </div>
  </div>
) : (
  <p className="italic text-gray-500">
    We didn’t find the perfect combo yet — but you’ll figure it out 😉
  </p>
)}

      {city && (
        <p className="text-sm italic text-gray-600 pt-2">
          In {city}, that kind of energy might mean something a little different — and that’s what makes it yours.
        </p>
      )}
    </div>
  );
};

export default CuratedDateCard;
