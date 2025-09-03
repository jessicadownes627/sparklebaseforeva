// src/data/topicSeeds.js
// COMPLETE baseline seeds/domains for ALL 41 topics.
// Keys are emoji-free because your code strips emoji before lookup.

export const TITLE_SEEDS = {
  // 🧠 Smart & Curious
  "Politics": ["election","senate","congress","governor","bill","campaign","president","white house","debate"],
  "Talk of the Country": ["national","federal","supreme court","usa","u.s.","united states","nationwide"],
  "Tech & Gadgets": ["iphone","android","app","update","launch","feature","google","apple","microsoft","meta","ai"],
  "Business & Money": ["earnings","ipo","stock","merger","acquisition","revenue","inflation","jobs report","dow","nasdaq"],
  "Legal Drama": ["lawsuit","verdict","trial","indictment","settlement","appeal","judge","jury","charges"],
  "True Crime": ["murder","homicide","cold case","missing","investigation","trial","arrest"],
  "Environment & Climate": ["climate","wildfire","hurricane","flood","heat wave","drought","emissions","renewable","sustainability"],
  "AI & Future Tech": ["ai","artificial intelligence","chatgpt","model","robot","automation","neural","openai","agent"],

  // 🌍 Culture & Entertainment
  "Travel": ["destination","resort","hotel","flight","guide","itinerary","airline","points","loyalty"],
  "Food & Restaurants": ["opening","menu","chef","Michelin","pop-up","reservation","tasting menu","chef's table"],
  "Health & Fitness": ["workout","diet","wellness","mental health","study","sleep","yoga","gym","guidelines"],
  "Fashion": ["runway","collection","designer","fashion week","street style","capsule","lookbook"],
  "Shopping": ["sale","deal","restock","drop","retail","Prime Day","Black Friday","Target","Walmart","Amazon"],
  "Book Buzz": ["bestseller","novel","memoir","author","book tour","book club","publishing","shortlist","prize"],
  "Art & Museums": ["exhibit","gallery","installation","opening","curator","museum","retrospective"],
  "Dating & Relationships": ["dating","relationship","engaged","married","breakup","advice","study"],
  "Viral & Memes": ["viral","tiktok","trend","meme","instagram","challenge"],

  // 🎬 Screens & Sound
  "Music": ["album","single","tour","setlist","tickets","tracklist","EP","LP"],
  "Film": ["trailer","box office","premiere","cast","sequel","biopic","festival","opening weekend"],
  "TV Shows": ["renewed","finale","premiere","episode","season","casting","spin-off","reboot"],
  "Streaming & Reality": ["Netflix","Hulu","Max","Disney+","Apple TV+","Prime Video","reality","season","premiere","renewed"],
  "Celebrity News": ["engaged","married","pregnant","split","comeback","reunion","apology"],
  "Award Shows & Red Carpets": ["Oscars","Emmys","Grammys","Golden Globes","Tonys","red carpet","nominees","winners"],
  "Gaming": ["release date","trailer","gameplay","DLC","beta","patch notes","update"],
  "Indie Films": ["Sundance","Tribeca","indie","festival premiere","limited release"],
  "Podcasts": ["podcast","episode","series","Spotify","Apple Podcasts","true crime","launch"],

  // 🏆 Sports & Action
  "Football": ["trade","injury","training camp","preseason","depth chart","QB","receiver","schedule"],
  "Basketball": ["trade","injury","preseason","playoffs","guard","forward","center"],
  "Baseball": ["trade","injury","lineup","call-up","optioned","box score","recap"],
  "Hockey": ["trade","injury","goalie","preseason","recap","playoffs"],
  "Golf": ["PGA","Masters","US Open","British Open","The Open","Ryder Cup","LIV Golf","tee times","leaderboard"],
  "College Sports": ["NCAA","March Madness","Final Four","bowl","CFP","college football","college basketball"],
  "Olympics": ["Olympics","medal","gold","qualifier","world record","opening ceremony","closing ceremony"],
  "Sports Betting": ["odds","point spread","line","over/under","parlay","sportsbook","betting"],

  // 🎉 What’s Hot
  "Concert Tours": ["tour","stadium","arena","tickets","setlist","dates","on sale"],
  "Festivals": ["festival","lineup","headliner","passes","weekend","camping"],
  "Trending Events": ["trending","viral","event","hype","buzz","sellout"],
  "Holiday Happenings": ["holiday","Christmas","Thanksgiving","Halloween","Easter","New Year","gift guide","parade","tree lighting"],
  "Major Weather Events": ["hurricane","storm","tornado","flood","blizzard","wildfire","evacuation","landfall","forecast"],
  "Space & UFOs": ["NASA","SpaceX","launch","rocket","asteroid","moon","Mars","astronaut","UFO","UAP"],
  "Wildcard": ["weird","odd","strange","bizarre","unusual","unexpected","surprise"]
};

