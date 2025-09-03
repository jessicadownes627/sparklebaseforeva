// src/pages/News.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import TapIntoCard from "../components/TapIntoCard";
import confetti from "canvas-confetti";

// Sheets + utils
import { fetchHotSheetFromSheet } from "../utils/fetchHotSheetFromSheet";
import { fetchThingsWeLoveFromSheet } from "../utils/fetchThingsWeLoveFromSheet";
import { fetchBigGamesFromSheet } from "../utils/fetchBigGamesFromSheet";
import { getTAPintoHeadlinesForCity } from "../utils/rssFeeds";
import { fetchDateWorthyHeadlines } from "../news/fetchDateWorthyHeadlines";
import { rerankWithLocation } from "../utils/localBoost";

// 🔒 keep your curated fallbacks/local data
import {
  newsKeywordMap as localKeywordMap,
  badWordsByTopic as localBadWords,
} from "../data/newsKeywordMap";

import conversationDeck from "../data/conversationDeck";
import topicEmojiMap from "../data/topicEmojiMap";
import pocketCompanionDeck from "../data/pocketCompanionDeck";
import cityTeamMap from "../data/cityTeamMap";
import thingsWeLoveFallback from "../data/thingsWeLoveFallback";
import bigGamesFallback from "../data/bigGamesFallback";
import DateNightFunSection from "../components/DateNightFunSection";
import curatedFallbacksLocal from "../data/curatedFallbacks";

// ⭐ NEW: smarter live fetcher (title-focused + trusted domains + date-worthiness)
import { fetchDateWorthyHeadlines } from "../news/fetchDateWorthyHeadlines";

/* =========================================
   CONFIG
========================================= */
const TOPIC_MAX = 4;            // items per topic
const CURATED_RESERVE = 1;      // keep at least this many curated per topic
const CACHE_VERSION = "v6-dateworthy-title-domains";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h

/* =========================================
   HELPERS
========================================= */
async function getNewsApiKey() {
  const isNative =
    typeof navigator !== "undefined" && navigator.product === "ReactNative";
  if (isNative) {
    try {
      const { default: Constants } = await new Function("m", "return import(m)")(
        "expo-constants"
      );
      return (
        Constants?.expoConfig?.extra?.newsdataKey ||
        Constants?.manifest?.extra?.newsdataKey ||
        ""
      );
    } catch {}
  }
  return (
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_NEWSDATA_API_KEY) ||
    (typeof process !== "undefined" && process?.env?.VITE_NEWSDATA_API_KEY) ||
    ""
  );
}

// Pick a random item safely
const getRandom = (arr = [], fallback = "") =>
  Array.isArray(arr) && arr.length
    ? arr[Math.floor(Math.random() * arr.length)]
    : fallback;

const stripEmoji = (s = "") =>
  s
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDEFF])/g,
      ""
    )
    .trim();

const stripHtml = (s = "") =>
  String(s).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const snippet = (s = "", max = 110) => {
  const clean = stripHtml(s);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + "…";
};

const displayTopicLabel = (key, selectedTopics = []) =>
  selectedTopics.find((t) => stripEmoji(t) === key) || key;

// versioned localStorage cache
const getCache = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return fallback;
    const { v, ts, data } = JSON.parse(raw);
    if (v !== CACHE_VERSION) return fallback;
    if (!ts || Date.now() - ts > CACHE_TTL_MS) return fallback;
    return data;
  } catch {
    return fallback;
  }
};
const setCache = (k, data) => {
  try {
    localStorage.setItem(k, JSON.stringify({ v: CACHE_VERSION, ts: Date.now(), data }));
  } catch {}
};

const safeSplit = (val) =>
  Array.isArray(val) ? val : val?.split ? val.split(/[,•\n]/) : [];

function normalizeCityString(input) {
  const s = String(input || "").trim();
  if (!s) return { cityName: "", state: "", label: "" };
  const parts = s.split(",").map((p) => p.trim());
  let cityName = "";
  let state = "";
  if (parts.length === 2) {
    const [a, b] = parts;
    if (a.length <= 3 && /^[a-z]{2}$/i.test(a)) {
      state = a.toUpperCase();
      cityName = b;
    } else if (b.length <= 3 && /^[a-z]{2}$/i.test(b)) {
      cityName = a;
      state = b.toUpperCase();
    } else {
      cityName = a;
      state = b.toUpperCase();
    }
  } else {
    cityName = s;
  }
  const label = state ? `${cityName}, ${state}` : cityName;
  return { cityName, state, label };
}

const isDev =
  (typeof __DEV__ !== "undefined" && __DEV__) ||
  (typeof import.meta !== "undefined"
    ? import.meta.env?.MODE !== "production"
    : typeof process !== "undefined"
    ? process.env?.NODE_ENV !== "production"
    : false);

// Dedupe helpers compatible with your StoryCard
function canonicalUrl(u = "") {
  try {
    const url = new URL(u);
    return url.origin + url.pathname;
  } catch {
    return String(u || "").split("?")[0];
  }
}
function titleSig(t = "") {
  return String(t)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(a|an|the|and|or|to|of|in|on|for|with|by|from|at|is|are|be|was|were|as|it|this|that)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 12)
    .join(" ");
}
function dedupePushFactory() {
  const seenUrls = new Set();
  const seenTitles = new Set();
  return (arr, item) => {
    const cu = canonicalUrl(item?.url || item?.link || "");
    const ts = titleSig(item?.title || "");
    if (cu && seenUrls.has(cu)) return false;
    if (ts && seenTitles.has(ts)) return false;
    if (cu) seenUrls.add(cu);
    if (ts) seenTitles.add(ts);
    arr.push(item);
    return true;
  };
}

