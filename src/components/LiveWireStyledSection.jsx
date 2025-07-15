
import React from "react";

const LiveWireStyledSection = ({ headlinesByTopic }) => {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-bold text-[#0a2540] mb-2">⚡ LiveWire</h2>
      <p className="text-sm italic text-gray-600 mb-4">
        These headlines are based on your topic picks — not every article will be a perfect match… kinda like dating.
      </p>

      {Object.entries(headlinesByTopic).map(([topic, stories]) => (
        <div key={topic} className="mb-6">
          <h3 className="text-md font-bold text-[#0a2540] mb-2">{topic}</h3>
          <div className="space-y-4">
            {stories.slice(0, 2).map((story, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-gray-50 transition"
                >
                  <h4 className="text-md font-bold text-[#0a2540] underline hover:text-blue-600 mb-1">
                    {story.title}
                  </h4>
                  <p className="text-sm text-gray-700">{story.description}</p>
                </a>
                <p className="text-xs text-gray-400 italic mt-2">📅 {story.publishedAt}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveWireStyledSection;