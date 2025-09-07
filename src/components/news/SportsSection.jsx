import React from "react";

export default function SportsSection({ bigGames = [] }) {
  return (
    <section className="rounded-2xl px-6 py-6 bg-[#1a1740] shadow">
      <h3 className="text-xl font-bold mb-4">🏟️ Tonight in Sports</h3>

      {/* ESPN Schedules */}
      <ul className="space-y-2 mb-6">
        <li>
          <a href="https://www.espn.com/mlb/schedule" target="_blank" rel="noreferrer" className="underline">
            ⚾ Baseball Schedule →
          </a>
        </li>
        <li>
          <a href="https://www.espn.com/nfl/schedule" target="_blank" rel="noreferrer" className="underline">
            🏈 Football Schedule →
          </a>
        </li>
        <li>
          <a href="https://www.espn.com/nba/schedule" target="_blank" rel="noreferrer" className="underline">
            🏀 Basketball Schedule →
          </a>
        </li>
        <li>
          <a href="https://www.espn.com/nhl/schedule" target="_blank" rel="noreferrer" className="underline">
            🏒 Hockey Schedule →
          </a>
        </li>
      </ul>

      {/* Big Games */}
      <h4 className="text-lg font-semibold mb-4">🏆 Big Games Ahead</h4>
      <div className="space-y-3">
        {Array.isArray(bigGames) && bigGames.length > 0 ? (
          bigGames.map((game, i) => (
            <div key={i} className="bg-[#2a2360] p-4 rounded-lg shadow text-sm">
              <p className="font-bold">{game.title}</p>
              {game.date && <p className="text-gray-300">{game.date}</p>}
              {game.description && <p className="text-gray-400 italic">{game.description}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No big games available</p>
        )}
      </div>
    </section>
  );
}
