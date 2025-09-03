// src/data/newsKeywordMap.js

import {
  MLB_TEAM_KEYWORDS,
  NFL_TEAM_KEYWORDS,
  NBA_TEAM_KEYWORDS,
  NHL_TEAM_KEYWORDS,
  NCAA_TEAM_KEYWORDS
} from "./teamKeywords";

const newsKeywordMap = {
  // 🧠 Smart & Curious
  "Politics 🗳️": {
    mustIncludeAny: ["election","senate","congress","president","white house","campaign","house of representatives"],
    positive: ["election","senate","house","congress","lawmakers","legislation","bill","governor","policy","president"],
    negative: ["fantasy","promo code","odds","betting"],
    domainWeights: { "nytimes.com": 4,"washingtonpost.com": 4,"cnn.com": 3,"bbc.com": 3,"politico.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Talk of the Country 🇺🇸": {
    mustIncludeAny: ["usa","america","u.s.","united states","national news"],
    positive: ["supreme court","federal","national","statewide","country","united states","american","biden","trump","rfk jr","election"],
    negative: ["odds","fantasy","promo code"],
    domainWeights: { "usatoday.com": 4,"apnews.com": 4,"reuters.com": 3,"cnn.com": 3,"abcnews.go.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Tech & Gadgets 💻": {
    mustIncludeAny: ["tech","ai","artificial intelligence","app","iphone","android","microsoft","google","apple","meta"],
    positive: ["ai","artificial intelligence","machine learning","smartphone","app","software","tech","startup","product launch","elon musk","chatbot"],
    negative: ["fantasy","betting","coupon","promo code"],
    domainWeights: { "theverge.com": 4,"techcrunch.com": 4,"wired.com": 3,"cnet.com": 3,"arstechnica.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Business & Money 💼": {
    mustIncludeAny: ["stock","stocks","market","wall street","dow","nasdaq","investing","company","ceo","earnings"],
    positive: ["market","investors","ipo","earnings","revenue","growth","economy","inflation","banking","layoffs","funding"],
    negative: ["fantasy","promo","betting","odds"],
    domainWeights: { "wsj.com": 4,"bloomberg.com": 4,"reuters.com": 3,"cnbc.com": 3,"ft.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Legal Drama ⚖️": {
    mustIncludeAny: ["lawsuit","court","trial","verdict","judge","jury","supreme court"],
    positive: ["lawsuit","legal","verdict","trial","appeal","prosecution","indictment","criminal trial"],
    negative: ["fantasy","promo code","betting","sportsbook","casino"],
    domainWeights: { "law360.com": 4,"nytimes.com": 3,"cnn.com": 3,"apnews.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "True Crime 🔪": {
    mustIncludeAny: ["murder","crime","homicide","serial killer","cold case","missing"],
    positive: ["murder","homicide","cold case","investigation","detectives","trial","robbery","fbi"],
    negative: ["fantasy","promo code","betting"],
    domainWeights: { "oxygen.com": 4,"cnn.com": 3,"people.com": 3,"nbcnews.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Environment & Climate 🌍": {
    mustIncludeAny: ["climate","environment","global warming","greenhouse","wildfire","sustainability"],
    positive: ["climate","warming","sustainability","carbon","green","renewable","wildfire","hurricane","flood","policy","clean energy"],
    negative: ["fantasy","betting","promo code"],
    domainWeights: { "insideclimatenews.org": 4,"nationalgeographic.com": 4,"bbc.com": 3,"cnn.com": 3,"theguardian.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "AI & Future Tech 🤖": {
    mustIncludeAny: ["ai","artificial intelligence","chatgpt","openai","neuralink","future tech"],
    positive: ["ai","artificial intelligence","automation","robots","neural networks","chatgpt","openai","tech innovation"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "theverge.com": 4,"wired.com": 4,"techcrunch.com": 3,"nytimes.com": 3,"arstechnica.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  // 🌍 Culture & Entertainment
  "Travel ✈️": {
    mustIncludeAny: ["travel","flight","airline","vacation","hotel","resort","tourism"],
    positive: ["travel","destination","hotel","tourism","vacation","airline","flight","passport","tsa"],
    negative: ["fantasy","promo","betting","odds","hospital","funeral"],
    domainWeights: { "travelandleisure.com": 4,"cntraveler.com": 4,"lonelyplanet.com": 3,"usatoday.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Food & Restaurants 🍝": {
    mustIncludeAny: ["restaurant","chef","menu","cuisine","dining","foodie"],
    positive: ["restaurant","chef","menu","food","recipe","bar","cafe","michelin"],
    negative: ["fantasy","promo","betting"],
    domainWeights: { "eater.com": 4,"foodnetwork.com": 4,"bonappetit.com": 3,"delish.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Health & Fitness 🧘": {
    mustIncludeAny: ["health","fitness","gym","workout","diet","wellness","mental health"],
    positive: ["health","fitness","exercise","diet","yoga","gym","mental health","therapy","nutrition"],
    negative: ["fantasy","betting","promo code","cancer","chemo","ICU"],
    domainWeights: { "healthline.com": 4,"menshealth.com": 4,"womenshealthmag.com": 3,"self.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Fashion 👗": {
    mustIncludeAny: ["fashion","style","designer","runway","outfit","vogue"],
    positive: ["fashion","style","runway","designer","outfit","collection","met gala"],
    negative: ["fantasy","promo","betting","volcano","eruption","excavation"],
    domainWeights: { "vogue.com": 4,"elle.com": 4,"harpersbazaar.com": 3,"nytimes.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Shopping 🛍️": {
    mustIncludeAny: ["shopping","retail","mall","amazon","target","walmart","ecommerce"],
    positive: ["shopping","retail","sale","deal","consumer","ecommerce","mall","trend"],
    negative: ["fantasy","betting","sportsbook","real estate","retail investment"],
    domainWeights: { "retaildive.com": 4,"forbes.com": 3,"usatoday.com": 3,"nytimes.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Book Buzz 📚": {
    mustIncludeAny: ["book","novel","author","literature","bestseller"],
    positive: ["book","novel","literature","author","publishing","bestseller","memoir"],
    negative: ["fantasy football","promo code","betting"],
    domainWeights: { "publishersweekly.com": 4,"nytimes.com": 3,"kirkusreviews.com": 3,"guardian.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Art & Museums 🖼️": {
    mustIncludeAny: ["museum","art","exhibit","gallery","painting","sculpture"],
    positive: ["art","museum","gallery","exhibit","painting","sculpture","installation","auction"],
    negative: ["fantasy","promo","betting"],
    domainWeights: { "artnews.com": 4,"nytimes.com": 3,"theguardian.com": 3,"smithsonianmag.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Dating & Relationships ❤️": {
    mustIncludeAny: ["dating","relationship","love","couples","marriage","breakup"],
    positive: ["dating","relationship","romance","love","engagement","marriage","breakup","modern love"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "cosmopolitan.com": 4,"glamour.com": 3,"nytimes.com": 3,"thecut.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Viral & Memes 📱": {
    mustIncludeAny: ["viral","meme","tiktok","instagram","social media","trend"],
    positive: ["viral","trend","meme","tiktok","instagram","social","funny","internet moment"],
    negative: ["fantasy","promo","betting"],
    domainWeights: { "buzzfeed.com": 4,"mashable.com": 3,"theverge.com": 3,"cnn.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  // 🎬 Screens & Sound
  "Film 🎬": {
    mustIncludeAny: ["movie","film","box office","director","actor","premiere","netflix"],
    positive: ["movie","film","cinema","actor","director","box office","premiere","release","oscar"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "variety.com": 4,"hollywoodreporter.com": 4,"deadline.com": 3,"indiewire.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Indie Films 🎬": {
    mustIncludeAny: ["indie film","independent movie","sundance","tribeca"],
    positive: ["indie","independent","film festival","sundance","tribeca","arthouse","limited release"],
    negative: ["fantasy","promo","betting"],
    domainWeights: { "indiewire.com": 4,"filmthreat.com": 3,"variety.com": 3,"hollywoodreporter.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "TV Shows 📺": {
    mustIncludeAny: ["tv","television","hbo","netflix","series","show","episode"],
    positive: ["tv","show","series","episode","season","premiere","finale","recap","streaming"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "tvline.com": 4,"hollywoodreporter.com": 3,"variety.com": 3,"deadline.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Streaming & Reality 💅": {
    mustIncludeAny: ["reality","netflix","bravo","bachelor","love is blind"],
    positive: ["reality","tv","netflix","drama","bravo","bachelor"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "decider.com": 4,"realityblurred.com": 4,"people.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Music 🎶": {
    mustIncludeAny: ["music","album","concert","tour","song","artist","spotify","apple music"],
    positive: ["music","album","concert","tour","artist","song","band","playlist","grammy","billboard"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "rollingstone.com": 4,"pitchfork.com": 3,"billboard.com": 3,"variety.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Podcasts 🎧": {
    mustIncludeAny: ["podcast","spotify podcast","apple podcast","series"],
    positive: ["podcast","episode","series","spotify","apple","release"],
    negative: ["fantasy","promo","betting"],
    domainWeights: { "podnews.net": 4,"theverge.com": 3,"nytimes.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Celebrity News 🌟": {
    mustIncludeAny: ["celebrity","actor","actress","singer","star","hollywood"],
    positive: ["celebrity","actor","actress","star","hollywood","singer","couple","baby","paparazzi"],
    negative: ["fantasy","promo","betting"],
    domainWeights: { "people.com": 4,"tmz.com": 3,"eonline.com": 3,"usmagazine.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Gaming 🎮": {
    mustIncludeAny: ["gaming","video game","xbox","playstation","nintendo","steam"],
    positive: ["gaming","video game","console","playstation","xbox","nintendo","pc","esports","roblox","minecraft"],
    negative: ["fantasy sports","promo","betting","stock","earnings","nba","nfl","trump"],
    domainWeights: { "ign.com": 4,"polygon.com": 3,"gamespot.com": 3,"kotaku.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },


  // 🏆 Sports & Action
  "Baseball ⚾": {
    mustIncludeAny: ["mlb","major league baseball",...MLB_TEAM_KEYWORDS,"mookie betts","aaron judge","shohei ohtani","juan soto","bryce harper"],
    positive: ["mlb","major league baseball","box score","game recap","lineup","injury update","trade","waivers","rumor",...MLB_TEAM_KEYWORDS],
    negative: ["ncaa","college","little league","minor league","fantasy","waiver wire","draftkings","fanduel","betting","odds"],
    domainWeights: { "mlb.com": 4,"espn.com": 4,"mlbtraderumors.com": 4,"si.com": 3,"cbssports.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Football 🏈": {
    mustIncludeAny: ["nfl","football","super bowl","draft","quarterback",...NFL_TEAM_KEYWORDS],
    positive: ["nfl","football","touchdown","super bowl","qb","quarterback","receiver","trade","injury",...NFL_TEAM_KEYWORDS],
    negative: ["ncaa","college","fantasy","mock draft","betting","odds","promo","draftkings","fanduel"],
    domainWeights: { "nfl.com": 4,"espn.com": 4,"cbssports.com": 3,"si.com": 3,"theathletic.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },
  "Basketball 🏀": {
    mustIncludeAny: ["nba","basketball","finals","draft","playoffs",...NBA_TEAM_KEYWORDS],
    positive: ["nba","basketball","playoffs","finals","mvp","rookie","injury","trade","buzzer beater","lebron james",...NBA_TEAM_KEYWORDS],
    negative: ["ncaa","college","high school","fantasy","betting","promo"],
    domainWeights: { "nba.com": 4,"espn.com": 4,"cbssports.com": 3,"si.com": 3,"theathletic.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Hockey 🏒": {
    mustIncludeAny: ["nhl","hockey","stanley cup","goalie","puck",...NHL_TEAM_KEYWORDS],
    positive: ["nhl","hockey","stanley cup","playoffs","goalie","trade","injury","hat trick",...NHL_TEAM_KEYWORDS],
    negative: ["ahl","junior","college","ncaa","fantasy","betting","promo"],
    domainWeights: { "nhl.com": 4,"espn.com": 4,"cbssports.com": 3,"si.com": 3,"theathletic.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Golf ⛳": {
    mustIncludeAny: ["pga","masters","golf","tiger woods","us open golf"],
    positive: ["pga","masters","golf","tournament","us open","round","tiger woods"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "pgatour.com": 4,"espn.com": 3,"golfdigest.com": 3,"si.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "College Sports 🎓": {
    mustIncludeAny: ["ncaa","college sports","college football","college basketball","student athlete",...NCAA_TEAM_KEYWORDS],
    positive: ["ncaa","college sports","football","basketball","tournament","final four","student athlete",...NCAA_TEAM_KEYWORDS],
    negative: ["fantasy","betting","promo","draftkings","fanduel"],
    domainWeights: { "espn.com": 4,"cbssports.com": 3,"si.com": 3,"theathletic.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Olympics 🏅": {
    mustIncludeAny: ["olympics","olympic games","medal","gold medal","paris 2024","la 2028"],
    positive: ["olympics","medal","gold","athlete","ceremony","competition","team usa","qualifying"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "olympics.com": 4,"espn.com": 3,"si.com": 3,"reuters.com": 3,"apnews.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Sports Betting 🎲": {
    mustIncludeAny: ["sports betting","draftkings","fanduel","odds","parlay","props"],
    positive: ["sports betting","odds","line","fanduel","draftkings","spread"],
    negative: ["casino","lottery"],
    domainWeights: { "actionnetwork.com": 4,"oddsshark.com": 3,"espn.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  // 🎉 What’s Hot
  "Concert Tours 🎤": {
    mustIncludeAny: ["concert","tour","arena","stadium","band","artist","live show"],
    positive: ["concert","tour","arena","stadium","live performance","band","artist","tour dates","sold out"],
    negative: ["fantasy","promo","betting"],
    domainWeights: { "rollingstone.com": 4,"billboard.com": 3,"variety.com": 3,"pitchfork.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Festivals 🎪": {
    mustIncludeAny: ["festival","music festival","film festival","cultural festival"],
    positive: ["festival","concert","gathering","celebration","lineup","coachella"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "billboard.com": 4,"variety.com": 3,"nytimes.com": 3,"rollingstone.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Trending Events 🎉": {
    mustIncludeAny: ["trending","event","viral","big event","things to do","weekend guide"],
    positive: ["trending","event","popular","viral","buzzing"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "buzzfeed.com": 4,"mashable.com": 3,"cnn.com": 3,"usatoday.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Holiday Happenings 🎁": {
    mustIncludeAny: ["holiday","christmas","thanksgiving","halloween","easter","new year","fourth of july","fireworks"],
    positive: ["holiday","celebration","gift","tradition","family","events","weekend"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "today.com": 4,"usatoday.com": 3,"nytimes.com": 3,"people.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Major Weather Events ⛈️": {
    mustIncludeAny: ["hurricane","storm","flood","wildfire","blizzard","tornado","heat wave"],
    positive: ["hurricane","storm","flood","wildfire","tornado","evacuation","forecast","warning"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "weather.com": 4,"cnn.com": 3,"bbc.com": 3,"reuters.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Space & UFOs 🛸": {
    mustIncludeAny: ["nasa","space","spacex","ufo","alien","mars","moon","astronaut"],
    positive: ["nasa","spacex","space","astronomy","telescope","rocket","alien","mars rover","james webb telescope"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "nasa.gov": 4,"space.com": 4,"scientificamerican.com": 3,"nytimes.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Award Shows & Red Carpets 🎭": {
    mustIncludeAny: ["oscars","golden globes","red carpet","award show","best dressed","award speech"],
    positive: ["oscars","golden globes","red carpet","award","speech","nominee","winner"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "variety.com": 4,"hollywoodreporter.com": 3,"goldderby.com": 3 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  },

  "Wildcard 🃏": {
    mustIncludeAny: ["trending","viral","breaking news","odd","strange","wild","weird news","unusual"],
    positive: ["trending","viral","breaking","odd","strange","weird","funny","unusual"],
    negative: ["fantasy","betting","promo"],
    domainWeights: { "buzzfeed.com": 4,"mashable.com": 3,"vice.com": 3,"cnn.com": 2 },
    minScore: 1.0, positiveWeight: 1.3, negativeWeight: 1.8
  }
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