// Sports emojis
function getSportEmoji(sport) {
  if (!sport) return "🏅";
  const foundKey = Object.keys(topicEmojiMap).find((key) =>
    key.toLowerCase().startsWith(String(sport).toLowerCase())
  );
  return foundKey ? topicEmojiMap[foundKey] : "🏅";
}

const sportsSchedules = [
  { league: "Baseball", link: "https://www.espn.com/mlb/schedule" },
  { league: "Football", link: "https://www.espn.com/nfl/schedule" },
  { league: "Basketball", link: "https://www.espn.com/nba/schedule" },
  { league: "Hockey", link: "https://www.espn.com/nhl/schedule" },
];

// Nearby TAPinto alias list (expandable)
const TAPINTO_CITY_ALIASES = {
  "coconut creek": ["coral springs", "parkland", "margate", "pompano beach", "deerfield beach", "broward county"],
  "coral springs": ["parkland", "coconut creek"],
};
const withState = (names = [], state = "") =>
  state ? names.map((n) => `${n}, ${state}`) : names;

// Reliability helpers
const lc = (s = "") => String(s).toLowerCase();
const includesAny = (txt = "", terms = []) => terms.some((t) => txt.includes(lc(t)));

// Pro team keywords (MLB/NFL/NBA/NHL)
const MLB_TEAM_KEYWORDS = [
  "MLB","Major League Baseball","Yankees","Dodgers","Mets","Red Sox","Cubs","Giants","Phillies","Braves",
  "Cardinals","Astros","Rangers","Padres","Blue Jays","Orioles","Mariners","Pirates","Rays","Twins","Brewers",
  "Guardians","Rockies","Angels","Athletics","Diamondbacks","Nationals","Marlins","Reds","Tigers","Royals","White Sox"
];
const NFL_TEAM_KEYWORDS = [
  "NFL","National Football League","Cowboys","49ers","Chiefs","Eagles","Giants","Jets","Patriots","Packers","Steelers",
  "Bills","Rams","Raiders","Seahawks","Dolphins","Vikings","Lions","Bears","Commanders","Ravens","Texans","Jaguars",
  "Buccaneers","Titans","Saints","Panthers","Colts","Browns","Broncos","Falcons","Cardinals","Chargers","Bengals"
];
const NBA_TEAM_KEYWORDS = [
  "NBA","National Basketball Association","Lakers","Celtics","Warriors","Knicks","Nets","Bulls","Heat","76ers","Bucks",
  "Mavericks","Clippers","Suns","Nuggets","Timberwolves","Spurs","Rockets","Pelicans","Hawks","Cavaliers","Pistons",
  "Pacers","Magic","Wizards","Hornets","Raptors","Grizzlies","Jazz","Thunder","Kings","Trail Blazers"
];
const NHL_TEAM_KEYWORDS = [
  "NHL","National Hockey League","Rangers","Islanders","Devils","Bruins","Canadiens","Maple Leafs","Red Wings","Blackhawks",
  "Penguins","Flyers","Lightning","Panthers","Sabres","Senators","Capitals","Hurricanes","Blue Jackets","Predators",
  "Blues","Stars","Avalanche","Wild","Jets","Coyotes","Golden Knights","Kraken","Oilers","Flames","Canucks","Sharks","Kings","Ducks"
];

const hostFromUrl = (u = "") => {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; }
};

/* =========================================
   TOPIC FILTERS (extra guardrails)
========================================= */
const REGIONAL_POSITIVE_BY_STATE = {
  FL: ["Florida","South Florida","Broward","Palm Beach","Miami","Fort Lauderdale","West Palm Beach","Boca Raton"],
};
const BIG_MARKET_NEGATIVES = [
  "los angeles","california","new york","nyc","chicago","san francisco",
  "seattle","boston","philadelphia","houston","dallas","atlanta","phoenix","denver"
];

