import cityStateOptions from "../data/cityStateOptions";
import cityTeamMap from "../data/cityTeamMap";

/**
 * Given a city name, find the state it belongs to
 * and return the pro teams for that state.
 */
export default function getTeamsForCity(selectedCity) {
  if (!selectedCity) {
    return { Baseball: [], Football: [], Basketball: [], Hockey: [] };
  }

  const cityNormalized = selectedCity.trim().toLowerCase();

  // Find the state abbreviation that has this city
  const stateCode = Object.keys(cityStateOptions).find((state) =>
    cityStateOptions[state].some(
      (c) => c.trim().toLowerCase() === cityNormalized
    )
  );

  if (!stateCode) {
    console.warn(`City "${selectedCity}" not found in cityStateOptions`);
    return { Baseball: [], Football: [], Basketball: [], Hockey: [] };
  }

  const teams = cityTeamMap[stateCode] || {
    Baseball: [],
    Football: [],
    Basketball: [],
    Hockey: [],
  };

  return {
    Baseball: teams.Baseball.map((t) => String(t)),
    Football: teams.Football.map((t) => String(t)),
    Basketball: teams.Basketball.map((t) => String(t)),
    Hockey: teams.Hockey.map((t) => String(t)),
  };
}
