import React, { useEffect, useState } from "react";
import { getTAPintoHeadlinesForCity } from "../utils/rssFeeds";
import FlipCard from "./FlipCard";

// 🔧 Fix weird HTML entities like &quot; and &#39;
const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const TapIntoCard = ({ city }) => {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const stories = await getTAPintoHeadlinesForCity(city);
      setHeadlines(stories || []);
    };
    fetchData();
  }, [city]);

  const formatDate = (isoString) => {
  const options = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

  return new Date(isoString).toLocaleString("en-US", options);
};


  return (
    <FlipCard
      front={
        <div className="p-6 bg-[#0a2540] text-white text-center h-full flex flex-col items-center justify-center">
          <h3 className="text-2xl font-extrabold tracking-wide mb-1 drop-shadow">
            TAPinto Spotlight 🗞️
          </h3>
          <p className="text-2xl font-bold text-pink-300 drop-shadow-md tracking-wide mb-1 animate-pulse">
            {city}
          </p>
          <p className="text-sm italic text-gray-300">
            Trusted headlines from your local TAPinto newsroom
          </p>
          <p className="text-[11px] italic text-gray-400 mt-3">
            Click to see what’s happening tonight →
          </p>
          <p className="text-[10px] italic text-orange-300 mt-6">
            🧡 Thank you to Mike Shapiro and the TAPinto team
          </p>
        </div>
      }
      back={
  <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 text-left shadow-sm space-y-4">
<h4 className="text-md font-bold text-orange-600">
  What’s Happening in {city}? 📰
</h4>




          <div className="flex flex-col gap-3">
            {headlines.length > 0 ? (
              headlines.slice(0, 3).map((story, i) => (
                <div key={i} className="pb-2 border-b last:border-b-0">
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h4 className="text-sm font-semibold text-[#0a2540] underline hover:text-blue-600 leading-snug">
                      {decodeHtml(story.title)}
                    </h4>
                  </a>
                  {story.publishedAt && (
                    <p className="text-[11px] text-gray-400 italic mt-1">
  🗓️ {formatDate(story.publishedAt)}
</p>

                  )}
                </div>
              ))
            ) : (
              <p className="italic text-sm text-gray-600">
                No current stories available for this area.
              </p>
            )}
          </div>

          <a
            href={`https://www.tapinto.net/towns/${city.toLowerCase().replace(/\s+/g, '-')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[12px] text-blue-600 hover:underline pt-2"
          >
            View All Headlines →
          </a>
        </div>
      }
    />
  );
};

export default TapIntoCard;
