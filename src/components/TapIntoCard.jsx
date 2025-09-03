// src/components/TapIntoCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import FlipCard from "./FlipCard";
import { getTAPintoHeadlinesForCity } from "../utils/rssFeeds";
import rssCityMap from "../utils/rssFeeds/rssCityMap";

/**
 * TAPinto Flip Card
 * - Finds towns by exact key, label, slug, or hyphenated combos.
 * - Tries multiple query permutations (label, "City, ST", City, slug) until stories are returned.
 * - Dark navy theme on BOTH sides with a subtle violet glow.
 *
 * Props:
 *  - city: string ("City, ST" or "City")
 *  - stateCode?: string ("NJ", "NY", etc.)
 *  - variant?: "flip" | "list" | "spotlight" (default: "flip")
 *  - initialSide?: "front" | "back" (only for flip)
 *  - maxItems?: number (default: 3)
 *  - className?: string (extra classes for the list/back)
 */

// ---------------- helpers ----------------

const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const norm = (s = "") =>
  s.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();

function townUrlFromFeed(feedUrl = "") {
  return feedUrl.replace(/\/articles\.atom.*$/i, "/");
}

function formatDate(isoString) {
  const options = { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" };
  return new Date(isoString).toLocaleString("en-US", options);
}

// -------------- smart resolver -------------

// Normalize Mike’s map once (lowercase keys)
const RSS_CITY_MAP_NORM = Object.fromEntries(
  Object.entries(rssCityMap).map(([k, v]) => [norm(k), v])
);

// Build a searchable index
const RSS_INDEX = Object.entries(RSS_CITY_MAP_NORM).map(([key, value]) => {
  const label = value?.label || "";
  const feedUrl = value?.feedUrl || "";
  const slugMatch = feedUrl.match(/\/towns\/([^/]+)/i);
  const slug = slugMatch ? slugMatch[1] : "";
  return {
    key,                              // normalized "City, ST" from the map
    value,                            // { label, feedUrl, ... }
    _key: key,                        // normalized
    _label: norm(label),              // normalized label
    _slug: slug.toLowerCase(),        // towns/asbury-park -> asbury-park
  };
});

/**
 * Fuzzy + exact finder: handles "City, ST", "City",
 * labels, slugs, and hyphenated/combined towns.
 */
function findTapintoEntrySmart({ city, stateCode }) {
  const rawCity = String(city || "").trim();
  if (!rawCity) return null;

  const parts = rawCity.split(",").map((s) => s.trim());
  const name = parts[0] || "";
  const state = (stateCode || parts[1] || "").trim();

  const cityN = norm(name);
  const stateN = norm(state);

  // 1) exact key: "City, ST" or "City"
  const exactKey = state ? norm(`${name}, ${state}`) : norm(name);
  if (RSS_CITY_MAP_NORM[exactKey]) return RSS_CITY_MAP_NORM[exactKey];

  // 2) label/key/slug contains city term (prefer same state when provided)
  const contains = RSS_INDEX.filter(
    (e) =>
      e._key.includes(cityN) ||
      e._label.includes(cityN) ||
      e._slug.includes(cityN.replace(/\s+/g, "-"))
  );
  const stateFiltered = stateN
    ? contains.filter((e) => e._key.endsWith(`, ${stateN}`) || e._label.endsWith(`, ${stateN}`))
    : contains;

  if (stateFiltered.length) return stateFiltered[0]?.value || null;
  if (contains.length) return contains[0]?.value || null;

  // 3) hyphenated / combined towns like "east-hanover-florham-park"
  const bits = cityN.split(/[\/\-]/).map((b) => b.trim()).filter(Boolean);
  if (bits.length > 1) {
    const hit = RSS_INDEX.find(
      (e) => bits.some((b) => e._key.includes(b) || e._label.includes(b) || e._slug.includes(b))
    );
    if (hit) return hit.value;
  }

  return null;
}

// -------------- shared chrome --------------

const TAP_CARD_CHROME =
  "rounded-2xl bg-[#0b1b34] text-white ring-2 ring-violet-400/60 " +
  "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_80px_-30px_rgba(0,0,0,0.6)] " +
  "border border-white/10";

// -------------- component -------------------

const TapIntoCard = ({
  city,
  stateCode,
  variant = "flip",
  initialSide = "front",
  maxItems = 3,
  className = "",
}) => {
  const [headlines, setHeadlines] = useState([]);
  const [resolvedLabel, setResolvedLabel] = useState("");

  const tapintoEntry = useMemo(
    () => findTapintoEntrySmart({ city, stateCode }),
    [city, stateCode]
  );

  const tapintoLink = useMemo(
    () => (tapintoEntry ? townUrlFromFeed(tapintoEntry.feedUrl) : null),
    [tapintoEntry]
  );

  useEffect(() => {
    let cancelled = false;

    async function tryLoad() {
      // Build candidates in most-likely-first order
      const raw = String(city || "").trim();
      const parts = raw.split(",").map((s) => s.trim());
      const name = parts[0] || "";
      const st = (stateCode || parts[1] || "").trim();
      const label = tapintoEntry?.label || raw;

      const slugMatch = (tapintoEntry?.feedUrl || "").match(/\/towns\/([^/]+)/i);
      const slug = (slugMatch ? slugMatch[1] : "").replace(/-/g, " ");

      const seen = new Set();
      const candidates = [];
      const add = (c) => {
        const k = `${(c.city || "").toLowerCase()}|${(c.state || "").toLowerCase()}`;
        if (!seen.has(k)) {
          seen.add(k);
          candidates.push(c);
        }
      };

      // Most specific → broad
      add({ city: label, state: st });
      if (st) add({ city: `${name}`, state: st });
      if (st) add({ city: `${name}, ${st}` });
      add({ city: label });
      add({ city: name });
      if (slug) {
        add({ city: slug, state: st });
        add({ city: slug });
      }

      for (const c of candidates) {
        try {
          const items = await getTAPintoHeadlinesForCity(c.city, c.state);
          if (!cancelled && Array.isArray(items) && items.length > 0) {
            setResolvedLabel(label);
            setHeadlines(items);
            return;
          }
        } catch {
          // keep trying
        }
      }

      // Fallback: nothing returned, keep label + View All
      if (!cancelled) {
        setResolvedLabel(label);
        setHeadlines([]);
      }
    }

    if (tapintoEntry || city) tryLoad();
    return () => {
      cancelled = true;
    };
  }, [city, stateCode, tapintoEntry]);

  // If we truly can't resolve any TAPinto town, render nothing
  if (!tapintoEntry) return null;

  // ----- UI pieces -----
  const SpotlightFront = (
    <div
      className={`${TAP_CARD_CHROME} p-6 text-center h-full flex flex-col items-center justify-center`}
    >
      <h3 className="text-2xl font-extrabold tracking-wide mb-1 drop-shadow">
        TAPinto Spotlight 🗞️
      </h3>
     {resolvedLabel ? (
  <p className="text-2xl font-bold text-pink-300 drop-shadow-md tracking-wide mb-2">
    {resolvedLabel}
  </p>
) : null}

      <p className="text-sm italic text-slate-200">
        Trusted headlines from your local TAPinto newsroom
      </p>
      <p className="text-[11px] italic text-slate-400 mt-3">
        Click to see what’s happening tonight →
      </p>
      <p className="text-[10px] italic text-orange-300 mt-6">
        🧡 Thank you to Mike Shapiro and the TAPinto team
      </p>
    </div>
  );

  const ListBack = (
    <div className={`${TAP_CARD_CHROME} p-5 text-left space-y-4 ${className}`}>
      <h4 className="text-md font-bold text-orange-300">
        What’s Happening in {String(resolvedLabel || city).replace(/^tapinto\s+/i, "")}? 📰
      </h4>

      <div className="flex flex-col gap-3">
        {headlines.length > 0 ? (
          headlines.slice(0, maxItems).map((story, i) => (
            <div key={i} className="pb-3 border-b border-white/10 last:border-b-0">
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="block">
                <h4 className="text-sm font-semibold leading-snug underline-offset-2 hover:underline">
                  {decodeHtml(story.title)}
                </h4>
              </a>
              {story.publishedAt && (
                <p className="text-[11px] text-slate-400 italic mt-1">
                  🗓️ {formatDate(story.publishedAt)}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="italic text-sm text-slate-300">
            No current stories available for this area.
          </p>
        )}
      </div>

      {tapintoLink && (
        <a
          href={tapintoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[12px] text-indigo-300 hover:underline pt-2"
        >
          View All Headlines →
        </a>
      )}
    </div>
  );

  // Variants
  if (variant === "list") return ListBack;
  if (variant === "spotlight") return <div className={TAP_CARD_CHROME}>{SpotlightFront}</div>;

  // Default: flip card
  return <FlipCard initialSide={initialSide} front={SpotlightFront} back={ListBack} />;
};

export default TapIntoCard;
