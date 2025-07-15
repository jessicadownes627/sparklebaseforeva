const newsKeywordMap = {
  "AI & Future Tech 🤖": [
    "AI breakthrough", "artificial intelligence", "robotics", "machine learning", "Neuralink", "OpenAI", "future tech", "tech innovation"
  ],
  "True Crime 🔪": [
    "crime investigation", "police report", "arrest made", "public safety", "criminal case", "FBI", "robbery"
  ],
  "Podcasts 🎧": [
    "podcast episode", "true crime podcast", "celebrity podcast", "Spotify podcast", "Apple Podcasts", "podcast trend", "new podcast release"
  ],
  "Environment & Climate 🌍": [
    "climate change", "global warming", "carbon emissions", "sustainability", "climate summit", "clean energy", "environmental policy"
  ],
  "Art & Museums 🖼️": [
    "art exhibit", "museum opening", "gallery show", "art auction", "installation art", "famous painting"
  ],
  "Olympics 🏅": [
    "Olympic Games", "Team USA", "gold medal", "Olympic qualifying", "Paris 2024", "track and field"
  ],
  "Space & UFOs 🛸": [
    "NASA launch", "UFO sighting", "space mission", "alien encounter", "James Webb Telescope", "Mars rover", "space station"
  ],
  "Book Buzz 📚": [
    "book release", "bestseller", "author interview", "book signing", "literary award"
  ],
  "Music 🎵": [
    "new album", "music tour", "live concert", "Grammy Awards", "Billboard chart", "Coachella"
  ],
  "Gaming 🎮": [
    "game release", "Nintendo", "PlayStation", "Xbox", "Minecraft", "Roblox", "video game update"
  ],
  "Politics 🗳️": [
    "Congress vote", "White House", "Senate hearing", "Supreme Court ruling", "governor race"
  ],
  "Talk of the Country 🇺🇸": [
    "Donald Trump", "Trump trial", "Trump indictment", "Trump conviction", "Biden speech", "RFK Jr", "presidential election"
  ],
  "Business & Money 💼": [
    "Wall Street", "stock market", "inflation report", "layoffs", "earnings report", "startup funding"
  ],
  "Tech & Gadgets 💻": [
    "Apple event", "Google Pixel", "Meta news", "Elon Musk", "new smartphone", "AI chatbot"
  ],
  "Legal Drama ⚖️": [
    "criminal trial", "lawsuit", "verdict", "court documents", "Karen Read", "Read trial", "Massachusetts trial"
  ],
  "Health & Fitness 🧘": [
    "wellness", "fitness tips", "nutrition", "workout ideas", "healthy living"
  ],
  "Travel ✈️": [
    "travel advisory", "TSA update", "passport", "destination spotlight", "flight delays"
  ],
  "Food & Restaurants 🍝": [
    "restaurant opening", "new menu", "food trend", "celebrity chef", "Michelin guide"
  ],
  "Fashion 👗": [
    "fashion week", "Met Gala", "runway trends", "designer collection", "style icon"
  ],
  "Shopping 🛍️": [
    "limited edition", "brand launch", "retail news", "Amazon sale", "shopping trend"
  ],
  "Film 🎬": [
    "movie release", "box office", "Oscar nominee", "director interview", "film premiere"
  ],
  "TV Shows 📺": [
    "TV series", "season premiere", "Netflix hit", "episode recap", "HBO drama"
  ],
  "Streaming & Reality 💅": [
    "reality TV", "Netflix drama", "Love Is Blind", "The Bachelor", "Bravo show"
  ],
  "Celebrity News 🌟": [
    "celebrity couple", "Hollywood breakup", "celebrity baby", "paparazzi", "engagement rumor"
  ],
  "Dating & Relationships ❤️": [
    "relationship advice", "dating app trend", "first date ideas", "modern love"
  ],
  "Wildcard 🃏": [
    "weird news", "viral story", "strange headline", "unusual event"
  ],
  "Trending Events 🎉": [
    "things to do", "local events", "weekend guide", "festival news"
  ],
  "Holiday Happenings 🎁": [
    "holiday events", "Fourth of July", "fireworks", "gift guide", "holiday weekend"
  ],
  "Major Weather Events ⛈️": [
    "storm warning", "hurricane", "blizzard", "heat wave", "flooding"
  ],
  "Baseball ⚾": [
    "MLB game", "Yankees", "Mets", "Aaron Judge", "Shohei Ohtani", "walk-off win"
  ],
  "Football 🏈": [
    "NFL news", "Super Bowl", "quarterback", "Jets", "Eagles", "touchdown pass"
  ],
  "Basketball 🏀": [
    "NBA playoffs", "Knicks", "Jalen Brunson", "buzzer beater", "LeBron James", "NBA Finals"
  ],
  "Hockey 🏒": [
    "Stanley Cup", "NHL playoffs", "power play", "goalie save", "hat trick"
  ],
  "Golf ⛳": [
    "PGA Tour", "The Masters", "golf swing", "Tiger Woods", "US Open golf"
  ],
  "College Sports 🎓": [
    "NCAA", "college football", "college basketball", "student athlete"
  ],
  "Sports Betting 🎲": [
    "sports betting", "DraftKings", "FanDuel", "betting odds"
  ],
  "Concert Tours 🎤": [
    "concert tour", "live performance", "stadium show", "sold out concert"
  ],
  "Award Shows & Red Carpets 🎭": [
    "Oscars", "Golden Globes", "red carpet", "best dressed", "award speech"
  ],
  "Indie Films 🎬": [
    "indie film", "Sundance", "arthouse", "limited release"
  ],
  "Festivals 🎪": [
    "music festival", "film festival", "food festival", "arts festival"
  ],
  "Viral & Memes 📱": [
    "TikTok trend", "viral meme", "funny video", "internet moment"
  ]
};

const badWordsByTopic = {
  "Legal Drama ⚖️": ["sportsbook", "betting", "casino"],
  "Gaming 🎮": ["stock", "earnings", "NBA", "NFL", "Knicks", "Trump"],
  "Shopping 🛍️": ["real estate", "retail investment"],
  "Travel ✈️": ["hospital", "clinic", "funeral", "disease"],
  "Fashion 👗": ["volcano", "eruption", "excavation"],
  "Baseball ⚾": ["murder", "Trump", "crash", "collapse", "politics"],
  "Health & Fitness 🧘": ["cancer", "chemo", "ICU"]
};

export { newsKeywordMap, badWordsByTopic };


