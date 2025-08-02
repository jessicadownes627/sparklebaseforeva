const newsKeywordMap = {
  "AI & Future Tech 🤖": [
    "AI breakthrough", "artificial intelligence", "robotics", "machine learning", "Neuralink", "OpenAI", "future tech", "tech innovation"
  ],
  "True Crime 🔪": [
    "crime investigation", "crime", "police report", "arrest made", "public safety", "criminal case", "FBI", "robbery"
  ],
  "Podcasts 🎧": [
    "podcast episode", "true crime podcast", "celebrity podcast", "Spotify podcast", "Apple Podcasts", "podcast trend", "new podcast release"
  ],
  "Environment & Climate 🌍": [
    "climate change", "global warming", "carbon emissions", "sustainability", "clean energy", "environmental policy"
  ],
  "Art & Museums 🖼️": [
    "art exhibit", "museum opening", "gallery show", "art auction", "installation art", "famous painting"
  ],
  "Olympics 🏅": [
    "Olympics", "Team USA", "gold medal", "Olympic qualifying", "Simone Biles", "track and field"
  ],
  "Space & UFOs 🛸": [
    "NASA launch", "UFO sighting", "space mission", "alien encounter", "James Webb Telescope", "Mars rover", "space station"
  ],
  "Book Buzz 📚": [
    "book release", "bestseller", " author ", "memoir", "book signing", "literary award"
  ],
  "Music 🎵": [
    "album", "music", "tour", "live concert", "Grammy", "Billboard", "musician", "drummer", "guitar", "Coachella"
  ],
  "Gaming 🎮": [
    "game release", "Nintendo", "PlayStation", "Xbox", "Minecraft", "Roblox"
  ],
  "Politics 🗳️": [
    "Congress vote", "White House", "Senate hearing", "Supreme Court ruling", "governor race"
  ],
  "Talk of the Country 🇺🇸": [
    "Donald Trump", "Trump trial","Trump", "Trump indictment", "Trump conviction", "Biden speech", "RFK Jr", "presidential election"
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
    "wellness", "fitness tips", "healthy", "health", "fitness", "diet", "nutrition", "workout ideas", "healthy living"
  ],
  "Travel ✈️": [
    "travel advisory", "plane", "TSA update", "passport", "destination spotlight", "flight"
  ],
  "Food & Restaurants 🍝": [
    "restaurant opening", "new menu", "food trend", "celebrity chef", "Michelin guide"
  ],
  "Fashion 👗": [
    "fashion week", "Met Gala", "runway trends", "designer collection", "style icon"
  ],
  "Shopping 🛍️": [
    "limited edition", "brand", "retail", "Amazon", "shopping trend"
  ],
  "Film 🎬": [
    "movie release", "box office", "Oscar nominee", "director interview", "film premiere"
  ],
  "TV Shows 📺": [
    "TV series", "tv show", "season premiere", "Netflix", "episode recap", "streaming", "HBO drama"
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
    "MLB", "Yankees", "Mets", "Aaron Judge", "Shohei Ohtani"
  ],
  "Football 🏈": [
    "NFL", "Super Bowl", "quarterback", "Jets", "Eagles"
  ],
  "Basketball 🏀": [
    "NBA", "Knicks", "Jalen Brunson", "buzzer beater", "LeBron James", "NBA Finals"
  ],
  "Hockey 🏒": [
    "Stanley Cup", "NHL", "goalie", "hat trick"
  ],
  "Golf ⛳": [
    "PGA Tour", "The Masters", "golf", "Tiger Woods", "US Open golf"
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


