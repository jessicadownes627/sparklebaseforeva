// ✅ Events.jsx — restored curated card and moved mystery options to new FlipCard
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import PageHeader from "../components/PageHeader";
import curatedDatePlans from "../data/curatedDatePlans";
import playlists from "../data/appleMusicPlaylists";
import appleCityPlaylists from "../data/appleCityPlaylists";
import friendsSpotlight from "../data/friendsSpotlight";
import cityDateIdeas from "../data/cityDateIdeas";
import starterCityDateIdeas from "../data/starterCityDateIdeas";
import hiddenGemIdeas from "../data/hiddenGemIdeas";
import energyThemes from "../data/energyThemes";
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
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";

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

const vibe = userData.energy; // "Dreamy ✨", etc.
const formattedCity = userData.city?.toLowerCase().trim();


  const vibeKey = dateVibe?.toLowerCase();
  const curatedPlan =
    curatedDatePlans?.[relationshipStatus]?.[timeOfDay]?.[locationType]?.[vibeKey]?.[foodStyle] || null;

  const theme = energyThemes?.[energy];
  const playlist = playlists?.[energy];

const rawCity = city?.trim().toLowerCase();
const normalizedCity = cityNameAliases[rawCity] || city?.trim();
const cityKey = normalizedCity; // ✅ use clean, matched key



  console.log("✅ cityKey:", cityKey);

const cityPlaylist = appleCityPlaylists?.[cityKey];
const finalDateIdeas = { ...starterCityDateIdeas, ...cityDateIdeas };
const finalHiddenGems = { ...starterHiddenGemIdeas, ...hiddenGemIdeas };
const cityIdeasRaw = finalDateIdeas?.[cityKey] || [];
const classicList = Array.isArray(cityIdeasRaw)
  ? cityIdeasRaw.slice(0, 2)
  : cityIdeasRaw
  ? [cityIdeasRaw]
  : [];

const hiddenGemsRaw = finalHiddenGems?.[cityKey] || [];
const hiddenGemList = hiddenGemsRaw.slice(0, 2);
  const lowCostIdea = lowCostIdeas[Math.floor(Math.random() * lowCostIdeas.length)];
