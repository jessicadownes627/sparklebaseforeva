// src/data/rssTopicFeeds.js

const feeds = {
  //  Main Topics
  "Politics 🗳️": [
    "https://feeds.npr.org/1001/rss.xml",
    "https://www.reuters.com/politics/NewsFeed"
  ],
  "Talk of the Country 🇺🇸": [
    "https://feeds.npr.org/1003/rss.xml",
    "https://apnews.com/hub/us-news?outputType=xml"
  ],
  "Tech & Gadgets 💻": [
    "https://www.theverge.com/rss/index.xml",
    "https://www.wired.com/feed/rss"
  ],
  "Business & Money 💼": [
    "https://feeds.marketwatch.com/marketwatch/topstories",
    "https://www.reuters.com/financeNews"
  ],
  "Legal Drama ⚖️": [
    "https://www.scotusblog.com/feed/",
    "https://www.abajournal.com/rss"
  ],
  "True Crime 🔪": [
    "https://abcnews.go.com/abcnews/crimeheadlines",
    "https://www.nbcnews.com/id/3032091/device/rss/rss.xml",
    "https://www.cbsnews.com/latest/rss/crime/"

  ],
  "Environment & Climate 🌍": [
    "https://feeds.npr.org/1025/rss.xml",
    "https://www.climatechangenews.com/feed/"
  ],
  "AI & Future Tech 🤖": [
    "https://www.technologyreview.com/feed/",
    "https://www.theverge.com/artificial-intelligence/rss/index.xml"
  ],
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
  "Concert Tours 🎤": [
    "https://www.rollingstone.com/music/music-news/feed/",
    "https://www.billboard.com/feed/"
  ],
  "Festivals 🎪": [
    "https://consequence.net/feed/",
    "https://www.billboard.com/music/music-festivals/feed/"
  ],
  "Trending Events 🎉": [
    "https://apnews.com/hub/trending?outputType=xml",
    "https://www.usatoday.com/record/rss/news"
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
  ],

  //  Subtopics (wired up to feeds)
  "ChatGPT & AI Tools": [
    "https://www.technologyreview.com/feed/rss",
    "https://www.theverge.com/artificial-intelligence/rss/index.xml"
  ],
  "Ethics & Innovation": [
    "https://www.technologyreview.com/feed/rss"
  ],
  "Robot Takeover Jokes": [
    "https://www.theverge.com/artificial-intelligence/rss/index.xml"
  ],
  "Controversial Art": [
    "https://hyperallergic.com/feed/"
  ],
  "Gallery Openings": [
    "https://hyperallergic.com/feed/"
  ],
  "TikTok Goes to the Museum": [
    "https://www.artsy.net/articles/rss"
  ],
  "Award Snubs": [
    "https://variety.com/v/awards/feed/"
  ],
  "Memorable Speeches": [
    "https://www.goldderby.com/feed/"
  ],
  "Red Carpet Looks": [
    "https://people.com/feed/"
  ],
  "Ballpark Culture": [
    "http://feeds.espncricinfo.com/ESPNcricinfo"
  ],
  "MLB Highlights": [
    "https://www.mlbtraderumors.com/feed"
  ],
  "Yankees & Mets Updates": [
    "https://www.mlb.com/yankees/rss/news"
  ],
  "NBA Drama": [
    "https://www.espn.com/espn/rss/nba/news"
  ],
  "Playoff Highlights": [
    "https://www.cbssports.com/rss/headlines/nba"
  ],
  "Trade Rumors": [
    "https://www.espn.com/nba/team/_/name/lal/news"
  ],
  "BookTok Picks": [
    "https://lithub.com/feed/"
  ],
  "Books That Spark Debate": [
    "https://www.publishersweekly.com/pw/feed/index.rss"
  ],
  "Summer Reads": [
    "https://www.goodreads.com/rss"
  ],
  "Corporate Culture Shifts": [
    "https://www.wsj.com/xml/rss/3_11543.xml"
  ],
  "Layoffs & Hiring Trends": [
    "https://www.reuters.com/technology"
  ],
  "Market Mayhem": [
    "https://www.marketwatch.com/rss/topstories"
  ],
  "Breakups & Hookups": [
    "https://people.com/feed/"
  ],
  "Messy Interviews": [
    "https://ew.com/rss/ew-top-stories/"
  ],
  "Style Transformations": [
    "https://people.com/style/feed/"
  ],
  "March Madness": [
    "https://www.ncaa.com/news/basketball-men"
  ],
  "Players to Watch": [
    "https://www.cbssports.com/college-basketball/news"
  ],
  "Rivalry Games": [
    "https://www.espn.com/mens-college-basketball/rss"
  ],
  "Pop Tours": [
    "https://www.billboard.com/feed/"
  ],
  "Tour Ticket Chaos": [
    "https://www.rollingstone.com/music/music-news/feed/"
  ],
  "Who’s Worth Seeing Live": [
    "https://www.billboard.com/feed/"
  ],
  "First Dates": [
    "https://www.psychologytoday.com/us/experts/relationships/rss.xml"
  ],
  "Green Flags & Icks": [
    "https://www.mindbodygreen.com/rss/relationships"
  ],
  "Modern Love Rules": [
    "https://www.nytimes.com/section/love/feed"
  ],
  "Eco-Friendly Trends": [
    "https://www.climatechangenews.com/feed/"
  ],
  "Weather Disasters": [
    "https://www.weather.gov/rss_page.php?site_name=nws"
  ],
  "GymTok & Challenges": [
    "https://www.self.com/feed/all"
  ],
  "Wellness Trends": [
    "https://www.health.com/rss"
  ],
  "Blockbusters": [
    "https://www.hollywoodreporter.com/c/movies/movie-news/feed/"
  ],
  "Movie Theaters vs. Streaming": [
    "https://variety.com/v/film/feed/"
  ],
  "Sequels That Work": [
    "https://www.rottentomatoes.com/syndication/rss/rt_critics_top_movies.xml"
  ],
  "Food TikTok Faves": [
    "https://www.foodandwine.com/rss"
  ],
  "Overrated Dishes": [
    "https://www.seriouseats.com/rss"
  ],
  "Trendy Restaurants": [
    "https://www.eater.com/rss/index.xml"
  ],
  "First Dates": [
    "https://www.psychologytoday.com/us/experts/relationships/rss.xml"
  ],
  "Green Flags & Icks": [
    "https://www.mindbodygreen.com/rss/relationships"
  ],
  "Modern Love Rules": [
    "https://www.nytimes.com/section/love/feed"
  ]
};

export default feeds;

