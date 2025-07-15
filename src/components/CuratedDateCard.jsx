// src/components/CuratedDateCard.jsx
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
  const vibeSummary = `${dateVibe?.toLowerCase()} ${timeOfDay} with ${
    foodStyle === "drinks"
      ? "drinks"
      : foodStyle === "mix"
      ? "a mix of styles"
      : `${foodStyle} food`
  }`;

  const greeting = `Hey ${userName}, you made such great choices for your date with ${dateName}! Here’s your custom date plan: ✨`;

  const { userData } = useUser();
  const { city = "" } = userData || {};

  return (
    <div className="text-left space-y-4 text-sm text-[#0a2540]">
      <p className="font-semibold">{greeting}</p>
      <p className="italic">{`This ${vibeSummary} called for something special — so we planned it.`}</p>

      <p className="whitespace-pre-wrap">{planText}</p>

      {city && (
        <p className="text-sm italic text-gray-600">
          In {city}, that kind of energy might mean something a little different — and that’s what makes it yours.
        </p>
      )}
    </div>
  );
};

export default CuratedDateCard;
