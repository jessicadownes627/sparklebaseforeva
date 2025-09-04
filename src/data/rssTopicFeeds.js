// src/data/rssTopicFeeds.js

const feeds = {
  // 🧠 Smart & Curious
  "Politics 🗳️": [
    "https://feeds.npr.org/1001/rss.xml",
    "https://www.reutersagency.com/feed/?best-topics=politics"
  ],
  "Talk of the Country 🇺🇸": [
    "https://feeds.npr.org/1003/rss.xml",
    "https://apnews.com/rss"
  ],
  "Tech & Gadgets 💻": [
    "https://www.theverge.com/rss/index.xml",
    "https://www.wired.com/feed/rss"
  ],
  "Business & Money 💼": [
    "https://feeds.marketwatch.com/marketwatch/topstories",
    "https://www.reuters.com/markets/rss"
  ],
  "Legal Drama ⚖️": [
    "https://www.scotusblog.com/feed/",
    "https://www.abajournal.com/rss"
  ],
  "True Crime 🔪": [
    "https://abcnews.go.com/abcnews/crimeheadlines",
    "https://www.nbcnews.com/id/3032091/device/rss/rss.xml" // Crime/justice tag
  ],
  "Environment & Climate 🌍": [
    "https://feeds.npr.org/1025/rss.xml",
    "https://www.climatechangenews.com/feed/"
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
    "https://www.bonappetit.com/feed/rss",
    "https://www.seriouseats.com/rss"
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
    "https://lifehacker.com/tag/deals/rss"
  ],
  "Book Buzz 📚": [
    "https://www.publishersweekly.com/pw/feed/index.rss",
    "https://lithub.com/feed/"
  ],
  "Art & Museums 🖼️": [
    "https://hyperallergic.com/feed/",
    "https://www.smithsonianmag.com/rss/latest/"
  ],
  "Dating & Relationships ❤️": [
    "https://www.psychologytoday.com/us/experts/relationships/rss.xml",
    "https://www.mindbodygreen.com/rss/relationships"
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
    "https://www.hollywoodreporter.com/c/movies/movie-news/feed/",
    "https://variety.com/v/film/feed/"
  ],
  "TV Shows 📺": [
    "https://www.hollywoodreporter.com/c/tv/tv-news/feed/",
    "https://variety.com/v/tv/feed/"
  ],
  "Streaming & Reality 💅": [
    "https://www.vulture.com/rss/reality-tv/index.xml",
    "https://decider.com/feed/"
  ],
  "Celebrity News 🌟": [
    "https://people.com/feed/",
    "https://www.etonline.com/news/rss"
  ],
  "Award Shows & Red Carpets 🎭": [
    "https://variety.com/v/awards/feed/",
    "https://www.goldderby.com/feed/"
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
    "https://feeds.megaphone.fm/vergecast"
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
    "https://consequence.net/feed/",
    "https://www.billboard.com/music/music-festivals/feed/"
  ],
  "Trending Events 🎉": [
    "https://apnews.com/rss",
    "https://www.usatoday.com/record/rss/news/"
  ],
  "Holiday Happenings 🎁": [
    "https://www.countryliving.com/rss/",
    "https://www.goodhousekeeping.com/rss/"
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
    "https://mashable.com/feeds/rss/",
    "https://www.npr.org/rss/rss.php?id=1001"
  ]
};

export default feeds;
