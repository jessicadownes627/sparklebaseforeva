// ✅ Events.jsx — full version with ALL sparkle, “Want to Be Featured” section, NY events, playlist cards, custom/featured playlist, and final call-to-action!
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import PageHeader from "../components/PageHeader";
import curatedDatePlans from "../data/curatedDatePlans";
import playlists from "../data/appleMusicPlaylists";
import appleCityPlaylists from "../data/appleCityPlaylists";
import cityDateIdeas from "../data/cityDateIdeas";
import starterCityDateIdeas from "../data/starterCityDateIdeas";
import hiddenGemIdeas from "../data/hiddenGemIdeas";
import starterHiddenGemIdeas from "../data/starterHiddenGemIdeas";
import lowCostIdeas from "../data/lowCostIdeas";
import outfitSuggestions from "../data/outfitSuggestions.js";
import styleSuggestions from "../data/styleSuggestions";
import { longIslandTowns } from "../data/longIslandTowns.js";
import cityNameAliases from "../data/cityNameAliases.js";
import FlipCard from "../components/FlipCard";
import getWeatherTone from "../utils/getWeatherTone";
import CuratedDateCard from "../components/CuratedDateCard";
import { fetchLongIslandMusic } from "../utils/fetchLongIslandMusic";
import energyThemes from "../data/energyThemes";
import fallbackFriendsSpotlight from "../data/fallbackFriendsSpotlight.js";
import { fetchFriendsSpotlightFromSheet } from "../utils/fetchFriendsSpotlightFromSheet";
import { fetchFeaturedPlaylistFromScript } from "../utils/fetchFeaturedPlaylistFromSheet";
import { motion } from "framer-motion";

import { db } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";

const Events = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const {
    userName = "you",
    dateName = "your date",
    city = "",
    state = "",
    relationshipStatus = "dating",
    timeOfDay = "evening",
    dateVibe = "fun",
    locationType = "flexible",
    foodStyle = "casual",
    outfitStyle = "Laid-back & Easy",
    energy = "Dreamy ✨",
  } = userData;

  const vibeKey = dateVibe?.toLowerCase();
  const safeFoodStyle = (foodStyle || "").toLowerCase();

  const curatedPlan =
    curatedDatePlans?.[relationshipStatus]?.[timeOfDay]?.[vibeKey]?.[safeFoodStyle] || null;

  const theme = energyThemes?.[energy];
  const playlist = playlists?.[energy];
  const rawCity = city?.trim().toLowerCase();
  const normalizedCity = cityNameAliases[rawCity] || city?.trim();
  const cityKey = normalizedCity;
  const cityPlaylist = appleCityPlaylists?.[cityKey];
  const finalDateIdeas = { ...starterCityDateIdeas, ...cityDateIdeas };
  const finalHiddenGems = { ...starterHiddenGemIdeas, ...hiddenGemIdeas };
  const cityIdeasRaw = finalDateIdeas?.[cityKey] || [];
  const hiddenGemsRaw = finalHiddenGems?.[cityKey] || [];
  
  const [events, setEvents] = useState([])
  const today = new Date();
  const visibleEvents = events
    .filter(event => {
      if (!event.Date) return false;
      const eventDate = new Date(event.Date);
      return eventDate >= today;
    })
    .slice(0, 3); // Show only 3 events at a time

  const [randomClassicList, setRandomClassicList] = useState([]);
  const [randomHiddenGemList, setRandomHiddenGemList] = useState([]);
  const [randomLowCostList, setRandomLowCostList] = useState([]);
  const [isFriendsSpotlightLoading, setIsFriendsSpotlightLoading] = useState(true);
  const [customPlaylistUrl, setCustomPlaylistUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("feminine");
  const [friendsSpotlight, setFriendsSpotlight] = useState([]);
  const [featuredPlaylistData, setFeaturedPlaylistData] = useState(null);

 // Friends Spotlight logic (✨ with useMemo)
const permanentSpotlight = useMemo(() => {
  return friendsSpotlight.find((f) =>
    f?.title?.toLowerCase().includes("talk more")
  );
}, [friendsSpotlight]);

const rotatingSpotlights = useMemo(() => {
  return friendsSpotlight.filter(
    (f) => f?.title && f.title !== permanentSpotlight?.title
  );
}, [friendsSpotlight, permanentSpotlight]);

const randomSpotlight = useMemo(() => {
  if (rotatingSpotlights.length > 0) {
    const index = Math.floor(Math.random() * rotatingSpotlights.length);
    return rotatingSpotlights[index];
  }
  return null;
}, [rotatingSpotlights]);


  useEffect(() => {
    fetchFriendsSpotlightFromSheet()
      .then((data) => {
        if (data && data.length > 0) {
          setFriendsSpotlight(data);
        } else {
          setFriendsSpotlight(fallbackFriendsSpotlight);
        }
      })
      .catch(() => {
        setFriendsSpotlight(fallbackFriendsSpotlight);
      });
  }, []);

  // Custom/Featured Playlists (optional, safe if left in for future expansion)
  const handleSave = async () => {
    if (!customPlaylistUrl) return;
    try {
      await addDoc(collection(db, "submittedPlaylists"), {
        user: userName || "Anonymous",
        dateName: dateName || "Mystery Date",
        url: customPlaylistUrl,
        timestamp: serverTimestamp(),
      });
      setCustomPlaylistUrl("");
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error) {
      console.error("❌ Firestore error:", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "submittedPlaylists"), orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => doc.data());
      setFeaturedPlaylists(results);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchLongIslandMusic()
      .then(data => setEvents(data || []))
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    fetchFeaturedPlaylistFromScript().then(data => {
      if (data && data.title) setFeaturedPlaylistData(data);
    });
  }, []);

  // Low Cost Ideas — randomize ONCE
  useEffect(() => {
    if (Array.isArray(lowCostIdeas) && lowCostIdeas.length > 0) {
      const shuffled = [...lowCostIdeas].sort(() => 0.5 - Math.random());
      setRandomLowCostList(shuffled.slice(0, 3));
    }
  }, []);

  // Classic & Hidden Gems — randomize with city
