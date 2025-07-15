import React, { useEffect, useState } from "react";
import { getTAPintoHeadlinesForCity } from "../utils/rssFeeds";
import FlipCard from "./FlipCard";

const TapIntoCard = ({ city }) => {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const stories = await getTAPintoHeadlinesForCity(city);
      setHeadlines(stories || []);
    };
    fetchData();
  }, [city]);

  return (
    <FlipCard
front={
  <div className="p-6 bg-[#0a2540] text-white text-center h-full flex flex-col items-center justify-center">
    <h3 className="text-2xl font-extrabold tracking-wide mb-1 drop-shadow">TAPinto Spotlight 🗞️</h3>
    <p className="text-lg font-bold text-pink-300 mb-1 drop-shadow">{city}</p>
    <p className="text-sm italic text-gray-300">Trusted headlines from your local TAPinto newsroom</p>
    <p className="text-[11px] italic text-gray-400 mt-3">Click to see what’s happening tonight →</p>
    <p className="text-[10px] italic text-orange-300 mt-6">
      🧡 Thank you to Mike Shapiro and the TAPinto team
    </p>
  </div>
}

      back={
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 text-left space-y-4 shadow-sm">
          <h4 className="text-md font-bold text-[#0a2540] mb-1">Top Headlines</h4>
          {headlines.length > 0 ? (
            <>
              {headlines.slice(0, 5).map((story, i) => (
                <div key={i} className="border-b pb-3">
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h4 className="text-sm font-semibold text-[#0a2540] underline hover:text-blue-600">
                      {story.title}
                    </h4>
                  </a>
                  {story.publishedAt && (
                    <p className="text-[11px] text-gray-400 italic mt-1">
                      📅 {story.publishedAt}
                    </p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p className="italic text-sm text-gray-600">
              No current stories available for this area.
            </p>
          )}
          <div className="pt-4 text-xs italic text-[#6b7280] border-t">
            Our Endless Thanks to the TAPinto Team 🧡 
          </div>
        </div>
      }
    />
  );
};

export default TapIntoCard;