const TOPIC_FILTERS = {
  Baseball: {
    mustIncludeAny: [
      "mlb","major league baseball",
      ...MLB_TEAM_KEYWORDS,
      "mookie betts","aaron judge","shohei ohtani","juan soto","bryce harper"
    ],
    positive: [
      "mlb","major league baseball","box score","game recap","lineup",
      "injury update","trade","waivers","rumor","call-up","optioned",
      ...MLB_TEAM_KEYWORDS
    ],
    negative: [
      "ncaa","college","little league","regional","super regional","hs","high school",
      "milb","minor league","aaa","aa","single-a",
      "fantasy","dfs","dynasty","waiver wire","start/sit","sleepers","mock draft",
      "odds","parlay","props","prop","sportsbook","betting","promo code"
    ],
    domainWeights: {
      "mlb.com": 4,
      "espn.com": 4,
      "mlbtraderumors.com": 4,
      "si.com": 3,
      "cbssports.com": 3,
      "foxsports.com": 3,
      "theathletic.com": 3,
      "yahoo.com": 2,
      "masslive.com": 2,
      "audacy.com": 1,

      "pitcherlist.com": -3,
      "rotowire.com": -3,
      "fantasypros.com": -3,
      "draftkings.com": -4,
      "fanduel.com": -4,
      "actionnetwork.com": -3,
      "oddsshark.com": -3,
      "yardbarker.com": -1
    },
    minScore: 1.25,
    positiveWeight: 1.5,
    negativeWeight: 1.9
  },
  Football: {
    positive: [...NFL_TEAM_KEYWORDS],
    negative: ["high school","HS","prep","flag football","NCAA","college"],
    domainWeights: {
      "espn.com":4,"nfl.com":4,"si.com":3,"cbssports.com":3,"nbcsports.com":3,"foxsports.com":3,
      "theathletic.com":3,"yahoo.com":2
    },
    minScore: 0.9,
    positiveWeight: 1.3,
    negativeWeight: 1.6
  },
  Basketball: {
    positive: [...NBA_TEAM_KEYWORDS],
    negative: ["NCAA","college","HS","high school","AAU"],
    domainWeights: {
      "espn.com":4,"nba.com":4,"si.com":3,"cbssports.com":3,"nbcsports.com":3,"foxsports.com":3,
      "theathletic.com":3,"yahoo.com":2
    },
    minScore: 0.9,
    positiveWeight: 1.3,
    negativeWeight: 1.6
  },
  Hockey: {
    positive: [...NHL_TEAM_KEYWORDS],
    negative: ["NCAA","college","HS","high school","junior hockey","AHL"],
    domainWeights: {
      "espn.com":4,"nhl.com":4,"si.com":3,"cbssports.com":3,"nbcsports.com":3,"foxsports.com":3,
      "theathletic.com":3,"yahoo.com":2
    },
    minScore: 0.9,
    positiveWeight: 1.3,
    negativeWeight: 1.6
  },
  Film: {
    positive: [
      "film","movie","cinema","box office","trailer","teaser","casting","director",
      "screenplay","actor","actress","sequel","reboot","biopic","festival","sundance",
      "cannes","venice","tiff","oscars","academy awards","disney","marvel","dc",
      "netflix","hulu","max","amazon studios","a24","focus features","universal",
      "paramount","sony pictures","warner bros","20th century studios","searchlight",
      "variety","hollywood reporter","deadline","indiewire"
    ],
    negative: [
      "spider","spiders","tarantula","tarantulas","insect","bug","genitals","nsfw",
      "explicit","gore","crime scene","supply chain","crypto","bitcoin",
      "blockchain","ai model","scientists discover","species discovered",
      "galaxy","asteroid","meteor"
    ],
    domainWeights: {
      "variety.com":4,"hollywoodreporter.com":4,"deadline.com":4,"indiewire.com":4,
      "empireonline.com":3,"collider.com":3,"screenrant.com":2,"rottentomatoes.com":2,
      "hackmoon.com":-3,"mandatory.com":-2,"medium.com":-1
    },
    minScore: 1.25,
    positiveWeight: 1.4,
    negativeWeight: 1.8,
  },
};

/* =========================================
   SCORING WRAPPER (kept)
========================================= */
function scoreStoryByTopic(story = {}, topic = "", cityLabel = "", cityTeams = null) {
  let s = 0;
  if (story.sourceType === "newsdata") s += 1;
  else if (story.sourceType === "rss") s += 0.5;
  else if (story.isFallback) s += 0.25;

  const cfg = TOPIC_FILTERS[topic] || {};
  const txt = `${story.title || ""} ${story.description || ""} ${story.source || ""}`.toLowerCase();

  // Hard gate for topics that require MLB-like signals
  if ((cfg.mustIncludeAny || []).length && !includesAny(txt, cfg.mustIncludeAny)) return -999;

  const w = cfg.domainWeights?.[hostFromUrl(story.url || story.link || "")];
  if (typeof w === "number") s += w;

  const posW = cfg.positiveWeight ?? 1;
  const negW = cfg.negativeWeight ?? 1.5;
  (cfg.positive || []).forEach(k => { if (txt.includes(k.toLowerCase())) s += posW; });
  (cfg.negative || []).forEach(k => { if (txt.includes(k.toLowerCase())) s -= negW; });

  // local bias
  const userState = (cityLabel.split(",")[1] || "").trim().toUpperCase();
  const cityLower = cityLabel.toLowerCase();
  if (cityLower && txt.includes(cityLower)) s += 1;
  const regional = REGIONAL_POSITIVE_BY_STATE[userState] || [];
  regional.forEach(term => { if (txt.includes(term.toLowerCase())) s += 0.5; });

  if (!txt.includes(cityLower) && !regional.some(t => txt.includes(t.toLowerCase()))) {
    BIG_MARKET_NEGATIVES.forEach(term => { if (txt.includes(term)) s -= 0.8; });
  }

  // Pro-sport boosts + local team boost
  if (topic === "Baseball" && includesAny(txt, MLB_TEAM_KEYWORDS)) s += 0.75;
  if (topic === "Football" && includesAny(txt, NFL_TEAM_KEYWORDS)) s += 0.5;
  if (topic === "Basketball" && includesAny(txt, NBA_TEAM_KEYWORDS)) s += 0.5;
  if (topic === "Hockey" && includesAny(txt, NHL_TEAM_KEYWORDS)) s += 0.5;

  const localTeams = (cityTeams?.[topic] || []).map(lc);
  if (localTeams.length && includesAny(txt, localTeams)) s += 1.0;

  // Timeliness (guard against very old)
  const d = new Date(story.publishedAt || story.pubDate || Date.now());
  const days = (Date.now() - d.getTime()) / 86400000;
  if (days > 30) s -= 1;
  if (days > 90) s -= 2;

  // Tiny bump for MLB to feel “big league”
  if (topic === "Baseball") s += 0.2;

  return s;
}

