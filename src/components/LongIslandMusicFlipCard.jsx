// src/components/LongIslandMusicFlipCard.jsx
import React, { useEffect, useState } from "react";
import FlipCard from "./FlipCard";
import { fetchLongIslandMusic } from "../utils/fetchLongIslandMusic";
import { longIslandTowns } from "../data/longIslandTowns";

const LongIslandMusicFlipCard = ({ town }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!town) return;

    const isLongIslandTown = longIslandTowns
      .map(t => t.toLowerCase())
      .includes(town.toLowerCase());

    if (!isLongIslandTown) {
      setEvents([]);
      return;
    }

    fetchLongIslandMusic()
      .then(allEvents => {
        const filteredEvents = allEvents.filter(ev =>
          longIslandTowns
            .map(t => t.toLowerCase())
            .includes(ev.Location.toLowerCase())
        );
        setEvents(filteredEvents);
      })
      .catch(() => {
        setEvents([]);
      });
  }, [town]);

  if (!events.length) return null;

  return (
    <FlipCard
      disableFlipOnBack={true}   // <-- This disables flipping on the back
      front={
        <div className="text-center p-4">
          <h3 className="text-xl font-bold mb-2">🌟 Local Music and More!</h3>
          <p className="text-sm italic">Discover live gigs & events happening soon!</p>
        </div>
      }
      back={
        <div className="p-4 text-sm space-y-2 text-green-700 bg-green-50 rounded-lg border border-green-200 shadow-sm">
          {events.map((event, i) => (
            <div key={i} className="border-b border-green-300 pb-2 last:border-0">
              <p className="font-semibold text-green-900">{event.Band}</p>
              <p>{event.Venue}</p>
              <p className="italic text-xs text-green-600">{event.Date}</p>
              {event.Url && (
                <a
                  href={event.Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline text-xs hover:text-indigo-800"
                >
                  More Info
                </a>
              )}
            </div>
          ))}
        </div>
      }
    />
  );
};

export default LongIslandMusicFlipCard;
