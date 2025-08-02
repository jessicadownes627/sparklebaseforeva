// ✅ Events.jsx — cleaned up version with fallback and Google Sheets
import React, { useState, useEffect } from "react";
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
import LongIslandFilmFestivalsCard from "../components/LongIslandFilmFestivalsCard";
import FlipCard from "../components/FlipCard";
import getWeatherTone from "../utils/getWeatherTone";
import CuratedDateCard from "../components/CuratedDateCard";
import confetti from "canvas-confetti";
import { fetchLongIslandMusic } from "../utils/fetchLongIslandMusic";
import LongIslandMusicFlipCard from "../components/LongIslandMusicFlipCard";
import energyThemes from "../data/energyThemes";
import fallbackFriendsSpotlight from "../data/fallbackFriendsSpotlight.js";
import { fetchFriendsSpotlightFromSheet } from "../utils/fetchFriendsSpotlightFromSheet";
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
  const safeFoodStyle = (foodStyle || "").toLowerCase(); // Always define before use

  console.log("USER DATA:", userData);
  console.log("RELATIONSHIP:", relationshipStatus);
  console.log("TIME OF DAY:", timeOfDay);
  console.log("DATE VIBE:", dateVibe);
  console.log("FOOD STYLE:", safeFoodStyle);
  console.log("FOUND PLAN:", curatedDatePlans?.[relationshipStatus]?.[timeOfDay]?.[vibeKey]?.[safeFoodStyle]);

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

  // --- NEW STATE FOR RANDOM PICKED LISTS ---
  const [randomClassicList, setRandomClassicList] = useState([]);
  const [randomHiddenGemList, setRandomHiddenGemList] = useState([]);
  const [randomLowCostList, setRandomLowCostList] = useState([]);

  useEffect(() => {
    const shuffleArray = (arr) => {
      return [...arr].sort(() => 0.5 - Math.random());
    };

    // Shuffle and pick 2 classic date ideas
    const classicRaw = Array.isArray(cityIdeasRaw)
      ? cityIdeasRaw
      : cityIdeasRaw
      ? [cityIdeasRaw]
      : [];
    setRandomClassicList(shuffleArray(classicRaw).slice(0, 2));

    // Shuffle and pick 2 hidden gems
    setRandomHiddenGemList(shuffleArray(hiddenGemsRaw).slice(0, 2));

    // Shuffle and pick 3 low cost ideas
    setRandomLowCostList(shuffleArray(lowCostIdeas).slice(0, 3));
  }, [cityKey, cityIdeasRaw, hiddenGemsRaw]);

  // Original random lowCostIdea is still usable if needed
  const lowCostIdea = lowCostIdeas[Math.floor(Math.random() * lowCostIdeas.length)];

  const showLongIsland =
    cityKey === "Long Island, NY" ||
    longIslandTowns.some(town =>
      normalizedCity.toLowerCase().includes(town.toLowerCase())
    );
  const weatherVibe = getWeatherTone(city, state);

  const [customPlaylistUrl, setCustomPlaylistUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("feminine");
  const [friendsSpotlight, setFriendsSpotlight] = useState([]);

  const cleanedOutfitStyle = ["Laid-back & Easy", "Confident & Sharp", "Statement Look"].includes(outfitStyle)
    ? outfitStyle
    : "Laid-back & Easy";

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

  // ✅ Spotlight logic from Google Sheets (with fallback)
  const permanentSpotlight = friendsSpotlight.find((f) =>
    f?.title?.toLowerCase().includes("talk more")
  );

  const rotatingSpotlights = friendsSpotlight.filter((f) =>
    f?.title && f.title !== permanentSpotlight?.title
  );

  const randomSpotlight = rotatingSpotlights.length > 0
    ? rotatingSpotlights[Math.floor(Math.random() * rotatingSpotlights.length)]
    : null;





   return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} px-6 pt-10 pb-32`}>
      <PageHeader />
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl font-light tracking-tight mb-2"> Thoughtfully designed for you and {dateName}</h2>
        <p className="italic text-lg">Crafted with care — ready to shine ✨</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {/* ✅ Restored original curated date FlipCard */}
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



{/* 🎴 Moved mystery ideas to their own FlipCard */}
<FlipCard
  disableFlipOnBack={true}
front={
  <div className="text-center space-y-2 py-3">
    <h3 className="text-xl font-bold mb-1 text-white">Shake it Up! 🎲</h3>
    <p className="italic text-base text-indigo-300">Roll with it and see where this takes you!</p>
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
            <p className="text-xs text-pink-700 mt-1">Bonus: Review it like you’re food critics on a secret mission!</p>
          </>
        )}
        {selectedOption === 3 && (
          <>
            <p>
              Let a coin flip decide your night: heads = new bar, tails = spontaneous dessert run.
            </p>
            <p className="text-xs text-pink-700 mt-1">No second guessing, just go!</p>
          </>
        )}
        {!selectedOption && (
          <p className="text-indigo-400">
            Not sure what to do? Tap a button and roll the dice!
          </p>
        )}
      </div>
      <div className="w-full mt-6 px-4 py-4 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl border border-indigo-100 text-center">
        <p className="font-semibold text-indigo-900 mb-1">✨ Feeling spontaneous?</p>
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

      {/* Style Toggle Buttons */}
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

      {/* Style Suggestions */}
      <div className="text-left space-y-2">
        {(outfitSuggestions[selectedStyle]?.[cleanedOutfitStyle] || []).map((suggestion, i) => (
          <p key={i}>• {suggestion}</p>
        ))}
      </div>

      {/* Optional tagline */}
      {styleSuggestions[cleanedOutfitStyle]?.energyTagline && (
        <p className="text-xs text-center italic text-gray-500 mt-2">
          {styleSuggestions[cleanedOutfitStyle].energyTagline}
        </p>
      )}

      {/* Optional Pinterest links */}
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

      <p className="text-[10px] text-center text-gray-400 italic mt-2">
        {`Flirty and legal${styleSuggestions[cleanedOutfitStyle]?.links ? ', just how we like it 💋' : '.'}`}
      </p>
    </div>
  }
/>


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




        {/* ✅ UPDATED CUSTOM PLAYLIST CARD */}
      
<FlipCard
  disableFlipOnBack={true}
  front={
    <div>
      <h3 className="text-xl font-bold mb-3">Make Your Own Playlist 🎧</h3>
      <p className="text-sm">Click to create your own vibe.</p>
    </div>
  }
  back={
    <div className="p-4" onClick={(e) => e.stopPropagation()}>
      <p className="text-sm mb-2 font-medium text-center">
        Want to make a custom playlist for <strong>{dateName}</strong>?
      </p>
      <input
        type="text"
        placeholder="Paste playlist link..."
        value={customPlaylistUrl}
        onChange={(e) => setCustomPlaylistUrl(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleSave}
        className="bg-[#0a2540] text-white w-full py-2 rounded hover:bg-[#133a67] transition"
      >
        Save Link
      </button>
      {successMsg && (
        <p className="text-green-600 text-sm text-center mt-2">Playlist saved! 💖</p>
      )}
      <div className="mt-4 px-3 py-3 bg-indigo-50 border border-indigo-300 rounded-md shadow text-center text-xs text-indigo-700 italic">
        🎵 Think you have a hot playlist? <br />
        Show us! Yours could be featured next…
      </div>
    </div>
  }
/>

{randomClassicList.length > 0 && (
  <FlipCard
    front={
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">📍 A Local Classic</h3>
        <p className="italic text-sm text-gray-300">
          Tried and true, always worth it.
        </p>
      </div>
    }
    back={
  <div className="p-4 bg-gradient-to-br from-white via-[#f3e8ff] to-[#e0f2fe] rounded-xl shadow-md text-sm text-[#0a2540] border border-white/60">


        {randomClassicList.map((idea, i) => (
          <p key={i}>• {idea}</p>
        ))}
        <p className="text-xs italic text-gray-500 pt-2">
          Local favorites are popular for a reason — but still feel personal when shared with the right person.
        </p>
      </div>
    }
  />
)}

{randomHiddenGemList.length > 0 && (
  <FlipCard
    front={
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Hidden Gems 🌟</h3>
        <p className="italic text-sm text-gray-300">
          Two secret spots to surprise them with…
        </p>
      </div>
    }
    back={
<div className="p-4 bg-gradient-to-br from-[#e0f2fe] via-[#d0f6f0] to-[#ccfbf1] rounded-xl shadow-md text-sm text-[#0a2540] border border-white/60">
        {randomHiddenGemList.map((gem, i) => (
          <p key={i}>• {gem}</p>
        ))}
        <p className="text-xs italic text-gray-500 pt-2">
          The best spots are the ones you almost miss.
        </p>
      </div>
    }
  />
)}

  {/* {showLongIsland && <LongIslandFilmFestivalsCard />} */}


        <FlipCard
  front={
    <div>
      <h3 className="text-xl font-bold mb-3">Free / Low-Cost Ideas 💡</h3>
      <p className="text-sm">
        Your date doesn't need a price tag to be unforgettable 💕
      </p>
    </div>
  }
back={
  <div className="p-4 text-sm space-y-2 bg-gradient-to-br from-[#fffde7] via-[#fff9c4] to-[#fff59d] rounded-xl shadow-md text-[#0a2540] border border-white/60">
    {randomLowCostList.map((idea, i) => (
      <p key={i}>
        • {idea.replace(/{dateName}/g, dateName)}
      </p>
    ))}
  </div>
}

/>


{/* Magic from Friends */}
{randomSpotlight?.title && (
  <FlipCard
    front={
      <div>
        <h3 className="text-xl font-bold mb-3">Magic from Friends ✨</h3>
        <p className="text-sm">Click to reveal hand-picked love from us 💖</p>
      </div>
    }
    back={
      <div className="p-4 text-sm text-[#0a2540] space-y-3">
        <h4 className="font-semibold text-lg">{randomSpotlight.title}</h4>
        {randomSpotlight.blurb && <p>{randomSpotlight.blurb}</p>}
        {randomSpotlight.url && (
          <a
            href={randomSpotlight.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
          >
            {randomSpotlight.linkText || "Read More"}
          </a>
        )}
      </div>
    }
  />
)}

{userData.state === "NY" && <LongIslandMusicFlipCard town={userData.city} />}





{/* Want to Be Featured */}
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
      Share your unique story with us and get a chance to be highlighted in the app!
    </p>
    <p className="mb-4">
      Whether you're creating something awesome, had a magical date, a funny moment, or a heartwarming memory — we want to celebrate it.
    </p>
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
}/>

  

      <div className="max-w-xl mx-auto bg-white/30 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-lg mt-12">
       <p className="text xl-center text-lg text-indigo-700 mb-2">
  ✨ You planned a great date with {dateName}. You know where to go and what to do. Get ready {userName}, because the real magic is just getting started! 💫
</p>

        <p className="text-xl font-bold text-center text-[#0a2540] mb-4 drop-shadow-sm">
          Let’s pick some topics to talk about! 💬
        </p>
        <button
          onClick={() => navigate('/topics')}
          className="mx-auto block bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-md transition"
        >
          Next: Pick Your Topics ➡️
        </button>
      </div>
      </div>
    </div>
  );
};

export default Events;
