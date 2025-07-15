const evergreenTalkBoosters = {
  "Politics 🗳️": {
    "Trump & Legal Drama": [
      {
        prompt: "What most people don’t know about this",
        blurb: "It’s not just about court cases — it’s about how people feel democracy should work. You don’t need all the facts. Just listen with curiosity."
      }
    ]
  },
  "Talk of the Country 🇺🇸": {
    "Trending U.S. Topics": [
      {
        prompt: "Hot take, smart delivery",
        blurb: "If something’s trending, say 'I’m curious what people are actually *thinking* about this.' That opens up a real convo."
      }
    ]
  },
  "Tech & Gadgets 💻": {
    "AI Tools & Apps": [
      {
        prompt: "You don’t have to sound like a robot",
        blurb: "Ask which tool feels helpful vs. which ones are creepy. The best conversations are about boundaries — not downloads."
      }
    ]
  },
  "Business & Money 💼": {
    "Work Trends": [
      {
        prompt: "Let them talk about their hustle",
        blurb: "Ask what they think about 4-day workweeks or work-from-anywhere. People love talking about the *life* they want — not just the job."
      }
    ]
  },
  "Legal Drama ⚖️": {
    "Celebrity Trials": [
      {
        prompt: "What to say when you're not a lawyer",
        blurb: "Say something like: 'I saw that story, but I never know what’s real until it’s all over.' Then let them fill in the gaps."
      }
    ]
  },
  "True Crime 🔪": {
    "Netflix Docs": [
      {
        prompt: "Sound smart, not scary",
        blurb: "Say: 'I get why people love true crime — it’s basically psychology with better editing.'"
      }
    ]
  },
  "Environment & Climate 🌍": {
    "Weather Disasters": [
      {
        prompt: "Talk climate without doomsday",
        blurb: "Ask how climate has changed where they grew up. It gets personal *fast* — in a good way."
      }
    ]
  },
  "AI & Future Tech 🤖": {
    "Robot Takeover Jokes": [
      {
        prompt: "Have fun with it",
        blurb: "Say something like: 'If AI starts dating, I’m done.' It’s silly — but sneaks in a tech convo without being dry."
      }
    ]
  },
  "Travel ✈️": {
    "Dream Destinations": [
      {
        prompt: "Open-ended = magic",
        blurb: "Say: 'If you could go anywhere with zero planning, where would you land?' Then pause. That’s the spark."
      }
    ]
  },
  "Food & Restaurants 🍝": {
    "Trendy Restaurants": [
      {
        prompt: "Sound like you’ve eaten there",
        blurb: "Say: 'I’ve heard the vibe is better than the food — but that’s kind of the point, right?'"
      }
    ]
  },
  "Health & Fitness 🧘": {
    "Wellness Trends": [
      {
        prompt: "Keep it playful",
        blurb: "Say: 'Is this something that actually works — or is it just on TikTok?' Let them explain."
      }
    ]
  },
  "Fashion 👗": {
    "Trendy Looks": [
      {
        prompt: "Confidence > couture",
        blurb: "Say: 'I love when people have a look that’s *theirs*. Even if I could never pull it off.'"
      }
    ]
  },
  "Shopping 🛍️": {
    "Best Purchases": [
      {
        prompt: "Make it personal",
        blurb: "Say: 'What’s something you bought recently that felt like a little life upgrade?'"
      }
    ]
  },
  "Book Buzz 📚": {
    "BookTok Picks": [
      {
        prompt: "Smart + flirty",
        blurb: "Say: 'If someone made a BookTok about *you*, what would the title be?'"
      }
    ]
  },
  "Art & Museums 🖼️": {
    "Gallery Openings": [
      {
        prompt: "Even if you're not artsy",
        blurb: "Say: 'I don’t always get it, but I love hearing what people *see* in a piece.' Boom — smart."
      }
    ]
  },
  "Dating & Relationships ❤️": {
    "First Dates": [
      {
        prompt: "Keep it cute, not cringey",
        blurb: "Say: 'What’s one thing someone should *never* do on a first date?' Then laugh and pray you’re not doing it."
      }
    ]
  },
  "Viral & Memes 📱": {
    "TikTok Trends": [
      {
        prompt: "Low-effort gold",
        blurb: "Say: 'I saw this trend and instantly thought of you — but in a good way.' If they ask which one… uh oh."
      }
    ]
  },
  "Music 🎵": {
    "Pop": [
      {
        prompt: "Get them talking",
        blurb: "Say: 'Okay, defend your favorite pop artist in one sentence — go.' It’s fast, fun, and surprisingly deep."
      }
    ]
  },
  "Film 🎬": {
    "Blockbusters": [
      {
        prompt: "Use nostalgia",
        blurb: "Say: 'What movie made you feel like everything was possible?' Then bond over sequels that ruined it."
      }
    ]
  },
  "TV Shows 📺": {
    "Reality TV": [
      {
        prompt: "Smart + sassy",
        blurb: "Say: 'It’s not trash TV if you’re watching for character development.' Delivered with a wink."
      }
    ]
  },
  "Streaming & Reality 💅": {
    "Netflix Originals": [
      {
        prompt: "Break the ice",
        blurb: "Say: 'What’s your “watch it when I’m sick” show?' Then tell them yours, no shame."
      }
    ]
  },
  "Celebrity News 🌟": {
    "Breakups & Hookups": [
      {
        prompt: "Light but honest",
        blurb: "Say: 'I feel like we all project onto celeb couples. Which one do you *secretly* root for?'"
      }
    ]
  },
  "Award Shows & Red Carpets 🎭": {
    "Red Carpet Looks": [
      {
        prompt: "Make it a game",
        blurb: "Say: 'You get 5 seconds on the red carpet — what are you wearing, and who are you standing with?'"
      }
    ]
  },
  "Gaming 🎮": {
    "Cozy / Indie Games": [
      {
        prompt: "For casual or serious gamers",
        blurb: "Say: 'What game do you play when you just want your brain to go brrr?' It lands every time."
      }
    ]
  },
  "Indie Films 🎬": {
    "A24 Vibes": [
      {
        prompt: "Lean in to the mood",
        blurb: "Say: 'If our date was an A24 movie, what’s the title?' Then suggest 'Soft Lighting, Mild Panic.'"
      }
    ]
  },
  "Podcasts 🎧": {
    "Comedy & Pop Culture": [
      {
        prompt: "Steal this line",
        blurb: "Say: 'What’s a podcast you listen to even when the episode’s mid?' It says a lot."
      }
    ]
  },
  "Football 🏈": {
    "NFL Teams & Players": [
      {
        prompt: "Channel your inner announcer",
        blurb: "Say: 'What’s the one game you still talk about like you were *on* the field?'"
      }
    ]
  },
  "Basketball 🏀": {
    "NBA Drama": [
      {
        prompt: "Fuel the fun",
        blurb: "Say: 'Would you rather have courtside seats or GM power for one day?' Then let them explain every trade ever."
      }
    ]
  },
  "Baseball ⚾": {
    "MLB Highlights": [
      {
        prompt: "Make it playful",
        blurb: "Say: 'What’s the most romantic thing about baseball?' It’ll catch them off guard in the best way."
      }
    ]
  },
  "Hockey 🏒": {
    "Playoff Tension": [
      {
        prompt: "Say less, mean more",
        blurb: "Say: 'Stanley Cup energy just hits different, right?' Then let them rant or melt. Both are cute."
      }
    ]
  },
  "Golf ⛳": {
    "Big Tournament Buzz": [
      {
        prompt: "Make it cheeky",
        blurb: "Say: 'So if you made the cut at Augusta, what’s your walk-up song?'"
      }
    ]
  },
  "College Sports 🎓": {
    "March Madness": [
      {
        prompt: "Let them brag",
        blurb: "Say: 'What team *wrecked* your bracket last year?' Then follow up: 'You still mad about it?'"
      }
    ]
  },
  "Olympics 🏅": {
    "Gold Medal Moments": [
      {
        prompt: "Go gold",
        blurb: "Say: 'If your life had an Olympic sport, what would you medal in?'"
      }
    ]
  },
  "Sports Betting 🎲": {
    "Big Game Picks": [
      {
        prompt: "Be bold",
        blurb: "Say: 'You get one lock for the weekend — what’s your pick?' Then ask if they trust vibes or stats."
      }
    ]
  },
  "Concert Tours 🎤": {
    "Pop Tours": [
      {
        prompt: "Feel the excitement",
        blurb: "Say: 'If you scored surprise front row seats, what artist are you hoping walks on stage?'"
      }
    ]
  },
  "Festivals 🎪": {
    "Music + Camping Combos": [
      {
        prompt: "Camping convo that *doesn’t* suck",
        blurb: "Say: 'Could you survive a 3-day festival in 100-degree heat?' Then ask who makes it worth it."
      }
    ]
  },
  "Trending Events 🎉": {
    "Summer Hot Spots": [
      {
        prompt: "Keep it relevant",
        blurb: "Say: 'What’s one local thing you *still* haven’t done yet this summer?'"
      }
    ]
  },
  "Holiday Happenings 🎁": {
    "Family Traditions": [
      {
        prompt: "Lean into warmth",
        blurb: "Say: 'What’s the most underrated holiday tradition?' Then share one that’s a little weird but cute."
      }
    ]
  },
  "Major Weather Events ⛈️": {
    "Storm Prep & Reactions": [
      {
        prompt: "Get cozy",
        blurb: "Say: 'Power’s out. You’ve got snacks and one person to hang with — what are you doing?'"
      }
    ]
  },
  "Space & UFOs 🛸": {
    "Aliens & Conspiracies": [
      {
        prompt: "Let them get weird",
        blurb: "Say: 'Okay but *if* aliens came down tonight, what’s the first thing they’d roast us for?'"
      }
    ]
  },
  "Wildcard 🃏": {
    "Hot Takes": [
      {
        prompt: "Rapid fire fun",
        blurb: "Say: 'What’s your most unhinged opinion that you *know* is correct?'"
      }
    ]
  }
};

export default evergreenTalkBoosters;
