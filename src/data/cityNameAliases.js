// src/data/cityNameAliases.js
import { longIslandTowns } from "./longIslandTowns.js";

const cityNameAliases = {
  // NJ
  "mt laurel": "Mount Laurel",
  "jersey city": "Jersey City",
  "hoboken": "Hoboken",
  "camden": "Camden",
  "newark": "Newark",
  "rahway": "Rahway",
  "paterson": "Paterson",
  "plainfield": "Plainfield",
  "montclair": "Montclair",
  "edison": "Edison",

  // NYC + Boroughs
  "nyc": "New York",
  "new york": "New York",
  "new york city": "New York",
  "brooklyn": "New York",

  // Long Island
  "long island": "Long Island",
  "li": "Long Island",

  // Other cities
 
  "new york": "New York, NY",
  "new york city": "New York, NY",
  "nyc": "New York, NY",
  "brooklyn": "New York, NY",
  "boston": "Boston, MA",
  "philadelphia": "Philadelphia, PA",
  "washington": "Washington DC",
  "washington dc": "Washington DC",
  "miami": "Miami, FL",
  "los angeles": "Los Angeles, CA",
  "san francisco": "San Francisco, CA",
  "seattle": "Seattle, WA",
  "san diego": "San Diego, CA", 
  "austin": "Austin, TX",
  "denver": "Denver, CO",
  "portland": "Portland, OR",
  "las vegas": "Las Vegas, NV",
  "nashville": "Nashville, TN",
  "new orleans": "New Orleans, LA",
  "key west": "Key West, FL",
  "charlotte": "Charlotte, NC",
  "houston": "Houston, TX",
  "orlando": "Orlando, FL",
  "savannah": "Savannah, GA",
  "phoenix": "Phoenix, AZ",
  "minneapolis": "Minneapolis, MN",
  "salt lake city": "Salt Lake City, UT",
  "scottsdale": "Scottsdale"
};

// Map all Long Island towns to "Long Island"
longIslandTowns.forEach((town) => {
  cityNameAliases[town.toLowerCase()] = "Long Island";
});

export default cityNameAliases;

