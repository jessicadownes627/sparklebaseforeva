// src/data/rssTopicFeeds.js
// Clean and reliable RSS feeds for all topics

const feeds = {
  // 🧠 Smart & Curious
  "Politics 🗳️": [
    "https://feeds.npr.org/1014/rss.xml",              // NPR Politics :contentReference[oaicite:1]{index=1}
    "https://apnews.com/politics.rss"                 // AP News Politics :contentReference[oaicite:2]{index=2}
  ],
  "Talk of the Country 🇺🇸": [
    "https://apnews.com/rss/apf-usnews.xml",          // AP US News
    "https://feeds.npr.org/1003/rss.xml"
  ],
  "Tech & Gadgets 💻": [
    "https://www.theverge.com/rss/index.xml",
    "https://www.wired.com/feed/rss"
  ],
  "Business & Money 💼": [
    "https://feeds.marketwatch.com/marketwatch/topstories/",
    "https://www.reuters.com/markets/rss"
  ],
  "Legal Drama ⚖️": [
    "https://www.reuters.com/legal/rss",
    "https://www.law.com/rss"
  ],
  "True Crime 🔪": [
    "https://rss.nytimes.com/services/xml/rss/nyt/Crime.xml",
    "https://www.courtlistener.com/feed/"
  ],
  "Environment & Climate 🌍": [
    "https://feeds.npr.org/1025/rss.xml",
    "https://www.theguardian.com/environment/rss"
  ],
  "AI & Future Tech 🤖": [
    "https://www.technologyreview.com/feed/",
    "https://www.theverge.com/artificial-intelligence/rss/index.xml"
  ],

  // 🌍 Culture & Entertainment
  "Travel ✈️": [
    "https://www.travelandleisure.com/rss",
    "https://www.lonelyplanet.com/news/rss"
  ],
  "Food & Restaurants 🍝": [
    "https://www.seriouseats.com/rss",
    "https://www.foodnetwork.com/content/food-com/en/rss.xml"
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
    "https://lithub.com/feed/",
    "https://www.publishersweekly.com/pw/feeds/index.rss"
  ],
  "Art & Museums 🖼️": [
    "https://hyperallergic.com/feed/",
    "https://www.smithsonianmag.com/rss/latest/"
  ],
  "Dating & Relationships ❤️": [
    "https://www.cosmopolitan.com/rss/dating-relationships.xml",
    "https://www.psychologytoday.com/atom/49836"
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
    "https://variety.com/v/film/feed/",
    "https://www.indiewire.com/c/film/feed/"
  ],
  "TV Shows 📺": [
    "https://tvline.com/feed/",
    "https://www.hollywoodreporter.com/tv/tv-news/feed/"
  ],
  "Streaming & Reality 💅": [
    "https://decider.com/feed/",
    "https://www.realityblurred.com/realitytv/feed/"
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
    "https://feeds.megaphone.fm/vergecast"
  ],

  // 🏆 Sports & Action
  "Football 🏈": [
    "https://www.espn.com/espn/rss/nfl/news.xml",
    "https://feeds.si.com/rss/si_nfl"
  ],
  "Basketball 🏀": [
    "https://www.espn.com/espn/rss/nba/news.xml",
    "https://feeds.si.com/rss/si_nba"
  ],
  "Baseball ⚾": [
    "https://www.espn.com/espn/rss/mlb/news.xml",
    "https://www.mlbtraderumors.com/feed"
  ],
  "Hockey 🏒": [
    "https://www.espn.com/espn/rss/nhl/news.xml",
    "https://www.nhl.com/rss/news"
  ],
  "Golf ⛳": [
    "https://www.espn.com/espn/rss/golf/news.xml",
    "https://www.golfdigest.com/feed/rss"
  ],
  "College Sports 🎓": [
    "https://www.espn.com/espn/rss/ncf/news.xml",
    "https://www.espn.com/espn/rss/ncb/news.xml"
  ],
  "Olympics 🏅": [
    "https://olympics.com/en/news.rss",
    "https://www.teamusa.com/rss"
  ],
  "Sports Betting 🎲": [
    "https://www.sportingnews.com/us/rss/category/betting",
    "https://www.actionnetwork.com/feed"
  ],

  // 🎉  What’s Hot
  "Concert Tours 🎤": [
    "https://www.rollingstone.com/music/music-news/feed/",
    "https://www.billboard.com/feed/"
  ],
  "Festivals 🎪": [
    "https://www.billboard.com/music/music-festivals/feed/",
    "https://consequence.net/feed/"
  ],
  "Trending Events 🎉": [
    "https://apnews.com/rss/apf-topnews.xml",
    "https://www.usatoday.com/record/rss/news/"
  ],
  "Holiday Happenings 🎁": [
    "https://www.countryliving.com/rss/",
    "https://www.goodhousekeeping.com/holidays/rss/"
  ],
  "Major Weather Events ⛈️": [
    "https://www.weather.com/rss",
    "https://www.weather.gov/rss_page.php?site_name=nws"
  ],
  "Space & UFOs 🛸": [
    "https://www.nasa.gov/rss/dyn/breaking_news.rss",
    "https://www.space.com/feeds/all"
  ],
  "Wildcard 🃏": [
    "https://feeds.npr.org/1001/rss.xml",
    "https://mashable.com/feeds/rss/"
  ]
};

export default feeds;