export const DOMAIN_ALLOW = {
  // 🧠 Smart & Curious
  "Politics": ["nytimes.com","washingtonpost.com","politico.com","apnews.com","reuters.com","cnn.com"],
  "Talk of the Country": ["usatoday.com","apnews.com","reuters.com","npr.org","abcnews.go.com"],
  "Tech & Gadgets": ["theverge.com","techcrunch.com","wired.com","arstechnica.com","cnet.com"],
  "Business & Money": ["wsj.com","bloomberg.com","reuters.com","cnbc.com","ft.com"],
  "Legal Drama": ["nytimes.com","apnews.com","reuters.com","cnn.com","nbcnews.com"],
  "True Crime": ["people.com","cnn.com","nbcnews.com","oxygen.com"],
  "Environment & Climate": ["insideclimatenews.org","nationalgeographic.com","theguardian.com","reuters.com","apnews.com"],
  "AI & Future Tech": ["theverge.com","wired.com","techcrunch.com","arstechnica.com","nytimes.com"],

  // 🌍 Culture & Entertainment
  "Travel": ["travelandleisure.com","cntraveler.com","lonelyplanet.com","usatoday.com"],
  "Food & Restaurants": ["eater.com","bonappetit.com","foodnetwork.com","delish.com"],
  "Health & Fitness": ["healthline.com","menshealth.com","womenshealthmag.com","self.com"],
  "Fashion": ["vogue.com","elle.com","harpersbazaar.com","nytimes.com"],
  "Shopping": ["retaildive.com","theverge.com","cnet.com","forbes.com","nytimes.com"],
  "Book Buzz": ["publishersweekly.com","nytimes.com","kirkusreviews.com","theguardian.com"],
  "Art & Museums": ["artnews.com","smithsonianmag.com","theguardian.com","nytimes.com"],
  "Dating & Relationships": ["cosmopolitan.com","glamour.com","thecut.com","nytimes.com"],
  "Viral & Memes": ["buzzfeed.com","mashable.com","theverge.com","cnn.com"],

  // 🎬 Screens & Sound
  "Music": ["billboard.com","rollingstone.com","pitchfork.com","variety.com"],
  "Film": ["variety.com","hollywoodreporter.com","deadline.com","indiewire.com"],
  "TV Shows": ["tvline.com","variety.com","hollywoodreporter.com","deadline.com","ew.com"],
  "Streaming & Reality": ["variety.com","hollywoodreporter.com","deadline.com","ew.com","people.com","vulture.com"],
  "Celebrity News": ["people.com","ew.com","usmagazine.com","eonline.com"],
  "Award Shows & Red Carpets": ["variety.com","hollywoodreporter.com","deadline.com","ew.com","people.com"],
  "Gaming": ["ign.com","polygon.com","gamespot.com"],
  "Indie Films": ["indiewire.com","variety.com","hollywoodreporter.com","filmthreat.com"],
  "Podcasts": ["podnews.net","theverge.com","nytimes.com"],

  // 🏆 Sports & Action
  "Football": ["nfl.com","espn.com","si.com","cbssports.com","theathletic.com"],
  "Basketball": ["nba.com","espn.com","si.com","cbssports.com","theathletic.com"],
  "Baseball": ["mlb.com","espn.com","si.com","cbssports.com","theathletic.com"],
  "Hockey": ["nhl.com","espn.com","si.com","cbssports.com","theathletic.com"],
  "Golf": ["espn.com","pgatour.com","si.com","cbssports.com","nbcsports.com"],
  "College Sports": ["espn.com","cbssports.com","si.com","theathletic.com"],
  "Olympics": ["olympics.com","espn.com","reuters.com","apnews.com"],
  "Sports Betting": ["espn.com","si.com","cbssports.com","theathletic.com"],

  // 🎉 What’s Hot
  "Concert Tours": ["rollingstone.com","billboard.com","variety.com","pitchfork.com"],
  "Festivals": ["billboard.com","variety.com","rollingstone.com","nytimes.com"],
  "Trending Events": ["buzzfeed.com","mashable.com","usatoday.com","cnn.com"],
  "Holiday Happenings": ["today.com","usatoday.com","nytimes.com","people.com"],
  "Major Weather Events": ["weather.com","reuters.com","apnews.com","cnn.com"],
  "Space & UFOs": ["nasa.gov","space.com","scientificamerican.com","nytimes.com"],
  "Wildcard": ["mashable.com","buzzfeed.com","cnn.com","vice.com"]
};
