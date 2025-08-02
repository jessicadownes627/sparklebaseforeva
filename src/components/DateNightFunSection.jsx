import React, { useState } from "react";

const rapidFireQuestions = [
  "Sweet or salty snacks?",
  "Netflix binge or outdoor adventure?",
  "Mountains or beach?",
  "Texting or calling?",
  "Summer or winter?",
  "Comedy or drama?",
  "City trip or countryside escape?",
  "Pizza or burgers?",
  "Books or movies?",
  "Save or spend?",
  "Sunrise or sunset?",
  "Sweet dreams or power naps?",
  "Phone on silent or buzzing all day?",
  "Road trip playlist or podcasts?",
  "Pancakes or waffles?",
  "Sneakers or sandals?",
  "Horror movies or romantic comedies?",
  "Beach read or binge-watch?",
  "Sunrise yoga or evening chill?",
  "Sneakers or barefoot?",
  "Staycation or jet-setting?",
  "Karaoke night or game night?",
  "DIY or buy it ready-made?",
  "Text emoji overload or none at all?",
  "Night out or Netflix in?",
  "Hot chocolate or iced coffee?",
  "Sweet tooth or savory crave?",
  "Sneakers or flip-flops?",
  "Call or text first?",
  "Plan or go with the flow?",
  "Introvert or extrovert?",
  "Dine in or takeout?",
  "Dance or sing?",
  "Netflix recommendation or surprise pick?",
  "Group trip or solo adventure?",
  "Text in all caps or no caps at all?",
  "Phone battery 5% — panic or chill?",
  "Window seat or aisle seat?",
  "Call or video chat?",
  "Mountains for hiking or lakes for swimming?",
  "Big party or small gathering?",
  "Chocolate or vanilla?",
  "Messy hair or perfectly styled?",
  "Netflix thriller or documentary?",
  "Shoes on or shoes off inside?",
  "Starbucks or local coffee shop?",
  "Morning workout or evening stroll?",
  "Planner or spontaneous adventurer?",
  "Introvert recharge or extrovert energy?",
  "Board games or video games?",
  "Ice cream cone or popsicle?",
  "Sunbathing or hiking?",
  "Bookshelf or e-reader?",
  "Camping or luxury hotel?",
  "Call your crush or wait for them to call you?",
  "Pizza with pineapple — yes or no?",
  "Text back immediately or wait a bit?",
  "Favorite season: spring, summer, fall, or winter?",
  "Reality TV or scripted drama?",
  "Morning shower or night shower?",
  "Sweet breakfast or savory breakfast?",
  "Roller coasters or Ferris wheel?",
  "Breakfast for dinner or dinner for breakfast?",
  "Dance in the rain or stay cozy inside?",
  "Shop online or in-store?",
  "Favorite superhero or favorite villain?",
  "Cats wearing hats — adorable or no way?",
  "Favorite ice cream topping: sprinkles or hot fudge?",
  "City lights or starry skies?",
  "Sunset hike or sunrise jog?",
  "Singing in the car or quiet driver?",
  "Coffee black or with cream and sugar?",
  "Read minds or be invisible?",
  "Text emoji overload — love it or hate it?"
];


const trivia = [
  "The longest recorded flight of a chicken is 13 seconds.",
  "Couples who laugh together stay together longer, according to studies.",
  "The scent of vanilla is known to reduce stress and promote relaxation.",
  "Honey never spoils; edible honey has been found in ancient tombs.",
  "Octopuses have three hearts and blue blood.",
  "Bananas are berries, but strawberries aren’t.",
  "The Eiffel Tower can be 15 cm taller during hot days.",
  "Honey never spoils; edible honey has been found in ancient Egyptian tombs.",
  "Sharks have been around longer than trees.",
  "A group of flamingos is called a ‘flamboyance.’",
  "Listening to music releases dopamine, the brain’s ‘feel-good’ chemical.",
  "The shortest war in history lasted 38 minutes.",
  "Humans share about 60% of their DNA with bananas.",
  "The longest recorded flight of a chicken is 13 seconds.",
  "Cleopatra lived closer to the moon landing than to the building of the Great Pyramid.",
  "Your nose can remember 50,000 different scents.",
  "The oldest known ‘your mom’ joke dates back 3,500 years.",
  "A day on Venus is longer than a year on Venus.",
  "Oxford University is older than the Aztec Empire.",
  "Sea otters hold hands while they sleep to keep from drifting apart.",
  "The Twitter bird’s official name is ‘Larry.’",
  "Hot water freezes faster than cold water under certain conditions.",
  "Humans glow faintly in the dark, but it’s too weak for our eyes to see."
];

const miniChallenges = [
  "Find a song lyric that best describes your mood tonight and share why.",
  "Swap your favorite childhood memory and guess each other’s reactions.",
  "Make up a funny ‘origin story’ for how you met — even if it’s totally fake.",
  "Choose a random object nearby and invent a secret meaning for it together.",
  "Try to go through a conversation using only questions for the next 5 minutes.",
  "Describe your perfect day without using the words ‘perfect’ or ‘day.’",
  "Guess your date's favorite movie based on just three clues.",
  "Find a song lyric that perfectly captures your current mood and share why.",
  "Share a funny or embarrassing story from your past.",
  "Take turns listing things you’re grateful for today.",
  "Plan your next mini-adventure or date idea on the spot.",
  "Challenge each other to find something in the room you think the other will like.",
  "Make up a new handshake or greeting just for the two of you.",
  "Take a moment to share what made you smile today.",
];


function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const DateNightFunSection = () => {
  const [shuffledRapidFire, setShuffledRapidFire] = useState(() => shuffleArray(rapidFireQuestions));
  const [shuffledTrivia, setShuffledTrivia] = useState(() => shuffleArray(trivia));
  const [shuffledChallenges, setShuffledChallenges] = useState(() => shuffleArray(miniChallenges));

  const reshuffleAll = () => {
    setShuffledRapidFire(shuffleArray(rapidFireQuestions));
    setShuffledTrivia(shuffleArray(trivia));
    setShuffledChallenges(shuffleArray(miniChallenges));
  };

  return (
    <div className="mt-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 p-6 bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 rounded-xl text-white shadow-lg text-sm">

      <section>
        <h3 className="text-xl font-bold mb-4">⚡ Rapid Fire Questions</h3>
        <ul className="list-disc list-inside space-y-2">
          {shuffledRapidFire.slice(0, 5).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">✨ Conversation-Worthy Trivia</h3>
        <ul className="list-disc list-inside space-y-2">
          {shuffledTrivia.slice(0, 3).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">🎉 Mini Date Challenges</h3>
        <ul className="list-disc list-inside space-y-2">
          {shuffledChallenges.slice(0, 3).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <button
        onClick={reshuffleAll}
        className="col-span-full mt-6 bg-indigo-600 hover:bg-indigo-700 rounded-md py-2 font-semibold"
      >
        🔄 Shuffle All
      </button>
    </div>
  );
};

export default DateNightFunSection;
