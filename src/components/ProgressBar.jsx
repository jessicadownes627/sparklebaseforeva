// src/components/ProgressBar.jsx

import React from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProgressBar = () => {
  const location = useLocation();
  const { userData } = useUser();
  const energy = userData.energy || "Dreamy ✨";

  const energyBarColors = {
    "Dreamy ✨": "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400",
    "Bold 🔥": "bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500",
    "Chill 🌙": "bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-400",
  };

  const progressWidths = {
    "/": "w-[0%]",
    "/build": "w-[20%]",
    "/topics": "w-[40%]",
    "/tonightstalktips": "w-[60%]",
    "/news": "w-[80%]",
    "/events": "w-[100%]",
  };

  return (
    <div className="h-2 bg-gray-200 rounded-full mx-auto mt-4 mb-6 max-w-xs shadow-inner overflow-hidden">
      <div
        className={`h-2 ${energyBarColors[energy]} rounded-full ${
          progressWidths[location.pathname] || "w-[0%]"
        } transition-all duration-700`}
      />
    </div>
  );
};

export default ProgressBar;