const lowCostShuffled = [...lowCostIdeas].sort(() => 0.5 - Math.random()).slice(0, 3);

  const showLongIsland =
    cityKey === "Long Island, NY" ||
    longIslandTowns.some(town => normalizedCity.toLowerCase().includes(town.toLowerCase()));

  const permanentSpotlight = friendsSpotlight.find(f => f.title.includes("Talk More"));
  const rotatingSpotlights = friendsSpotlight.filter(f => f !== permanentSpotlight);
  const randomSpotlight = rotatingSpotlights[Math.floor(Math.random() * rotatingSpotlights.length)];
  const weatherVibe = getWeatherTone(city, state);

  const [customPlaylistUrl, setCustomPlaylistUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
const [selectedStyle, setSelectedStyle] = useState("feminine");
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

const renderMysteryDateOption = () => {
  let idea = "";

  if (selectedOption === 1) {
    idea = city
      ? `Check out something different in ${city}.`
      : "Check out something different nearby.";
  } else if (selectedOption === 3) {
    idea = lowCostIdea || "Pick a free museum, sunset spot, or picnic park.";
  } else {
    return (
      <p className="italic text-sm text-white/60">
        Click a button above to reveal a different idea for tonight.
      </p>
    );
  }

  return (
    <>
      <p className="italic break-words max-w-full">{idea}</p>
      <p className="text-xs text-gray-500 mt-2">
        Do you think {dateName} would be into this? 👀
      </p>
    </>
  );
};







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
          front={<div><h3 className="text-xl font-bold mb-3">Your Personalized Plan ✨</h3><p className="text-sm">Click to reveal your curated date idea!</p></div>}
          back={<CuratedDateCard userName={userName} dateName={dateName} relationshipStatus={relationshipStatus} timeOfDay={timeOfDay} dateVibe={dateVibe} foodStyle={foodStyle} locationType={locationType} nightType="classic" planText={curatedPlan} />}
        />





{/* 🎴 Moved mystery ideas to their own FlipCard */}
<FlipCard
  disableFlipOnBack={true}
  front={
    <div>
      <h3 className="text-xl font-bold mb-3">Custom Date Ideas ✨</h3>
      <p className="text-sm">Tap for other suggestions</p>
    </div>
  }
  back={
    <div className="p-4 text-sm text-[#0a2540] text-center" onClick={(e) => e.stopPropagation()}>
      <p className="font-medium mb-2">Try this for your date!</p>

      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() => setSelectedOption(1)}
          className="bg-white text-[#0a2540] px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          A New Idea
        </button>
        <button
          onClick={() => setSelectedOption(3)}
          className="bg-white text-[#0a2540] px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          Another Idea
        </button>
      </div>

      {/* 🧠 Curated Mystery Ideas */}
      <div className="mt-3 text-sm italic text-[#0a2540]">
        {selectedOption === 1 && (
          <>
            <p>
              Pick a spot in {city || "your city"} you’ve both never been — food, drink, or random bookstore — and rate it like critics.
            </p>
            <p className="text-xs text-gray-500 mt-2 italic">
              Think {dateName || "your date"} would be into a surprise rating game?
            </p>
          </>
        )}
        {selectedOption === 3 && (
          <>
            <p>
              Start with a drink somewhere calm — then flip a coin: heads = walk, tails = dessert. Let the randomness be the plan.
            </p>
            <p className="text-xs text-gray-500 mt-2 italic">
              You can blame it on the app later 😉
            </p>
          </>
        )}
        {!selectedOption && (
          <p className="italic text-sm text-white/60">
            Click a button above to reveal a different idea for tonight.
          </p>
        )}
      </div>

      {/* 💡 Local events prompt */}
      {city && (
        <div className="mt-6 text-sm text-[#0a2540]">
          <p className="mb-2 font-semibold">✨ Looking for something real-time?</p>
          <p className="mb-3">
            Explore what's happening in {city} right now — sometimes the best plans are unplanned.
          </p>
          <a
            href={`https://www.meetup.com/find/?location=${city.replaceAll(" ", "-")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Browse events on Meetup.com →
          </a>
          <p className="text-xs italic text-gray-400 mt-1">
            Not sponsored. Just a vibe check 🔍 Psst… Meetup.com uses your device’s location, not what you told us — If it doesn't match, update your location there.
          </p>
        </div>
      )}
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
            {key === "neutral" && "🌈 Neutral"}
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



        <FlipCard
  front={
    <div className="text-center p-4">
      <h3 className="text-xl font-bold mb-2"> Talk More Tonight's Playlist 🎶</h3>
      <p className="text-sm text-white/80">Ready for some good tunes?</p>
    </div>
  }
back={
  <div className="p-6 rounded-xl text-white bg-gradient-to-br from-pink-600 via-purple-500 to-indigo-500 shadow-lg space-y-5 text-center">
    <h4 className="text-2xl font-bold">{playlist.title}</h4>
    <p className="text-sm italic">
      Here's the perfect soundtrack to match your {energy.toLowerCase()} energy with {dateName}.
    </p>
    <a
      href={playlist.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 bg-white text-pink-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-pink-100 transition"
    >
      🎵 Open Vibe Playlist
    </a>

    {cityPlaylist && (
      <>
        <div className="border-t border-white/30 my-3" />
        <p className="text-sm italic">
          Oh — and since you're out in {city}, here's Apple’s Top 25 for your city. Enjoy, {userName}! 💫
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

{classicList.length > 0 && (
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


        {classicList.map((idea, i) => (
          <p key={i}>• {idea}</p>
        ))}
        <p className="text-xs italic text-gray-500 pt-2">
          Local favorites are popular for a reason — but still feel personal when shared with the right person.
        </p>
      </div>
    }
  />
)}

{hiddenGemList.length > 0 && (
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
        {hiddenGemList.map((gem, i) => (
          <p key={i}>• {gem}</p>
        ))}
        <p className="text-xs italic text-gray-500 pt-2">
          The best spots are the ones you almost miss.
        </p>
      </div>
    }
  />
)}

        {showLongIsland && <LongIslandFilmFestivalsCard />}

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
      {lowCostShuffled.map((idea, i) => (
        <p key={i}>• {idea}</p>
      ))}
    </div>
  }
/>


        <FlipCard
          front={<div><h3 className="text-xl font-bold mb-3">Magic from Friends ✨</h3><p className="text-sm">Click to reveal hand-picked love from us 💖</p></div>}
          back={<div className="p-4 text-sm"><h4 className="font-semibold text-lg mb-2">{randomSpotlight.title}</h4><p className="mb-3">{randomSpotlight.blurb}</p><a href={randomSpotlight.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm">{randomSpotlight.linkText}</a></div>}
        />

        <FlipCard
          front={<div><h3 className="text-xl font-bold mb-3">✨ Want to Be Featured?</h3><p className="text-sm">Tell us your story — We want to spotlight it 🌟</p></div>}
          back={<div className="p-4 text-sm"><h4 className="font-semibold text-lg mb-2">{permanentSpotlight.title}</h4><p className="mb-3">{permanentSpotlight.blurb}</p><a href={permanentSpotlight.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm">{permanentSpotlight.linkText}</a></div>}
        />
      </div>

      <div className="max-w-xl mx-auto bg-white/30 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-lg mt-12">
        <p className="text-center italic text-lg text-indigo-700 mb-2">
          Now that you know where to go and what to do… there's some more magic to uncover!
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
  );
};

export default Events;