useEffect(() => {
  const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

  const classicRaw = Array.isArray(cityIdeasRaw)
    ? cityIdeasRaw
    : cityIdeasRaw
    ? [cityIdeasRaw]
    : [];

  const hiddenGemRaw = Array.isArray(hiddenGemsRaw)
    ? hiddenGemsRaw
    : hiddenGemsRaw
    ? [hiddenGemsRaw]
    : [];

  setRandomClassicList((prev) => prev.length > 0 ? prev : shuffleArray(classicRaw).slice(0, 2));
  setRandomHiddenGemList((prev) => prev.length > 0 ? prev : shuffleArray(hiddenGemRaw).slice(0, 2));
}, [cityKey]);


  const showLongIsland =
    cityKey === "Long Island, NY" ||
    longIslandTowns.some(town =>
      normalizedCity.toLowerCase().includes(town.toLowerCase())
    );
  const weatherVibe = getWeatherTone(city, state);

  const cleanedOutfitStyle = ["Laid-back & Easy", "Confident & Sharp", "Statement Look"].includes(outfitStyle)
    ? outfitStyle
    : "Laid-back & Easy";

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} px-6 pt-10 pb-32`}>
      <PageHeader />
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl font-light tracking-tight mb-2">
          Thoughtfully designed just for you and {dateName}
        </h2>
        <p className="italic text-xl">🌟 Crafted with care — ready to shine 🌟</p>
      </div>
      <div className="flex flex-wrap justify-center gap-6 mb-12">

        {/* ✨ Your Personalized Plan */}
        <FlipCard
          front={
            <div>
              <h3 className="text-xl font-bold mb-3">✨ Your Personalized Plan ✨</h3>
              <p className="text-sm">Click to reveal your curated date idea!</p>
            </div>
          }
          back={
            <CuratedDateCard
              userName={userName}
              dateName={dateName}
              relationshipStatus={relationshipStatus}
              timeOfDay={timeOfDay}
              dateVibe={dateVibe}
              foodStyle={foodStyle}
              nightType="classic"
              planText={curatedPlan}
            />
          }
        />

        {/* 🎲 Shake it Up! */}
        <FlipCard
          disableFlipOnBack={true}
          front={
            <div className="text-center space-y-2 py-3">
              <h3 className="text-xl font-bold mb-1 text-white">Shake it Up! 🎲</h3>
              <p className="italic text-base text-indigo-300">
                Roll with it and see where this takes you!
              </p>
            </div>
          }
          back={
            <div className="p-6 flex flex-col items-center space-y-6">
              <div className="w-full flex justify-center gap-2 md:gap-4">
                <button
                  onClick={() => setSelectedOption(1)}
                  className={`px-4 py-2 rounded-full text-base md:text-lg font-bold shadow transition transform hover:scale-105 active:scale-95 ${
                    selectedOption === 1
                      ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white"
                      : "bg-gradient-to-r from-indigo-300 to-pink-300 text-[#0a2540]"
                  }`}
                >
                  🎉 New Adventure
                </button>
                <button
                  onClick={() => setSelectedOption(3)}
                  className={`px-4 py-2 rounded-full text-base md:text-lg font-bold shadow transition transform hover:scale-105 active:scale-95 ${
                    selectedOption === 3
                      ? "bg-gradient-to-r from-yellow-400 to-pink-500 text-white"
                      : "bg-gradient-to-r from-indigo-300 to-pink-300 text-[#0a2540]"
                  }`}
                >
                  🔮 Surprise Me
                </button>
              </div>
              <div className="mt-4 italic text-[#0a2540] min-h-[48px]">
                {selectedOption === 1 && (
                  <>
                    <p>
                      Go to a totally random spot in {city || "your city"} — the more unexpected, the better.
                    </p>
                    <p className="text-xs text-pink-700 mt-1">
                      Bonus: Review it like you’re food critics on a secret mission!
                    </p>
                  </>
                )}
                {selectedOption === 3 && (
                  <>
                    <p>
                      Let a coin flip decide your night: heads = new bar, tails = spontaneous dessert run.
                    </p>
                    <p className="text-xs text-pink-700 mt-1">
                      No second guessing, just go!
                    </p>
                  </>
                )}
                {!selectedOption && (
                  <p className="text-indigo-400">
                    Not sure what to do? Tap a button and roll the dice!
                  </p>
                )}
              </div>
              <div className="w-full mt-6 px-4 py-4 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl border border-indigo-100 text-center">
                <p className="font-semibold text-indigo-900 mb-1">
                  ✨ Feeling spontaneous?
                </p>
                <p className="text-sm text-[#0a2540]">
                  Explore what’s actually happening in {city || "your city"} tonight. Sometimes the best memories are unplanned.
                </p>
                <a
                  href={`https://www.meetup.com/find/?location=${city.replaceAll(" ", "-")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block font-bold text-pink-600 hover:text-indigo-600 underline"
                >
                  🔗 Browse Meetup events →
                </a>
                <p className="text-[11px] text-gray-400 italic mt-2">
                  Not sponsored. Just a vibe check. Results may be wilder than expected.
                </p>
              </div>
            </div>
          }
        />

        {/* 👕 'Fit for You */}
        <FlipCard
          front={
            <div className="p-6 text-center h-full flex flex-col items-center justify-center text-white">
              <h3 className="text-xl font-extrabold tracking-wide mb-2 text-white">
                'Fit for You 👕
              </h3>
              <p className="text-sm italic text-pink-200">
                It’s {weatherVibe} in {city}. What are you going to wear? Here’s a few possibilities.
              </p>
            </div>
          }
          back={
            <div className="p-4 text-sm text-[#0a2540] space-y-4">
              <p className="font-semibold text-center">
                Style inspo based on your vibe: <span className="italic">{cleanedOutfitStyle}</span>
              </p>
              <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                {["feminine", "masculine", "neutral"].map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStyle(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      selectedStyle === key
                        ? "bg-[#0a2540] text-white"
                        : "bg-white text-[#0a2540] border-[#0a2540] hover:bg-gray-100"
                    }`}
                  >
                    {key === "feminine" && "🌸 Feminine"}
                    {key === "masculine" && "🧢 Masculine"}
                    {key === "neutral" && "🌟 Neutral"}
                  </button>
                ))}
              </div>
              <div className="text-left space-y-2">
                {(outfitSuggestions[selectedStyle]?.[cleanedOutfitStyle] || []).map((suggestion, i) => (
                  <p key={i}>• {suggestion}</p>
                ))}
              </div>
              {styleSuggestions[cleanedOutfitStyle]?.energyTagline && (
                <p className="text-xs text-center italic text-gray-500 mt-2">
                  {styleSuggestions[cleanedOutfitStyle].energyTagline}
                </p>
              )}
              {styleSuggestions[cleanedOutfitStyle]?.links && (
                <div className="mt-3 text-[11px] text-center space-y-1">
                  {styleSuggestions[cleanedOutfitStyle].links.map(({ label, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block underline text-indigo-500 hover:text-indigo-700"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          }
        />

        {/* 🎶 TMT Playlist (by vibe) */}
        {playlist?.title && playlist?.url ? (
          <FlipCard
            front={
              <div className="text-center p-4">
                <h3 className="text-xl font-bold mb-2">TMT's Playlists 🎶</h3>
                <p className="text-sm text-white/80">Ready for some good tunes?</p>
              </div>
            }
            back={
              <div className="p-6 rounded-xl text-white bg-gradient-to-br from-pink-600 via-purple-500 to-indigo-500 shadow-lg space-y-5 text-center">
                <h4 className="text-2xl font-bold">{playlist.title}</h4>
                <p className="text-sm italic">
                  Here's the perfect soundtrack to match your {energy?.toLowerCase()} energy with {dateName}.
                </p>
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-white text-pink-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-pink-100 transition"
                >
                  🎵 Open Vibe Playlist
                </a>
                {cityPlaylist?.url && (
                  <>
                    <div className="border-t border-white/30 my-4" />
                    <p className="text-sm italic">
                      Oh — and since you're in {city}, here's Apple’s Top 25 for your city too. 🎧
                    </p>
                    <a
                      href={cityPlaylist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-indigo-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-indigo-100 transition"
                    >
                      📍 Open City Playlist
                    </a>
                  </>
                )}
                <div className="mt-6 text-xs italic text-white/80 bg-white/10 rounded-lg p-3">
                  <span role="img" aria-label="email">✉️</span> Have a song or playlist suggestion? Email us at <a href="mailto:talkmoretonight@gmail.com" className="underline text-pink-100 hover:text-white">talkmoretonight@gmail.com</a>!
                </div>
              </div>
            }
          />
        ) : (
          <div className="bg-white/10 border border-white/20 text-white text-center p-4 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">Talk More Tonight's Playlist 🎶</h3>
            <p className="text-sm italic">We couldn’t find a playlist for this energy.</p>
            <p className="text-xs mt-2">Try restarting the date planner to reset your vibe!</p>
          </div>
        )}

        {/* ⭐️ Featured Playlist */}
        {featuredPlaylistData && (
          <div className="bg-white/80 rounded-xl shadow-lg p-6 mb-6 max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-center mb-2">🎶 Featured Playlist</h3>
            <p className="text-sm text-center italic mb-3">
              Curated by <span className="font-semibold">{featuredPlaylistData.submittedBy}</span>
            </p>
            <a
              href={featuredPlaylistData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#1e1e1e] text-white py-2 rounded-lg font-medium hover:bg-black transition"
            >
              {featuredPlaylistData.title}
            </a>
          </div>
        )}

        {/* 📍 Local Classics */}
        {randomClassicList.length > 0 && (
  <FlipCard
    front={
      <div className="text-center p-6 h-full flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold mb-2">Local Classics 📍</h3>
        <p className="italic text-sm text-gray-300">
          Tried and true, always worth it.
        </p>
      </div>
    }
    back={
      <div className="h-full w-full flex items-center justify-center p-0">
        <div className="w-[96%] h-[90%] bg-gradient-to-br from-[#fff1f1] via-[#e0f2fe] to-[#f3e8ff] rounded-xl shadow-2xl shadow-purple-200/40 flex flex-col justify-center items-center text-center border border-purple-100/30">
          <span className="text-lg mb-2 block">📍</span>
          <div className="text-[#0a2540] font-bold mb-3">
            {randomClassicList.map((idea, i) => (
              <p key={i} className="mb-2">• {idea}</p>
            ))}
          </div>
          <p className="text-xs italic text-purple-600 pt-2">
            Local favorites never go out of style—especially with the right company!
          </p>
        </div>
      </div>
    }
  />
)}


        {/* 🌟 Hidden Gems */}
        {randomHiddenGemList.length > 0 && (
          <FlipCard
            front={
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Hidden Gems 🌟</h3>
                <p className="italic text-sm text-gray-300">
                  Two secret spots to surprise your date
                </p>
              </div>
            }
            back={
              <div className="
                bg-gradient-to-br from-white via-[#d0f4ff] to-[#8fd6ee]
                h-full w-full rounded-xl shadow-2xl shadow-[#8fd6ee]/30
                flex flex-col justify-center items-center
                p-6 text-center
              ">
                <span className="text-xl block mb-3">🌟</span>
                <div className="text-[#1571a6] font-semibold mb-4 text-base">
                  {randomHiddenGemList.map((idea, i) => (
                    <p key={i} className="mb-2">• {idea}</p>
                  ))}
                </div>
                <p className="text-xs italic text-sky-600 font-medium">
                  The best spots are the ones you almost miss.
                </p>
              </div>
            }
          />
        )}

        {/* 💡 Free / Low-Cost Ideas */}
        <FlipCard
          front={
            <div>
              <h3 className="text-xl font-bold mb-3">Free / Low-Cost Ideas 💡</h3>
              <p className="text-sm">
                Unforgettable moments don't need a price tag 💕
              </p>
            </div>
          }
          back={
            <div className="w-full h-full bg-gradient-to-br from-[#fdf6ec] via-[#f5e8d5] to-[#f5e9da] rounded-2xl shadow-xl text-[#6d4c1c] border border-[#ede0cb] p-8 flex flex-col justify-center">
              {randomLowCostList.map((idea, i) => (
                <p key={i} className="mb-3">
                  • {idea.replace(/{dateName}/g, dateName)}
                </p>
              ))}
              <p className="text-xs italic text-[#a8894a] pt-4">
                The best dates don’t need a big budget—just the right company.
              </p>
            </div>
          }
        />


 {/* ✨ Magic from Friends */}
{/* ✨ Magic from Friends */}
{randomSpotlight?.title && (
  <FlipCard
    front={
      <div>
        <h3 className="text-xl font-bold mb-3">Magic from Friends ✨</h3>
        <p className="text-sm">Click to reveal hand-picked love from us 💖</p>
      </div>
    }
    back={
      <div className="bg-gradient-to-br from-[#fff7ed] via-[#f7e7fd] to-[#ffd6e0] 
        rounded-2xl shadow-xl p-8 
        w-full h-full flex flex-col justify-center items-center 
        border border-pink-100/40">
        <span className="text-2xl mb-1">✨</span>
        <h4 className="font-bold text-xl text-pink-600 drop-shadow mb-2">{randomSpotlight.title}</h4>
        {randomSpotlight.blurb && (
          <p className="text-[#7b325a] italic mb-3">{randomSpotlight.blurb}</p>
        )}
        {randomSpotlight.url && (
          <a
            href={randomSpotlight.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-pink-400 to-orange-300 text-white px-5 py-2 rounded-full text-base font-semibold shadow-md hover:scale-105 transition"
          >
            {randomSpotlight.linkText || "Learn More"}
          </a>
        )}
      </div>
    }
  />
)}

      

        {/* ❤️ Staller Center NY-Exclusive */}
        {(userData.state === "NY" || userData.city?.toLowerCase().includes("new york")) && (
          <FlipCard
            front={
              <div className="bg-[#132044] rounded-xl shadow-2xl shadow-red-400/40 border border-red-400/60 h-full flex flex-col items-center justify-center p-6 text-center">
                <span className="text-2xl mb-2 text-red-400">❤️</span>
                <h3 className="text-xl font-bold text-red-500 mb-2 leading-tight text-center">
                  <span className="block">Staller Center</span>
                  <span className="block text-base font-semibold">at</span>
                  <span className="block text-base font-semibold">Stony Brook University</span>
                </h3>
                <p className="text-sm text-white/80 italic mb-1">
                  Our endless thanks to our friends at Staller Center at Stony Brook University.
                </p>
                <span className="inline-block text-xs font-semibold text-red-200 mt-2">✨NY Exclusive</span>
              </div>
            }
            back={
              <div className="bg-[#132044] rounded-xl shadow-2xl shadow-red-300/40 h-full flex flex-col items-center justify-center p-6 text-center border border-white/10">
                <h4 className="text-md font-bold text-red-400 mb-2 drop-shadow-[0_0_8px_#ef4444]">
                  Catch a Show!
                </h4>
                <p className="text-sm text-white/90 mb-3">
                  Discover music, theater, dance, and more at Staller Center this season. Plan a date or just treat yourself!
                </p>
                <a
                  href="https://www.stallercenter.com/Calendar.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition mb-2 shadow-lg drop-shadow-[0_0_10px_#ef4444]"
                >
                  See Shows & Get Tickets
                </a>
                <div className="mt-2 text-xs text-red-300 italic">
                  Go score your tickets! We'll save your spot here! ❤️
                </div>
              </div>
            }
            disableFlipOnBack={true}
          />
        )}

        {/* 🎶🌊 NY-only Special Events */}
        {(userData.state === "NY" || userData.city?.toLowerCase().includes("new york")) && (
          <FlipCard
            disableFlipOnBack={true}
            front={
              <div className="bg-[#132044] rounded-xl shadow-2xl shadow-[#7FFFD4]/40 h-full flex flex-col items-center justify-center p-6 text-center border border-white/10">
                <span className="text-3xl mb-2 text-[#7FFFD4]">🎶🌊</span>
                <h3 className="text-lg font-bold text-[#7FFFD4] mb-2">Special Events</h3>
                <p className="text-sm text-white/80 italic mb-1">
                  Discover gigs & events happening near you!
                </p>
                <span className="inline-block text-xs font-semibold text-[#7FFFD4] mt-2">
                  For NY Locals
                </span>
              </div>
            }
            back={
              <div className="bg-[#132044] rounded-xl shadow-2xl shadow-[#7FFFD4]/40 h-full flex flex-col items-center justify-center p-6 text-center border border-white/10">
                <h4 className="text-md font-bold text-[#7FFFD4] mb-2 drop-shadow-[0_0_8px_#7FFFD4]">
                  Live and Local!
                </h4>
                {visibleEvents.map((event, i) => (
                  <div key={i} className="border-b border-[#7FFFD4]/50 pb-2 last:border-0 mb-2">
                    <p className="font-semibold text-white">{event.Band}</p>
                    <p className="text-[#7FFFD4]">{event.Venue}</p>
                    <p className="italic text-xs text-[#7FFFD4]/80">
                      {event.Date
                        ? new Date(event.Date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })
                        : ""}
                    </p>
                    {event.Url && (
                      <a
                        href={event.Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#7FFFD4] text-[#132044] px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#5eead4] transition mt-1 shadow drop-shadow-[0_0_6px_#7FFFD4]"
                      >
                        More Info
                      </a>
                    )}
                  </div>
                ))}
                <div className="mt-2 text-xs text-[#7FFFD4] italic">
                  Hit up a show, support local legends and maybe, you might end up liking something new. Or even better - someone... who rocks your world.
                </div>
              </div>
            }
          />
        )}

        {/* 🌟 Want to Be Featured — YOUR BEAUTIFUL SECTION! */}
        <FlipCard
          front={
            <div>
              <h3 className="text-xl font-bold mb-3">✨ Want to Be Featured?</h3>
              <p className="text-sm">Tell us your story — We want to spotlight it 🌟</p>
            </div>
          }
          back={
            <div className="p-6 text-sm text-[#0a2540] space-y-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl shadow-md border border-pink-200">
              <h4 className="font-bold text-2xl mb-2 text-pink-600 drop-shadow-sm">
                Talk More - To Us! ✨
              </h4>
              <p className="mb-4 italic text-purple-700">
                Share your unique story with us and have a chance to be highlighted!
              </p>
              <p className="mb-4">
                Whether you're creating something awesome, had a magical date, a funny moment, or a heartwarming memory — we want to celebrate it.
              </p>
              {/* ⭐️ Featured Love Story */}
              <div className="bg-white/60 border-l-4 border-pink-400 rounded-lg p-4 shadow mb-2">
                <p className="text-sm font-bold text-pink-700 mb-1">🌟 Featured Love Story</p>
                <p className="italic text-[#aa276b] mb-2">
                  “This is such a fun app. We laughed over the conversation cards for hours.”
                </p>
                <p className="text-xs text-gray-700 text-right">— Anna, Los Angeles, CA</p>
              </div>
              <a
                href="mailto:talkmoretonight@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow transition"
              >
                ✉️ Send Your Story
              </a>
              <p className="text-xs text-gray-400 italic mt-2">
                We read every submission — your moment could inspire others!
              </p>
            </div>
          }
        />
      </div>


{/* Jazzed Up Navy & Lavender Checklist */}
<div
  className="max-w-xl mx-auto my-8 p-4 rounded-2xl shadow-lg border"
  style={{
    background: "linear-gradient(135deg, #16213e 70%, #e5d6fa 120%)", // navy to lavender
    borderColor: "#c1b4f7"
  }}
>
  <motion.h3
    className="text-lg font-extrabold mb-4 flex items-center gap-2"
    style={{ color: "#c1b4f7", letterSpacing: "0.02em" }}
    initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.5 }}
  >
    <span role="img" aria-label="sparkles">✨</span>
    Date Night Checklist
    <span role="img" aria-label="sparkles">✨</span>
  </motion.h3>
  <ul className="space-y-3 text-base">
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      style={{ color: "#fff" }}
    >
      <span style={{ color: "#a788ff", fontSize: "1.3em", marginRight: "0.5em" }}>💫</span>
      Outfit: <span className="italic" style={{ color: "#e5d6fa" }}>picked & ready!</span>
    </motion.li>
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      style={{ color: "#fff" }}
    >
      <span style={{ color: "#a788ff", fontSize: "1.3em", marginRight: "0.5em" }}>💜</span>
      Playlist: <span className="italic" style={{ color: "#e5d6fa" }}>mood is set…</span>
    </motion.li>
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
      style={{ color: "#fff" }}
    >
      <span style={{ color: "#a788ff", fontSize: "1.3em", marginRight: "0.5em" }}>⭐️</span>
      Magic from Friends: <span className="italic" style={{ color: "#e5d6fa" }}>discovered!</span>
    </motion.li>
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.9 }}
      style={{ color: "#fff" }}
    >
      <span style={{ color: "#a788ff", fontSize: "1.3em", marginRight: "0.5em" }}>💖</span>
      Free/Low-Cost idea: <span className="italic" style={{ color: "#e5d6fa" }}>in your back pocket ✨</span>
    </motion.li>
    <motion.li
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: [1, 1.14, 1] }}
      transition={{ delay: 1.1, repeat: Infinity, repeatDelay: 2, duration: 0.7 }}
      className="font-bold text-center"
      style={{ color: "#e5d6fa" }}
    >
      <span role="img" aria-label="fire" style={{ marginRight: "0.5em" }}>💫</span>
  Date’s prepped… now let’s{' '}
  <span className="italic whitespace-nowrap" style={{ color: "#fff" }}>
    make it legendary.
  </span>
</motion.li>
  </ul>
</div>

{/* FINAL call to action (jazzed up, less redundant) */}
<div className="max-w-xl mx-auto bg-white/40 backdrop-blur-md border border-[#c1b4f7] rounded-2xl p-7 shadow-lg mt-12 text-center">
  <p className="text-lg font-medium" style={{ color: "#7c69a4" }}>
    'Fit’s on fire. Playlist is ready. Vibe? Immaculate.  
    <span role="img" aria-label="sparkle">💫</span>
  </p>
  <p className="text-md font-bold mb-4 mt-4" style={{ color: "#16213e" }}>
    Now for the fun part, {userName}…  
    <br />
    What are you and {dateName} going to talk about?  
    <span role="img" aria-label="chat">💬</span>
  </p>
  <button
    onClick={() => navigate('/topics')}
    className="mx-auto block bg-gradient-to-r from-indigo-700 to-purple-400 hover:from-indigo-800 hover:to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-md transition"
    style={{ letterSpacing: "0.02em", fontSize: "1.18em" }}
  >
    Hot Topics Ahead 🔥
  </button>
</div>



    </div>
  );
};

export default Events;
