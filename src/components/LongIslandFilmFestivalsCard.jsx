// src/components/LongIslandFilmFestivalsCard.jsx

import React, { useState } from "react";
import longIslandFilmFestivals from "../data/longIslandFilmFestivals";
import "../components/FlipCard.css"; // Make sure this is already set up

const LongIslandFilmFestivalsCard = () => {
  const [flipped, setFlipped] = useState(false);
  const handleClick = () => setFlipped(!flipped);

  return (
    <div className="flip-card w-[320px] h-[380px]" onClick={handleClick}>
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        {/* FRONT */}
       <div className="flip-card-front bg-[#0a2540] text-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-center">

          <h2 className="text-lg font-bold mb-2 drop-shadow-glow">
            🎬 Long Island Film Festivals
          </h2>
          <p className="text-sm text-indigo-200">
            Explore indie gems and local premieres lighting up the island this summer.
          </p>
          <p className="text-xs text-indigo-300 mt-3 italic">
            Tap to see what’s playing →
          </p>
        </div>

        {/* BACK */}
        <div className="flip-card-back bg-white text-[#0a2540] p-4 sm:p-5 rounded-xl shadow-lg overflow-y-auto max-h-[380px] sm:max-h-[420px] text-sm">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Upcoming Film Festivals
          </h2>
          {longIslandFilmFestivals.map((festival, index) => (
            <div key={index} className="mb-4 border-t pt-2">
              <h3 className="font-bold">{festival.name}</h3>
              <p className="italic text-sm">
                {festival.dateRange} – {festival.location}
              </p>
              <p className="text-sm my-1">{festival.blurb}</p>
              {/* Special shoutout for Stony Brook */}
              {festival.name.includes("Stony Brook") && (
                <p className="text-sm mt-2 italic">
                  🎟️ Dinner & a Movie — passholders receive discounts at local restaurants like the intimate Elaine's in Setauket or match the Festival's international flair and grab a bite to eat al fresco at Saghar in Port Jefferson.
                </p>
              )}
              <a
                href={festival.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongIslandFilmFestivalsCard;