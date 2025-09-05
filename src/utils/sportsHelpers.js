// src/utils/sportsHelpers.js

// Main sport categories we support
export const SPORT_KEYS = [
  "Baseball",
  "Football",
  "Basketball",
  "Hockey",
  "Golf",
  "Olympics",
  "College Sports",
  "Soccer",
];

// Emoji mapping for each sport
export const SPORT_EMOJIS = {
  Baseball: "⚾",
  Football: "🏈",
  Basketball: "🏀",
  Hockey: "🏒",
  Golf: "⛳",
  Olympics: "🏅",
  "College Sports": "🎓",
  Soccer: "⚽",
};

// Normalize sport keys
export function normalizeSportKey(key) {
  const k = String(key || "").trim().toLowerCase();
  if (["mlb", "baseball"].includes(k)) return "Baseball";
  if (["nfl", "football"].includes(k)) return "Football";
  if (["nba", "basketball"].includes(k)) return "Basketball";
  if (["nhl", "hockey"].includes(k)) return "Hockey";
  if (["golf"].includes(k)) return "Golf";
  if (["olympics"].includes(k)) return "Olympics";
  if (["college", "ncaa"].includes(k)) return "College Sports";
  if (["soccer", "mls", "fifa"].includes(k)) return "Soccer";
  return "Baseball"; // fallback
}

// Teams by sport (pro-level)
const LEAGUE_TEAMS = {
  Baseball: [
    "Arizona Diamondbacks","Atlanta Braves","Baltimore Orioles","Boston Red Sox",
    "Chicago Cubs","Chicago White Sox","Cincinnati Reds","Cleveland Guardians",
    "Colorado Rockies","Detroit Tigers","Houston Astros","Kansas City Royals",
    "Los Angeles Angels","Los Angeles Dodgers","Miami Marlins","Milwaukee Brewers",
    "Minnesota Twins","New York Mets","New York Yankees","Oakland Athletics",
    "Philadelphia Phillies","Pittsburgh Pirates","San Diego Padres","San Francisco Giants",
    "Seattle Mariners","St. Louis Cardinals","Tampa Bay Rays","Texas Rangers",
    "Toronto Blue Jays","Washington Nationals"
  ],
  Football: [
    "Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills",
    "Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns",
    "Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers",
    "Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs",
    "Las Vegas Raiders","Los Angeles Chargers","Los Angeles Rams","Miami Dolphins",
    "Minnesota Vikings","New England Patriots","New Orleans Saints","New York Giants",
    "New York Jets","Philadelphia Eagles","Pittsburgh Steelers","San Francisco 49ers",
    "Seattle Seahawks","Tampa Bay Buccaneers","Tennessee Titans","Washington Commanders"
  ],
  Basketball: [
    "Atlanta Hawks","Boston Celtics","Brooklyn Nets","Charlotte Hornets","Chicago Bulls",
    "Cleveland Cavaliers","Dallas Mavericks","Denver Nuggets","Detroit Pistons","Golden State Warriors",
    "Houston Rockets","Indiana Pacers","LA Clippers","Los Angeles Lakers","Memphis Grizzlies",
    "Miami Heat","Milwaukee Bucks","Minnesota Timberwolves","New Orleans Pelicans","New York Knicks",
    "Oklahoma City Thunder","Orlando Magic","Philadelphia 76ers","Phoenix Suns","Portland Trail Blazers",
    "Sacramento Kings","San Antonio Spurs","Toronto Raptors","Utah Jazz","Washington Wizards"
  ],
  Hockey: [
    "Anaheim Ducks","Arizona Coyotes","Boston Bruins","Buffalo Sabres","Calgary Flames",
    "Carolina Hurricanes","Chicago Blackhawks","Colorado Avalanche","Columbus Blue Jackets","Dallas Stars",
    "Detroit Red Wings","Edmonton Oilers","Florida Panthers","Los Angeles Kings","Minnesota Wild",
    "Montréal Canadiens","Nashville Predators","New Jersey Devils","New York Islanders","New York Rangers",
    "Ottawa Senators","Philadelphia Flyers","Pittsburgh Penguins","San Jose Sharks","Seattle Kraken",
    "St. Louis Blues","Tampa Bay Lightning","Toronto Maple Leafs","Vancouver Canucks","Vegas Golden Knights",
    "Washington Capitals","Winnipeg Jets"
  ],
  Golf: [], // leave empty (individual players)
  Olympics: [], // generic placeholder
  "College Sports": [], // NCAA
  Soccer: [], // MLS/International
};

export function getAllTeamsForSport(sport) {
  const key = normalizeSportKey(sport);
  return (LEAGUE_TEAMS[key] || []).slice();
}

// Minimal state map → local teams
const STATE_TEAM_MAP = {
  NY: {
    Baseball: ["New York Mets","New York Yankees"],
    Football: ["Buffalo Bills","New York Giants","New York Jets"],
    Basketball: ["New York Knicks","Brooklyn Nets"],
    Hockey: ["New York Rangers","New York Islanders","Buffalo Sabres"],
  },
  NJ: {
    Baseball: ["New York Yankees","New York Mets","Philadelphia Phillies"],
    Football: ["New York Giants","New York Jets","Philadelphia Eagles"],
    Basketball: ["Brooklyn Nets","New York Knicks","Philadelphia 76ers"],
    Hockey: ["New Jersey Devils","New York Rangers","Philadelphia Flyers","New York Islanders"],
  },
  TX: {
    Baseball: ["Texas Rangers","Houston Astros"],
    Football: ["Dallas Cowboys","Houston Texans"],
    Basketball: ["Dallas Mavericks","Houston Rockets","San Antonio Spurs"],
    Hockey: ["Dallas Stars"],
  },
};

export function getTeamsForStateAndSport(stateAbbr, sport) {
  const key = normalizeSportKey(sport);
  const st = String(stateAbbr || "").toUpperCase();
  const pool = STATE_TEAM_MAP[st]?.[key];
  if (pool?.length) return pool.slice();

  const defaults = {
    Baseball: ["New York Yankees","Los Angeles Dodgers","Atlanta Braves"],
    Football: ["Dallas Cowboys","Kansas City Chiefs","San Francisco 49ers"],
    Basketball: ["Boston Celtics","Los Angeles Lakers","Golden State Warriors"],
    Hockey: ["New York Rangers","Toronto Maple Leafs","Vegas Golden Knights"],
    Golf: [],
    Olympics: [],
    "College Sports": [],
    Soccer: [],
  };
  return defaults[key].slice();
}