function refineTopic(items = [], topic = "", cityLabel = "", cityTeams = null, max = TOPIC_MAX) {
  const cfg = TOPIC_FILTERS[topic] || {};
  const minScore = Number.isFinite(cfg.minScore) ? cfg.minScore : -Infinity;

  let filtered = (items || [])
    .map(st => ({ st, score: scoreStoryByTopic(st, topic, cityLabel, cityTeams) }))
    .filter(x => x.score >= minScore)
    .sort((a,b) => b.score - a.score)
    .map(x => x.st);

  // Make sure at least one curated can appear if live is thin
  if (filtered.length < max && !filtered.some(s => s.isFallback) && items.some(s => s.isFallback)) {
    const topCurated = items.find(s => s.isFallback);
    if (topCurated) filtered.push(topCurated);
  }

  return filtered.slice(0, max);
}

/* =========================================
   UI styles
========================================= */
const PILL_BASE    = "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 border";
const PILL_CURATED = "bg-teal-500/20 text-teal-200 border-teal-500/40";
const PILL_LIVE    = "bg-yellow-300/20 text-yellow-100 border-yellow-300/40";

/* =========================================
   Story Card
========================================= */
function StoryCard({ story }) {
  const base =
    "rounded-md px-3 py-2 border border-white/10 shadow-sm transition bg-[#111827] text-white group";
  const inner = (
    <>
      <div className="flex items-start gap-2">
        <span className={`${PILL_BASE} ${story?.isFallback ? PILL_CURATED : PILL_LIVE}`}>
          {story?.isFallback ? "Curated" : "Live"}
        </span>
        {story?.isFallback || !story?.url ? (
          <span className="text-sm font-semibold leading-snug break-words">
            {story.title}
          </span>
        ) : (
          <span className="text-sm font-semibold leading-snug break-words underline-offset-2 group-hover:underline">
            {story.title} <span aria-hidden>↗</span>
          </span>
        )}
      </div>
      {story?.description ? (
        <p className="text-[12px] text-white/70 mt-1 leading-snug break-words">
          {snippet(story.description, 110)}
        </p>
      ) : null}
      <div className="mt-1 text-[10px] text-white/50 tracking-wide">
        {(story?.publishedAt || story?.pubDate || "").slice(0, 10)} • {story?.source}
      </div>
    </>
  );

  if (story?.url && !story?.isFallback) {
    return (
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} block hover:bg-[#0f172a] hover:-translate-y-[1px]`}
      >
        {inner}
      </a>
    );
  }
  return <div className={base}>{inner}</div>;
}

