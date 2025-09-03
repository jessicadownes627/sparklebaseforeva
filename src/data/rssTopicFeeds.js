const feeds = {
  // 🧠 Smart & Curious
  "Politics 🗳️": [
    "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
    "https://www.politico.com/rss/politics08.xml"
  ],
  "Talk of the Country 🇺🇸": [
    "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
    "https://www.npr.org/rss/rss.php?id=1003"
  ],
  "Tech & Gadgets 💻": [
    "https://www.theverge.com/rss/index.xml",
    "https://www.wired.com/feed/rss"
  ],
  "Business & Money 💼": [
    "https://feeds.marketwatch.com/marketwatch/topstories/",
    "https://www.reuters.com/markets/rss" // safer Reuters feed
  ],
  "Legal Drama ⚖️": [
    "https://www.law360.com/ (check if they offer an RSS for site updates)",
    "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/us.law/rss.xml"
  ],
  "True Crime 🔪": [
    "https://www.cbsnews.com/latest/rss/crime/",
    "https://feeds.megaphone.fm/crimejunkiepodcast" // popular true crime podcast feed
  ],
  "Environment & Climate 🌍": [
    "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml",
    "https://www.npr.org/rss/rss.php?id=1025"
  ],
  "AI & Future Tech 🤖": [
    "https://www.technologyreview.com/feed/",
    "https://www.theverge.com/artificial-intelligence/rss/index.xml"
  ],

  // 🌍 Culture & Entertainment
  "Travel ✈️": [
    "https://www.travelandleisure.com/rss",
    "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml"
  ],
  "Food & Restaurants 🍝": [
    "https://www.eater.com/rss/index.xml",
    "https://www.foodandwine.com/rss"
  ],
  "Health & Fitness 🧘": [
    "https://www.medicalnewstoday.com/rss",
    "https://www.self.com/feed/all"
  ],
  "Fashion 👗": [
    "https://www.vogue.com/feed/rss",
    "https://www.elle.com/rss/all.xml"
  ],
  "Shopping 🛍️": [
    "https://www.retaildive.com/feeds/news/",
    "https://www.theverge.com/deals/rss/index.xml"
  ],
  "Book Buzz 📚": [
    "https://www.npr.org/rss/rss.php?id=1032",
    "https://www.publishersweekly.com/pw/feeds/index.rss"
  ],
  "Art & Museums 🖼️": [
    "https://hyperallergic.com/feed/",
    "https://www.smithsonianmag.com/rss/latest/"
  ],
  "Dating & Relationships ❤️": [
    "https://www.cosmopolitan.com/rss/dating-relationships.xml",
    "https://www.psychologytoday.com/us/topics/relationships/rss.xml"
  ],
  "Viral & Memes 📱": [
    "https://mashable.com/feeds/rss/",
    "https://www.buzzfeed.com/world.xml"
  ],

  // 🎬 Screens & Sound
  "Music 🎵": [
    "https://pitchfork.com/rss/news/",
    "https://www.billboard.com/feed/"
  ],
  "Film 🎬": [
    "https://www.hollywoodreporter.com/movies/movie-news/feed/",
    "https://feeds.feedburner.com/ScreenRant" // active film & entertainment site
  ],
  "TV Shows 📺": [
    "https://www.hollywoodreporter.com/tv/tv-news/feed/",
    "https://rss.nytimes.com/services/xml/rss/nyt/Television.xml"
  ],
  "Streaming & Reality 💅": [
    "https://www.vulture.com/rss/reality-tv/index.xml",
    "https://feeds.feedburner.com/vulture/streaming" // other Vulture-specific feed
  ],
  "Celebrity News 🌟": [
    "https://www.etonline.com/news/rss",
    "https://people.com/celebrity/feed/"
  ],
  "Award Shows & Red Carpets 🎭": [
    "https://www.goldderby.com/feed/",
    "https://variety.com/v/awards/feed/"
  ],
  "Gaming 🎮": [
    "https://www.ign.com/rss",
    "https://www.polygon.com/rss/index.xml"
  ],
  "Indie Films 🎬": [
    "https://nofilmschool.com/rss.xml",
    "https://www.filmthreat.com/feed/"
  ],
  "Podcasts 🎧": [
    "https://podnews.net/rss",
    "https://feeds.megaphone.com/the-vergecast" // Verge podcast
  ],

  // 🏆 Sports & Action
  "Football 🏈": [
    "https://www.espn.com/espn/rss/nfl/news",
    "https://www.cbssports.com/rss/headlines/nfl/"
  ],
  "Basketball 🏀": [
    "https://www.espn.com/espn/rss/nba/news",
    "https://www.cbssports.com/rss/headlines/nba/"
  ],
  "Baseball ⚾": [
    "https://www.espn.com/espn/rss/mlb/news",
    "https://www.mlbtraderumors.com/feed"
  ],
  "Hockey 🏒": [
    "https://www.espn.com/espn/rss/nhl/news",
    "https://www.nhl.com/rss/news"
  ],
  "Golf ⛳": [
    "https://www.espn.com/espn/rss/golf/news",
    "https://www.golfdigest.com/feed/rss"
  ],
  "College Sports 🎓": [
    "https://www.espn.com/espn/rss/ncf/news",
    "https://www.espn.com/espn/rss/ncb/news"
  ],
  "Olympics 🏅": [
    "https://olympics.com/en/news.rss",
    "https://www.teamusa.com/rss"
  ],
  "Sports Betting 🎲": [
    "https://www.sportingnews.com/us/rss/category/betting",
    "https://www.actionnetwork.com/feed"
  ],

  // 🎉 What’s Hot
  "Concert Tours 🎤": [
    "https://www.rollingstone.com/music/music-news/feed/",
    "https://www.billboard.com/feed/"
  ],
  "Festivals 🎪": [
    "https://www.billboard.com/music/music-festivals/feed/",
    "https://consequence.net/feed/"
  ],
  "Trending Events 🎉": [
    "https://apnews.com/rss",
    "https://www.usatoday.com/record/rss/news/"
  ],
  "Holiday Happenings 🎁": [
    "https://www.countryliving.com/rss/",
    "https://www.townie.com/rss"
  ],
  "Major Weather Events ⛈️": [
    "https://www.accuweather.com/en/rss",
    "https://www.weather.gov/rss_page.php?site_name=nws"
  ],
  "Space & UFOs 🛸": [
    "https://www.space.com/feeds/all",
    "https://www.nasa.gov/rss/dyn/breaking_news.rss"
  ],
  "Wildcard 🃏": [
    "https://www.npr.org/rss/rss.php?id=1001",
    "https://mashable.com/feeds/rss/"
  ]
};

export default feeds;
