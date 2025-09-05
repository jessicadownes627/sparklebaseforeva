// src/components/news/BrighterSideSection.jsx
import React from "react";

const BrighterSideSection = ({ brighterSide }) => {
  if (!brighterSide || brighterSide.length === 0) return null;

  return (
    <section className="rounded-2xl px-6 py-6 bg-[#0d1423] shadow max-w-5xl mx-auto mb-10">
      <h3 className="text-xl font-bold mb-4">🌟 The Brighter Side</h3>
      <ul className="space-y-2">
        {brighterSide.map((story, i) => (
          <li key={i}>
            {story.url ? (
              <a
                href={story.url}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-yellow-300"
              >
                {story.title}
              </a>
            ) : (
              <span>{story.title}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BrighterSideSection;
