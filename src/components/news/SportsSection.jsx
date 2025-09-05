// src/components/news/SportsSection.jsx
import React from "react";
import { SPORT_KEYS, SPORT_EMOJIS } from "../../utils/sportsHelpers";

const ESPN_SCHEDULES = {
  Baseball: "https://www.espn.com/mlb/schedule",
  Football: "https://www.espn.com/nfl/schedule",
  Basketball: "https://www.espn.com/nba/schedule",
  Hockey: "https://www.espn.com/nhl/schedule",
  Golf: "https://www.espn.com/golf/schedule",
  Olympics: "https://olympics.com/en/news",
  "College Sports": "https://www.espn.com/college-sports/",
  Soccer: "https://www.espn.com/soccer/schedule",
};

const SportsSection = ({ bigGames }) => (
  <section className="rounded-2xl px-6 py-6 bg-[#1a1740] shadow">
    <h3 className="text-xl font-bold text-yellow-300 mb-4 drop-shadow">
      🏟️ Tonight in Sports
    </h3>
    <ul className="space-y-2 mb-6">
      {SPORT_KEYS.map((sport) => (
        <li key={sport}>
          <a
            href={ESPN_SCHEDULES[sport]}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {SPORT_EMOJIS[sport]} {sport} Schedule →
          </a>
        </li>
      ))}
    </ul>
    <h4 className="text-lg font-semibold mb-4">🏆 Big Games Ahead</h4>
    <div className="space-y-3">
      {bigGames.map((game, i) => (
        <div key={i} className="bg-[#2a2360] p-4 rounded-lg shadow text-sm">
          <p className="font-bold">{game.Event}</p>
          <p className="text-gray-300">
            {new Date(game["Date(s)"]).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-400 italic">
            {SPORT_EMOJIS[game.Sport] || ""} {game.Sport}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default SportsSection;
