// src/components/FlipCard.js
import React, { useState } from "react";
import "./FlipCard.css";

const FlipCard = ({ front, back, disableFlipOnBack = false }) => {
  const [flipped, setFlipped] = useState(false);

  const energy = localStorage.getItem("energy") || "Dreamy ✨";
  const borderColors = {
    "Dreamy ✨": "#7f5af0",
    "Bold 🔥": "#ff3b30",
    "Chill 🌙": "#007aff",
  };
  const borderColor = borderColors[energy] || "#7f5af0";

  const handleClick = (e) => {
    // If card is flipped and clicking the back, don't flip if disabled
    if (flipped && disableFlipOnBack) return;
    setFlipped(!flipped);
  };

  return (
    <div className="flip-card" onClick={handleClick}>
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        <div
          className="flip-card-front"
          style={{
            backgroundColor: "#0a2540",
            color: "white",
            borderColor,
            borderWidth: "4px",
            borderStyle: "solid",
            borderRadius: "1rem",
            padding: "1.5rem",
            minHeight: "500px",
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: "0.5rem"
          }}
        >
          {front}
        </div>

        <div
          className="flip-card-back"
          style={{
            backgroundColor: "white",
            color: "#0a2540",
            padding: "1.5rem",
            borderRadius: "1rem",
            minHeight: "500px",
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "left"
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
