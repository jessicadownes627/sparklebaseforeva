import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules (Node 14+)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your data files using relative paths
import stateCityOptions from '../data/stateCityOptions.js';
import cityDateIdeas from '../data/cityDateIdeas.js';
import hiddenGemIdeas from '../data/hiddenGemIdeas.js';

// Helper: Flatten stateCityOptions into array of "City, ST"
function getMasterCityList() {
  const cities = [];
  for (const [state, cityArr] of Object.entries(stateCityOptions)) {
    cityArr.forEach(city => {
      // Fix for Washington DC (no comma)
      if (state === 'DC') {
        cities.push('Washington DC');
      } else {
        cities.push(`${city}, ${state}`);
      }
    });
  }
  return cities;
}

// Helper: Get city keys from cityDateIdeas and hiddenGemIdeas
function getCityListFromData(dataObj) {
  return Object.keys(dataObj).sort();
}

// Helper: Find duplicates in array
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  arr.forEach(item => {
    if (seen.has(item)) duplicates.add(item);
    else seen.add(item);
  });
  return [...duplicates];
}

// Main compare function
function compareCityData() {
  const masterCities = getMasterCityList();

  const dateIdeaCities = getCityListFromData(cityDateIdeas);
  const hiddenGemCities = getCityListFromData(hiddenGemIdeas);

  // Normalize city names (trim, uppercase) for reliable comparison
  const normalize = str => str.trim().toUpperCase();

  const masterNorm = masterCities.map(normalize);
  const dateNorm = dateIdeaCities.map(normalize);
  const gemNorm = hiddenGemCities.map(normalize);

  // Missing in Classic Date Ideas (in master, not in date ideas)
  const missingInDateIdeas = masterNorm.filter(c => !dateNorm.includes(c));
  // Missing in Hidden Gems (in master, not in hidden gems)
  const missingInHiddenGems = masterNorm.filter(c => !gemNorm.includes(c));

  // Extra cities in date ideas (not in master)
  const extraInDateIdeas = dateNorm.filter(c => !masterNorm.includes(c));
  // Extra cities in hidden gems (not in master)
  const extraInHiddenGems = gemNorm.filter(c => !masterNorm.includes(c));

  // Duplicates in each data file
  const dupDateIdeas = findDuplicates(dateNorm);
  const dupHiddenGems = findDuplicates(gemNorm);

  // Output results (map back to original casing from master or data)
  function mapBack(normArr, originalArr) {
    const map = {};
    originalArr.forEach(city => {
      map[normalize(city)] = city;
    });
    return normArr.map(n => map[n] || n);
  }

  console.log('\n--- Missing Cities in Classic Date Ideas ---');
  console.log(mapBack(missingInDateIdeas, masterCities).join('\n'));

  console.log('\n--- Missing Cities in Hidden Gem Ideas ---');
  console.log(mapBack(missingInHiddenGems, masterCities).join('\n'));

  console.log('\n--- Extra Cities in Classic Date Ideas (Not in Master) ---');
  console.log(mapBack(extraInDateIdeas, dateIdeaCities).join('\n'));

  console.log('\n--- Extra Cities in Hidden Gem Ideas (Not in Master) ---');
  console.log(mapBack(extraInHiddenGems, hiddenGemCities).join('\n'));

  console.log('\n--- Duplicate Cities in Classic Date Ideas ---');
  console.log(mapBack(dupDateIdeas, dateIdeaCities).join('\n') || 'None');

  console.log('\n--- Duplicate Cities in Hidden Gem Ideas ---');
  console.log(mapBack(dupHiddenGems, hiddenGemCities).join('\n') || 'None');
}

compareCityData();
