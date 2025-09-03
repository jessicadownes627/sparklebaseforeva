// src/news/dateWorthiness.js
// Heuristics to make stories "date-worthy" (premieres, trades, tours, trailers… > town budget stuff)

/* =========================
   Normalization helpers
========================= */
export function normalize(str = "") { return String(str || "").toLowerCase().trim(); }
const stripEmoji = (s = "") =>
  s.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDEFF])/g,
    ""
  ).trim();

function wordBoundaryContains(text, term) {
  if (!term) return false;
  const t = normalize(text);
  const q = String(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rx = new RegExp(`\\b${q}\\b`, "i");
  return rx.test(t);
}

function containsAny(text, terms = []) {
  const t = normalize(text);
  return terms.some(k => t.includes(normalize(k)));
}

function sourceHost(url = "") {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

/* =========================
   Signals & guardrails
========================= */

// Action-y verbs & phrases that start conversations
export const DATE_ACTION_VERBS = [
  "announces","launches","premieres","headlines","sets date","reveals",
  "drops","debuts","releases","wins","clinches","trades","signs","extends",
  "trailer","teaser","tour","festival","opening night","box office","soundtrack",
  "streaming","playoffs","finals","record","no. 1","chart","lineup","headliner","showrunner",
  "casting","renewed","greenlit","returns","reunion","limited series","world tour","north american leg"
];

// Kill words for small/local bureaucracy, obits, police blotter, etc.
export const GLOBAL_KILL_WORDS = [
  "school board","school budget","budget vote","town council","zoning","planning board",
  "tax levy","ordinance","public hearing","obituary","in memoriam","crime blotter",
  "arrested","homicide","robbery","assault","indicted","arraigned","closure notice",
  "road closure","sewer","paving","trash pickup","meeting minutes","district meeting"
];

// Apple-safe NSFW hard-deny (light; TAPinto stays unfiltered elsewhere)
const NSFW_TERMS_LIGHT = [
  "onlyfans","porn","pornography","xxx","sex tape","sex video","strip club","stripclub","cam site","escort"
];

// Sources that *help* date-night vibes
const SOURCE_WHITELIST = [
  "apnews.com","reuters.com",
  "mlb.com","nba.com","nfl.com","nhl.com","espn.com","si.com","cbssports.com","theathletic.com",
  "variety.com","hollywoodreporter.com","deadline.com","billboard.com","rollingstone.com","pitchfork.com","ew.com",
  "theverge.com","techcrunch.com","wired.com","arstechnica.com","cnet.com",
  "ign.com","polygon.com","gamespot.com",
  "travelandleisure.com","cntraveler.com","lonelyplanet.com",
  "eater.com","bonappetit.com"
];

// Sources that often skew to fantasy/promo/betting spam (downweight/kill)
const SOURCE_BLACKLIST = [
  "draftkings.com","fanduel.com","oddsshark.com","actionnetwork.com","rotowire.com","fantasypros.com",
  "yhoo.it"
];

/* =========================
   Core scoring
========================= */
export function scoreArticleForDateNight(article, { topic, city, teams = [] } = {}) {
  const title = article?.title || "";
  const desc  = article?.description || article?.content || "";
  const text  = `${title} ${desc}`;
  const host  = sourceHost(article?.link || article?.url || "");

  // 0) Hard filters
  if (containsAny(text, GLOBAL_KILL_WORDS)) return -1000;
  if (containsAny(text, NSFW_TERMS_LIGHT))  return -1000;
  if (SOURCE_BLACKLIST.includes(host))      return -1000;

  // 1) Start from 0; add structural points
  let score = 0;

  // 2) Action verbs = conversation fuel
  DATE_ACTION_VERBS.forEach(v => { if (containsAny(text, [v])) score += 10; });

  // 3) Topic presence (emoji-safe)
  const topicKey = stripEmoji(topic || "");
  if (topicKey && (wordBoundaryContains(text, topicKey) || containsAny(text, [topicKey]))) {
    score += 6;
  }

  // 4) Team & city boosts (teams stronger; date-prepping)
  teams.forEach(tm => {
    if (!tm) return;
    if (wordBoundaryContains(text, tm) || containsAny(text, ["${tm} vs", "${tm} at", "${tm} defeat", "${tm} beats"])) {
      score += 18;
    }
  });
  if (city && (wordBoundaryContains(text, city) || containsAny(text, [city]))) {
    score += 5;
  }

  // 5) Source credibility / vibe
  if (SOURCE_WHITELIST.includes(host)) score += 8;

  // 6) Recency curve (favor fresh)
  const published = new Date(
    article.pubDate || article.published_at || article.publishedAt || article.date || 0
  );
  const hours = (Date.now() - published.getTime()) / 36e5;
  if (!isNaN(hours)) {
    if (hours <= 12) score += 12;
    else if (hours <= 48) score += 8;
    else if (hours <= 96) score += 3;
    else if (hours > 24 * 7) score -= 4;
    if (hours > 24 * 30) score -= 10;
  }

  // 7) Title quality
  const tlen = (title || "").trim().length;
  if (tlen < 25) score -= 6;
  if (tlen >= 55 && tlen <= 120) score += 3;

  // 8) Penalize non-linking items
  const hasUrl = !!(article.link || article.url);
  if (!hasUrl) score -= 5;

  // 9) Cap
  if (score > 60) score = 60;

  return score;
}

export function isDateWorthy(article, ctx, minScore = 20) {
  return scoreArticleForDateNight(article, ctx) >= minScore;
}

/* =========================
   Dedupe (host-aware + title sig)
========================= */
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

export function dedupeArticles(articles = []) {
  const seen = new Set();
  return (articles || []).filter(a => {
    const host = (a.link || a.url || "").split("/")[2]?.replace(/^www\./, "") || "";
    const key  = `${titleSig(a.title || "")}@${host}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}