/* =========================================
   Component
========================================= */
const News = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  const [tapintoHeadlines, setTapintoHeadlines] = useState([]);
  const [tapintoResolvedCity, setTapintoResolvedCity] = useState("");

  const [liveWireHeadlines, setLiveWireHeadlines] = useState({});
  const [liveCounts, setLiveCounts] = useState({
    apiKey: false,
    newsdata: 0,
    rss: 0,
    curated: 0,
  });

  const [expandedTopics, setExpandedTopics] = useState([]);
  const [hotSheet, setHotSheet] = useState(() => getCache("hotSheet", []));
  const [filteredHotSheet, setFilteredHotSheet] = useState({});
  const [thingsWeLove, setThingsWeLove] = useState(() =>
    getCache("thingsWeLove", [])
  );
  const [bigGames, setBigGames] = useState(() => getCache("bigGames", []));
  const [shuffledConvoCards, setShuffledConvoCards] = useState(() =>
    [...conversationDeck].sort(() => 0.5 - Math.random()).slice(0, 3)
  );
  const [isFading, setIsFading] = useState(false);

  const {
    userName = "You",
    dateName = "your date",
    city: cityRaw = "",
    selectedTopics = [],
    subtopicAnswers = {},
  } = userData || {};

  // Normalize city once
  const { cityName, state, label: cityLabel } = useMemo(
    () => normalizeCityString(cityRaw),
    [cityRaw]
  );

  // Lowercased index for flexible team lookup
  const lowerCityTeamIndex = useMemo(() => {
    const out = {};
    Object.keys(cityTeamMap || {}).forEach(
      (k) => (out[k.toLowerCase()] = cityTeamMap[k])
    );
    return out;
  }, []);

  const cityKeyLower = cityLabel.toLowerCase();
  const cityOnlyLower = cityName.toLowerCase();
  const stateLower = state ? state.toLowerCase() : "";

  const rawCity = (userData?.city || "").trim();           // e.g. "Edison, NJ"
  const [userCityName, userStateCode] = rawCity.split(",").map(s => s.trim());

  const cityTeams =
    lowerCityTeamIndex[cityKeyLower] ||
    (stateLower && lowerCityTeamIndex[`${cityOnlyLower}, ${stateLower}`]) ||
    (stateLower && lowerCityTeamIndex[`${stateLower}, ${cityOnlyLower}`]) ||
    lowerCityTeamIndex[cityOnlyLower] ||
    null;

  // Normalize subtopic answers once (handles emoji in sheet & choices)
  const normalizedSubtopicAnswers = useMemo(() => {
    const out = {};
    Object.entries(subtopicAnswers || {}).forEach(([topicWithEmoji, arr]) => {
      out[stripEmoji(topicWithEmoji)] = (arr || []).map((s) => stripEmoji(s));
    });
    return out;
  }, [subtopicAnswers]);

  /* ------------------ TAPinto resolver (unchanged) ------------------ */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setTapintoHeadlines([]);
      setTapintoResolvedCity("");

      const base = Array.from(
        new Set(
          [
            cityLabel,
            rawCity,
            state ? `${state}, ${cityName}` : "",
            state ? `${cityName}, ${state}` : "",
            cityName,
          ]
            .map((s) => String(s || "").trim())
            .filter(Boolean)
        )
      );

      const aliases = TAPINTO_CITY_ALIASES[cityName.toLowerCase()] || [];
      const candidates = Array.from(
        new Set([...base, ...aliases, ...withState(aliases, state)])
      );

      for (const cand of candidates) {
        try {
          const data = await getTAPintoHeadlinesForCity(cand);
          if (!cancelled && Array.isArray(data) && data.length > 0) {
            setTapintoHeadlines(data);
            setTapintoResolvedCity(cand);
            return;
          }
        } catch {}
      }

      if (!cancelled) {
        setTapintoHeadlines([]);
        setTapintoResolvedCity("");
      }
    };

    if (cityLabel || rawCity) run();
    else {
      setTapintoHeadlines([]);
      setTapintoResolvedCity("");
    }

    return () => {
      cancelled = true;
    };
  }, [cityLabel, rawCity, cityName, state]);

  /* ------------------ Companion deck ------------------ */
  const companion = useMemo(
    () => ({
      confidence: getRandom(pocketCompanionDeck.confidence),
      sayThis: getRandom(pocketCompanionDeck.sayThis),
      finalThought: getRandom(pocketCompanionDeck.finalThought),
    }),
    []
  );

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const reshuffleCards = () => {
    setIsFading(true);
    setTimeout(() => {
      setShuffledConvoCards(
        [...conversationDeck].sort(() => 0.5 - Math.random()).slice(0, 3)
      );
      setIsFading(false);
    }, 300);
  };

  /* ------------------ Live headlines (NEW simplified flow) ------------------ */
  const fetchLive = async () => {
    try {
      const apiKey = await getNewsApiKey();
      const baseTopics = (selectedTopics || []).map((t) => stripEmoji(t));

      // 1) Live (NewsData with title-only + domains) + optional RSS (empty by default)
      const liveByTopic = await fetchDateWorthyHeadlines({
        topics: baseTopics,
        city: cityLabel,
        teams: [],                     // you can pass favoriteTeam here later if you want
        newsdataApiKey: apiKey,
        extraRSS: {},                  // add team RSS per topic if desired
        perTopic: TOPIC_MAX
      });

      // count newsdata/rss by inspecting sourceType
      const usedCounts = { newsdata: 0, rss: 0, curated: 0 };

      // 2) Curated pool from Sheet (fallback/top-off)
      const topicsForCurated = new Set(baseTopics);
      const curatedArr =
        (await fetchCuratedFallbacksFromSheet(FALLBACK_SHEET, {
          topicsFilter: Array.from(topicsForCurated),
          limitPerTopic: TOPIC_MAX,
        }).catch(() => curatedFallbacksLocal)) || [];

      const groupedCurated = curatedArr.reduce((acc, a) => {
        const key = stripEmoji(a.topic);
        (acc[key] ||= []).push({
          ...a,
          isFallback: true,
          sourceType: "curated",
        });
        return acc;
      }, {});

      // 3) Merge, DEDUPE, apply local rerank + topic guardrails
      const merged = {};
      const allTopics = new Set([...baseTopics, ...Object.keys(liveByTopic), ...Object.keys(groupedCurated)]);

      for (const t of allTopics) {
        const live = (liveByTopic[t] || []).map(x => ({
          ...x,
          url: x.link || x.url,
          publishedAt: x.pubDate || x.publishedAt || x.published_at,
          isFallback: false,
        }));

        // Count types
        live.forEach(item => {
          if (item.sourceType === "newsdata") usedCounts.newsdata++;
          if (item.sourceType === "rss") usedCounts.rss++;
        });

        const curated = groupedCurated[t] || [];

        const push = dedupePushFactory();
        const out = [];

        // keep space for curated reserve
        const capacityBeforeReserve = Math.max(0, TOPIC_MAX - CURATED_RESERVE);

        for (const item of live) {
          if (out.length >= capacityBeforeReserve) break;
          push(out, item);
        }

        let addedCurated = 0;
        for (const item of curated) {
          if (addedCurated >= CURATED_RESERVE) break;
          if (push(out, item)) {
            usedCounts.curated++;
            addedCurated++;
          }
        }

        // fill to TOPIC_MAX
        const fillOrder = [live, curated];
        for (const bucket of fillOrder) {
          for (const item of bucket) {
            if (out.length >= TOPIC_MAX) break;
            push(out, item);
          }
          if (out.length >= TOPIC_MAX) break;
        }

        const locSorted = cityLabel ? rerankWithLocation(out, cityLabel) : out;
        merged[t] = refineTopic(locSorted, t, cityLabel, cityTeams, TOPIC_MAX);
      }

      setLiveWireHeadlines(merged);
      setLiveCounts({
        apiKey: !!apiKey,
        newsdata: usedCounts.newsdata,
        rss: usedCounts.rss,
        curated: usedCounts.curated,
      });
    } catch (e) {
      // Hard fallback: curated only
      const fbArr =
        (await fetchCuratedFallbacksFromSheet(FALLBACK_SHEET, {
          topicsFilter: selectedTopics,
          limitPerTopic: TOPIC_MAX,
        }).catch(() => curatedFallbacksLocal)) || [];
      const groupedFb = fbArr.reduce((acc, a) => {
        (acc[stripEmoji(a.topic)] ||= []).push({
          ...a,
          isFallback: true,
          sourceType: "curated",
        });
        return acc;
      }, {});

      if (cityLabel) {
        Object.keys(groupedFb).forEach((t) => {
          groupedFb[t] = rerankWithLocation(groupedFb[t] || [], cityLabel);
        });
      }

      setLiveWireHeadlines(groupedFb);
      setLiveCounts((prev) => ({ ...prev, curated: fbArr.length }));
    }
  };

  /* ------------------ Load sheets + live ------------------ */
  useEffect(() => {
    const HOT_SHEET_URL =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFcfO2X43yTcfzsAS5WY80lwEXfC5zNQDiPAS1We9jNSPXgiqFMs7CfoQOTv1C0RFn-dxU5NrkpuyY/pub?output=csv";

    const fetchAll = async () => {
      try {
        const [hot, love, games] = await Promise.all([
          fetchHotSheetFromSheet(`${HOT_SHEET_URL}&cb=${Math.floor(Date.now()/60000)}`),
          fetchThingsWeLoveFromSheet().catch(() => thingsWeLoveFallback),
          fetchBigGamesFromSheet().catch(() => bigGamesFallback),
        ]);

        const hotArr = Array.isArray(hot) ? hot : [];
        const loveArr = Array.isArray(love) ? love : [];
        const gamesArr = Array.isArray(games) ? games : [];

        setHotSheet(hotArr);
        setCache("hotSheet", hotArr);
        setThingsWeLove(loveArr);
        setCache("thingsWeLove", loveArr);
        setBigGames(gamesArr);
        setCache("bigGames", gamesArr);

        // Hot Sheet filter (topic + subtopics)
        const matched = hotArr.filter((item) => {
          const topicKey = stripEmoji(item.topic);
          const subs = normalizedSubtopicAnswers[topicKey] || [];
          return (
            (selectedTopics || []).some((t) => stripEmoji(t) === topicKey) &&
            (subs.length === 0 || subs.includes(stripEmoji(item.subtopic)))
          );
        });

        const grouped = {};
        matched.forEach((entry) => {
          const k = stripEmoji(entry.topic);
          (grouped[k] ||= []).push(entry);
        });
        setFilteredHotSheet(grouped);
      } catch (err) {
        console.error("🔥 Error loading sheets:", err);
      }
    };

    fetchAll();
    if ((selectedTopics || []).length > 0) {
      fetchLive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopics, subtopicAnswers, cityLabel]);

  /* ------------------ UI helpers ------------------ */
  const handleCelebrateAndReturn = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => navigate("/"), 1200);
  };

  const validBigGames = (bigGames || []).filter(
    (game) =>
      game && game.Event?.trim() && game.Sport?.trim() && game["Date(s)"]?.trim()
  );
  const gamesToShow = validBigGames.slice(0, 4);

  const StatusPill = ({ label, value, ok = true }) => (
    <span
      className={`text-[11px] px-2 py-1 rounded-full border mr-2 mb-2 inline-block ${
        ok
          ? "bg-emerald-600/20 text-emerald-200 border-emerald-400/30"
          : "bg-rose-600/20 text-rose-200 border-rose-400/30"
      }`}
    >
      <strong>{label}:</strong> {value}
    </span>
  );

  /* ------------------ Render ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#a78bfa] text-white px-4 py-10 relative">
      <div className="absolute inset-0 bg-[url('/stars-explosion.svg')] bg-cover bg-center opacity-40 pointer-events-none z-0" />
      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        {/* DEV STATUS */}
        {isDev && (
          <div className="rounded-xl border border-white/20 bg-black/40 p-3 mt-2">
            <div className="text-xs text-white/60 mb-1">
              🛠️ Status — City: <strong>{tapintoResolvedCity || cityLabel || "—"}</strong>
            </div>
            <div>
              <StatusPill
                label="TAPinto"
                value={`${tapintoHeadlines.length} items`}
                ok={tapintoHeadlines.length > 0}
              />
              <StatusPill
                label="NewsData used"
                value={`${liveCounts.newsdata}`}
                ok={liveCounts.apiKey}
              />
              <StatusPill label="RSS used" value={`${liveCounts.rss}`} ok />
              <StatusPill label="Curated used" value={`${liveCounts.curated}`} ok />
              <StatusPill
                label="API Key"
                value={liveCounts.apiKey ? "on" : "off"}
                ok={liveCounts.apiKey}
              />
              <StatusPill
                label="Hot Sheet"
                value={`${hotSheet.length}`}
                ok={hotSheet.length > 0}
              />
              <StatusPill
                label="Brighter Side"
                value={`${thingsWeLove.length}`}
                ok={thingsWeLove.length > 0}
              />
              <StatusPill
                label="Big Games"
                value={`${validBigGames.length}`}
                ok={validBigGames.length > 0}
              />
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="font-script text-4xl sm:text-5xl text-white drop-shadow-[0_0_6px_#ffffffaa]">
            Talk More Tonight
          </h1>
          <p className="mt-2 text-white/80 italic text-sm sm:text-base">
            {userName}, here's the news for tonight
          </p>
        </div>

        {/* TAPinto — flip card (navy front, WHITE back) */}
        {rawCity && (
          <section className="relative rounded-2xl px-6 py-8 w-full max-w-5xl mx-auto my-10">
            <div className="absolute inset-0 bg-[url('/stars-explosion.svg')] bg-cover bg-center opacity-40 pointer-events-none z-0" />
            <div className="relative z-10 max-w-md sm:max-w-lg w-full mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-center text-white">Top Headlines 🗞️</h3>

              <TapIntoCard
                city={userCityName}          // "Edison"
                stateCode={userStateCode}    // "NJ"
                variant="flip"
                initialSide="front"
                maxItems={3}

                /* FORCE the back of the card to be white */
                className="!bg-white !text-slate-900 !ring-0 !border !border-slate-200
                           !shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              />
            </div>
          </section>
        )}

        {/* Live/RSS/Curated (grouped & refined) */}
        <section className="bg-[#1e293b] rounded-xl p-5 shadow border border-white/20 transition-opacity duration-300">
          <h2 className="text-lg font-bold text-white mb-3">🗞️ Tonight’s Headlines</h2>
          <p className="text-center text-white/70 italic mb-2">
            Not every article will be a match — kinda like dating 😉
          </p>

          {Object.entries(liveWireHeadlines)
            .filter(([topic]) =>
              (selectedTopics || []).some((t) => stripEmoji(t) === topic)
            )
            .map(([topic, stories], i) => (
              <div key={i} className="mb-5">
                <h3 className="text-md font-semibold text-white mb-1">
                  {displayTopicLabel(topic, selectedTopics)}
                </h3>

                {(stories || []).slice(0, TOPIC_MAX).map((story, index) => (
                  <StoryCard key={index} story={story} />
                ))}
              </div>
            ))}

          {Object.keys(liveWireHeadlines).length === 0 && (
            <>
              <p className="text-center text-white/70 italic mb-4">
                No live headlines yet. Showing curated news instead.
              </p>
              {Array.isArray(curatedFallbacksLocal) &&
                curatedFallbacksLocal
                  .filter((s) =>
                    (selectedTopics || []).some(
                      (t) => stripEmoji(t) === stripEmoji(s.topic)
                    )
                  )
                  .slice(0, TOPIC_MAX)
                  .map((story, i) => (
                    <div
                      key={i}
                      className="rounded-md px-3 py-2 bg-[#111827] text-white mb-2 border border-white/10"
                    >
                      <div className="flex items-start gap-2">
                        <span className={`${PILL_BASE} ${PILL_CURATED}`}>Curated</span>
                        <span className="text-sm font-semibold leading-snug text-white break-words">
                          {story.title}
                        </span>
                      </div>
                      {story?.description ? (
                        <p className="text-[12px] text-white/70 mt-1 leading-snug break-words">
                          {snippet(story.description, 110)}
                        </p>
                      ) : null}
                      <div className="mt-1 text-[10px] text-white/50 tracking-wide">
                        {(story?.publishedAt || "").slice(0, 10)} • {story?.source}
                      </div>
                    </div>
                  ))}
            </>
          )}
        </section>

        {/* 🔥 The Hot Sheet */}
        <section className="bg-black rounded-xl p-5 shadow border border-white/20">
          <h2 className="text-lg font-semibold mb-4">🔥 The Hot Sheet</h2>

          {Object.keys(filteredHotSheet || {}).length > 0 ? (
            Object.entries(filteredHotSheet).map(([topic, entries], i) => (
              <div key={i} className="mb-6">
                <button
                  onClick={() => setExpandedTopics((prev) =>
                    prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
                  )}
                  className="w-full text-left font-semibold"
                >
                  {displayTopicLabel(topic, selectedTopics)}{" "}
                  {expandedTopics.includes(topic) ? "▲" : "▼"}
                </button>
                {expandedTopics.includes(topic) && (
                  <div className="bg-[#111] rounded-md mt-2 px-4 py-4">
                    {(entries || []).map((entry, j) => (
                      <div key={j} className="mb-4">
                        <h4 className="font-semibold text-sm mb-1">
                          {entry.subtopic}
                        </h4>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                          {entry.blurb && <li>{entry.blurb}</li>}
                          {entry.ask && (
                            <li className="italic text-gray-300">
                              {entry.ask.replace("[dateName]", dateName)}
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm italic text-white/50">
              Loading your curated Hot Sheet…
            </p>
          )}
        </section>

        {/* 3-Column Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Sports */}
          <div className="bg-[#1e1b4b] rounded-xl p-5 shadow border border-white/20">
            <h2 className="text-lg font-bold text-white mb-3">🏟️ Tonight in Sports</h2>

            <ul className="text-sm space-y-2 mb-4">
              {sportsSchedules.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-white hover:text-indigo-200"
                  >
                    {item.league} Schedule →
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-md font-semibold text-white mt-6 mb-2">
              🏆 Big Games Ahead
            </h3>
            <ul className="text-sm space-y-4">
              {gamesToShow.length > 0 ? (
                gamesToShow.map((item, index) => (
                  <li
                    key={index}
                    className="bg-white/5 p-3 rounded-md border border-white/10 text-white"
                  >
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-lg">{getSportEmoji(item.Sport)}</span>
                      {item.Event}
                      <span className="text-xs text-white/70 ml-2">
                        ({item.Sport})
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-indigo-200">
                      {item["Date(s)"]}
                    </div>
                    <div className="text-xs text-indigo-200">{item.Location}</div>
                    {item?.Notes && (
                      <div className="mt-1 text-xs italic text-yellow-300 leading-snug break-words">
                        {item.Notes}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-sm italic text-white/60">
                  No upcoming games available right now.
                </p>
              )}
            </ul>

            {/* Local Teams */}
            {cityTeams && Object.keys(cityTeams).length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-white mb-2">
                  🏙️ Your Local Teams
                </h3>
                {Object.entries(cityTeams).map(([sport, teams]) => (
                  <div key={sport} className="mb-2">
                    <p className="text-sm font-semibold capitalize">{sport}</p>
                    <p className="text-xs italic text-white/70">
                      {(teams || []).join(" • ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation Deck */}
          <div className="bg-black rounded-xl p-5 shadow border border-white/20">
            <h2 className="text-lg font-bold text-white mb-3">🗣️ Conversation Deck</h2>
            <div
              className={`space-y-4 transition-opacity duration-500 ease-in-out ${
                isFading ? "opacity-0" : "opacity-100"
              }`}
            >
              {shuffledConvoCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left text-white"
                >
                  <p className="text-sm font-semibold mb-2">💬 {card.prompt}</p>
                  <p className="text-xs italic text-white/70">{card.blurb}</p>
                </div>
              ))}
            </div>
            <button
              onClick={reshuffleCards}
              className="mt-6 text-sm text-indigo-300 underline hover:text-indigo-100"
            >
              🔄 Shuffle Cards
            </button>
          </div>

          {/* Things We Love */}
          <div className="bg-[#1e293b] rounded-xl p-5 shadow border border-white/20">
            <h2 className="text-lg font-bold text-white mb-3">🌟 The Brighter Side</h2>
            {thingsWeLove.length > 0 ? (
              thingsWeLove.map((item, index) => (
                <div key={index} className="mb-4">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-300 underline"
                  >
                    {item.title}
                  </a>
                  <ul className="list-disc list-inside text-xs text-white/80 mt-1 space-y-1">
                    {safeSplit(item.bullets).map((line, i) => (
                      <li key={i}>{String(line).trim()}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-xs italic text-white/50">Loading the good stuff…</p>
            )}
          </div>
        </section>

        <DateNightFunSection />

        {/* Pocket Companion */}
        <section className="bg-white/5 rounded-xl p-6 shadow border border-white/10">
          <h3 className="text-lg font-bold text-center mb-4">
            🌙 Your Pocket Companion
          </h3>
          <p className="text-sm italic text-white/80 text-center mb-6">
            A few final sparks before you head out...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">
                Last-Minute Confidence
              </p>
              <p className="text-xs italic text-white/70">{companion.confidence}</p>
            </div>
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">Say This Tonight</p>
              <p className="text-xs italic text-white/70">{companion.sayThis}</p>
            </div>
            <div className="bg-[#111] p-4 rounded-xl shadow-md border border-white/10 text-left">
              <p className="text-sm font-semibold text-white mb-1">One Last Thought</p>
              <p className="text-xs italic text-white/70">{companion.finalThought}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center mt-16 space-y-2">
          <p className="text-xl sm:text-2xl font-script italic text-white drop-shadow-[0_0_6px_#ffffffaa]">
            We truly hope you and {dateName} <strong>Talk More Tonight</strong>.
          </p>
          <p className="text-sm text-white/60">
            © 2025 Talk More Tonight™. All rights reserved.
          </p>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={handleCelebrateAndReturn}
            className="mt-8 bg-gradient-to-br from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-purple-600 hover:to-indigo-600"
          >
            🌟 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   GAS endpoints (unchanged; used by other utils)
========================================= */
const KEYWORD_SHEET =
  "https://script.google.com/macros/s/AKfycbyPcYmCl8DCGxWx1GPPWyiArQILldiWR8NDyymEJlUH9PX89LV8dJL5PRyygsXufKnb5w/exec";
const FALLBACK_SHEET =
  "https://script.google.com/macros/s/AKfycbxvSf4U9o7s2bWi-BQaSfSANc-E1OiMuxeqJO1USZOI4OXN-9jnrAb8E0-ws9fwtrhD/exec";

export default News;
