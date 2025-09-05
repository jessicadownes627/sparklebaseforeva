// src/data/subtopicAsks.js
// Backup Ask prompts for all subtopics (Topic + Subtopic keys).
// Ensures Hot Sheet cards always have a matching Ask [dateName] line,
// even if RSS/API/Sheet headlines fail.

const subtopicAsks = {
  "AI & Future Tech 🤖|ChatGPT & AI Tools": "Ask [dateName] if they’d want their AI to know everything about them — or if that feels a little too emotionally available.",
  "AI & Future Tech 🤖|Ethics & Innovation": "Ask [dateName] if this is the future of democracy — or just dystopia in a blazer.",
  "AI & Future Tech 🤖|Robot Takeover Jokes": "Ask [dateName] if they’d rather be served by a robot — or make a human connection over brunch.",

  "Art & Museums 🖼️|Controversial Art": "Ask [dateName] what kind of art actually grabs them — or if they just like the gift shop.",
  "Art & Museums 🖼️|Gallery Openings": "Ask [dateName] if they’d go for the art or just the snacks and people watching.",
  "Art & Museums 🖼️|TikTok Goes to the Museum": "Ask [dateName] what their museum vibe would be — quiet awe or full fashion moment?",

  "Award Shows & Red Carpets 🎭|Red Carpet Looks": "Ask [dateName] if they live for red carpet fashion — or just wait for the memes.",
  "Award Shows & Red Carpets 🎭|Award Snubs": "Ask [dateName] what show or artist they’d fight for — even if no one else is watching.",
  "Award Shows & Red Carpets 🎭|Memorable Speeches": "Ask [dateName] if they’ve ever heard a speech they still think about — even now.",

  "Baseball ⚾|MLB Highlights": "Ask [dateName] if Judge is their MVP… or if they’re watching someone else this season.",
  "Baseball ⚾|Yankees & Mets Updates": "Ask [dateName] if they believe this streak… or are bracing for heartbreak.",
  "Baseball ⚾|Ballpark Culture": "Ask [dateName] if they’d try a fancy ballpark date package — or if they’re a bleacher seat, heckle-the-pitcher kind of fan.",

  "Basketball 🏀|NBA Drama": "Ask [dateName] if this is his final lap… or just another power play.",
  "Basketball 🏀|Playoff Highlights": "Ask [dateName] if they’re watching now… or saving their hype for playoffs.",
  "Basketball 🏀|Trade Rumors": "Ask [dateName] what NBA trade they’d love to see — even just for the drama.",

  "Book Buzz 📚|BookTok Picks": "Ask [dateName] what book they’d actually recommend — even if it’s a little cringe.",
  "Book Buzz 📚|Books That Spark Debate": "Ask [dateName] what book they hated but had to finish.",
  "Book Buzz 📚|Summer Reads": "Ask [dateName] what book changed their life.",

  "Business & Money 💼|Layoffs & Hiring Trends": "Ask [dateName] if they follow business news — or just know when everyone starts posting 'open to work.'",
  "Business & Money 💼|Market Mayhem": "Ask [dateName] if they’ve ever tried to time the market — or just pretend their 401(k) doesn’t exist.",
  "Business & Money 💼|Corporate Culture Shifts": "Ask [dateName] if they’d thrive on a shorter workweek — or just do laundry in the extra hours.",

  "Celebrity News🌟|Breakups & Hookups": "Ask [dateName] if they’d rather gossip about lovebirds or scandals.",
  "Celebrity News🌟|Style Transformations": "Ask [dateName] who always nails the red carpet look in their opinion.",
  "Celebrity News🌟|Messy Interviews": "Ask [dateName] what celebrity interview they’ll never forget.",

  "College Sports 🎓|March Madness": "Ask [dateName] if more games = more fun or more chaos.",
  "College Sports 🎓|Rivalry Games": "Ask [dateName] what rivalry they take way too personally — even if it’s just for fun.",
  "College Sports 🎓|Players to Watch": "Ask [dateName] if college ball is about talent now… or just TikTok fame and sponsorship deals.",

  "Concert Tours 🎤|Pop Tours": "Ask [dateName] who they’d drop everything to see live — and if they’d sing along or cry silently.",
  "Concert Tours 🎤|Tour Ticket Chaos": "Ask [dateName] if they’ve ever fought for tickets — and if it was worth the battle.",
  "Concert Tours 🎤|Who’s Worth Seeing Live": "Ask [dateName] who gave the best live show they’ve ever seen — or who’s still on their bucket list.",

  "Dating & Relationships ❤️|First Dates": "Ask [dateName] if they’d ever play 'Red Flag Roulette' — or if that’s a one-way ticket to Awkwardville.",
  "Dating & Relationships ❤️|Green Flags & Icks": "Ask [dateName] what their weirdest green flag is — or their most irrational ick.",
  "Dating & Relationships ❤️|Modern Love Rules": "Ask [dateName] if that’s romantic… or sounds like ghosting on expert mode.",

  "Environment & Climate 🌍|Climate Politics": "Ask [dateName] if they follow climate policy — or just feel guilty using AC.",
  "Environment & Climate 🌍|Weather Disasters": "Ask [dateName] if they’ve felt the weather get wilder — or still think it’s just summer being summer.",
  "Environment & Climate 🌍|Eco-Friendly Trends": "Ask [dateName] if they’re doing anything eco-friendly — or rage-clicked a bamboo toothbrush ad recently.",

  "Fashion 👗|Trendy Looks": "Ask [dateName] if they’ve ever pulled off a look they weren’t sure about — and how it turned out.",
  "Fashion 👗|Streetwear vs. Designer": "Ask [dateName] if they’d wear it ironically — or run the other way.",
  "Fashion 👗|Outfits That Spark Opinions": "Ask [dateName] if they love bold fashion — or stick to ‘classic but comfy.’",

  "Festivals🎪|Coachella & Big Names": "Ask [dateName] if they’d rather be front row at a big festival — or chill backstage at a smaller one.",
  "Festivals🎪|Festival Fails": "Ask [dateName] if they’ve ever had a 'festival fail' moment.",
  "Festivals🎪|Fashion from the Field": "Ask [dateName] which festival fashion trend they’d rock.",

  "Film 🎬|Blockbusters": "Ask [dateName] if they still get hyped for big premieres — or wait to stream with snacks.",
  "Film 🎬|Sequels That Work": "Ask [dateName] if any sequel has ever been better than the original.",
  "Film 🎬|Movie Theaters vs. Streaming": "Ask [dateName] if they still love movie nights out — or prefer couch premieres with pause breaks.",

  "Food & Restaurants 🍝|Trendy Restaurants": "Ask [dateName] if they’re into buzzy restaurants — or if a good food truck beats a hypebeast menu.",
  "Food & Restaurants 🍝|Food TikTok Faves": "Ask [dateName] if they’ve actually made anything from TikTok — and how it turned out.",
  "Food & Restaurants 🍝|Overrated Dishes": "Ask [dateName] what food trend they’re totally over — and what they’ll defend to the last bite.",

   "Football 🏈|Fantasy Football": "Ask [dateName] who they always draft… or regret drafting.",
  "Football 🏈|NFL Offseason Buzz": "Ask [dateName] if they believe the Jets hype — or if it’s all preseason smoke.",
  "Football 🏈|College Football Energy": "Ask [dateName] if college football feels more chaotic — or more fun — than the NFL.",

  "Gaming 🎮|Cozy / Indie Games": "Ask [dateName] what game they play when they need a vibe reset — or a win.",
  "Gaming 🎮|Top Streamers": "Ask [dateName] if they’d rather stream and vibe — or grind for pro wins.",
  "Gaming 🎮|Gaming Nostalgia": "Ask [dateName] what game raised them — and if they could still beat it today.",

  "Golf ⛳|Major Tournaments": "Ask [dateName] if they’ll actually watch — or just check highlights and clap politely.",
  "Golf ⛳|Player Drama": "Ask [dateName] if golf needs more scandals — or if that’s already happening at the country club.",
  "Golf ⛳|Golf as a Vibe": "Ask [dateName] if they actually play… or just show up for cart drinks and sunshine.",

  "Health & Fitness 🧘|Wellness Trends": "Ask [dateName] if they’ve ever tried hacking their sleep — or if they’re just tired of being tired.",
  "Health & Fitness 🧘|GymTok & Challenges": "Ask [dateName] if they’d try a workout challenge — or fake a knee injury by rep 2.",
  "Health & Fitness 🧘|Controversial Diets": "Ask [dateName] if they think diet drugs are the future — or if that’s crossing the line.",

  "Hockey 🏒|Stanley Cup": "Ask [dateName] if they care more about who wins — or who fights.",
  "Hockey 🏒|Famous Fights": "Ask [dateName] if fighting belongs in hockey — or feels like watching a reality show on ice.",
  "Hockey 🏒|Hometown Heroes": "Ask [dateName] if they ever root for the home team — or go full villain in enemy colors.",

  "Holiday Happenings 🎁|Gift Ideas": "Ask [dateName] if they’re good at gifts — or if they wish someone else would make the list.",
  "Holiday Happenings 🎁|Holiday Traditions": "Ask [dateName] if they’re into traditions… or prefer to invent their own.",
  "Holiday Happenings 🎁|Seasonal Stress": "Ask [dateName] how they really feel about the holidays: joyful chaos or emotional landmine?",

  "Indie Films 🎬|Festival Winners": "Ask [dateName] if they’ve ever liked a movie more because it was weird.",
  "Indie Films 🎬|A24 Vibes": "Ask [dateName] if they’re into slow-burn indie films — or just show up for the cinematography.",
  "Indie Films 🎬|Underrated Gems": "Ask [dateName] what movie they always recommend… that nobody’s ever seen.",

  "Legal Drama ⚖️|Celebrity Trials": "Ask [dateName] which celeb trial they still think about — and if the verdict was right.",
  "Legal Drama ⚖️|Supreme Court Moves": "Ask [dateName] if they keep up with the Supreme Court — or just hear about it from memes.",
  "Legal Drama ⚖️|Lawsuits in the Spotlight": "Ask [dateName] what kind of lawsuits they secretly love following.",

  "Major Weather Events ⛈️|Storm Season": "Ask [dateName] if they’ve ever had big plans ruined by the weather — and what they did instead.",
  "Major Weather Events ⛈️|Heatwave Headlines": "Ask [dateName] how they survive a scorcher like that: iced lattes, hiding indoors, or slow roasting?",
  "Major Weather Events ⛈️|Weather That Stops Plans": "Ask [dateName] what kind of event they’d power through the rain for… and what makes them bail.",

  "Music 🎵|Pop": "Ask [dateName] what track hit hardest — or if they miss a previous phase.",
  "Music 🎵|Throwbacks & Nostalgia": "Ask [dateName] what old-school anthem they’d vote #1.",
  "Music 🎵|Summer Anthems": "Ask [dateName] if that chorus is stuck in their head too — or if they’ve already moved on to a remix.",
  "Music 🎵|Hot New Drops": "Ask [dateName] if they’re into the alt-pop wave — or still listening to one video that wrecked their algorithm.",

  "Olympics 🏅|Olympic Highlights": "Ask [dateName] if they’re Olympic obsessives — or just tune in for the montages.",
  "Olympics 🏅|Gold Medal Moments": "Ask [dateName] if they’ve ever cried over a sports moment — even if it was just the theme music.",
  "Olympics 🏅|Events We All Watch": "Ask [dateName] what their weirdly favorite Olympic event is. Trampoline? Curling?",

  "Podcasts 🎧|True Crime": "Ask [dateName] if they like to binge their true crime — or solve it one episode at a time.",
  "Podcasts 🎧|Pop Culture & Comedy": "Ask [dateName] what pop culture era they secretly love… and defend.",
  "Podcasts 🎧|Surprising Life Advice": "Ask [dateName] if that’s brave, ridiculous — or both.",

  "Politics 🗳️|Trump & Legal Drama": "Ask [dateName] if they’re following the trials — or just watching the memes unfold.",
  "Politics 🗳️|2026 Election Watch": "Ask [dateName] if they’ve seen any wild political ads — or if they’ve tuned them out entirely.",
  "Politics 🗳️|Culture Wars & Court Battles": "Ask [dateName] if they think this will shape the next election — or just get buried in the noise.",

  "Shopping 🛍️|Sustainable Fashion": "Ask [dateName] if they’ve ever thrifted a date-night outfit. Bonus points if there’s a story behind it.",
  "Shopping 🛍️|Best Purchases": "Ask [dateName] what recent purchase actually improved their life — or their mood.",
  "Shopping 🛍️|Impulse Buys That Hit": "Ask [dateName] what impulse buy they’ve never regretted… or totally did.",

  "Space & UFOs 🛸|Alien Conspiracies": "Ask [dateName] what they *really* think about aliens — and if they’d want to meet one.",
  "Space & UFOs 🛸|NASA & SpaceX Updates": "Ask [dateName] if they’d ever go to space — or if flying coach is adventurous enough.",
  "Space & UFOs 🛸|Would You Go to Mars?": "Ask [dateName] what they’d pack for Mars — or if that’s an Earth-no from them.",

  "Sports Betting 🎲|Big Game Picks": "Ask [dateName] if they ever bet the underdog — or play it safe with favorites.",
  "Sports Betting 🎲|Wild Underdog Wins": "Ask [dateName] if they’ve ever made (or fumbled) a wild pick.",
  "Sports Betting 🎲|Viral Betting Moments": "Ask [dateName] what moment they’d never emotionally recover from.",

  "Streaming & Reality 💅|Netflix Originals": "Ask [dateName] if they’d survive a show where exes pick your next match.",
  "Streaming & Reality 💅|Reality TV Meltdowns": "Ask [dateName] what reality show meltdown lives in their head rent-free.",
  "Streaming & Reality 💅|Docuseries That Hook You": "Ask [dateName] how long they’d last before drinking the green juice — or running.",

  "Talk of the Country 🇺🇸|Trending U.S. Topics": "Ask [dateName] what they’d do with an extra $100 this month — bonus points if it’s ridiculous.",
  "Talk of the Country 🇺🇸|Cultural Flashpoints": "Ask [dateName] what moment made them stop scrolling this week — even if it was chaos.",
  "Talk of the Country 🇺🇸|What Everyone’s Arguing About": "Ask [dateName] if they’d try the latest overhyped thing — or write an angry Yelp review before taking a sip.",

  "Tech & Gadgets 💻|Smartphones & Devices": "Ask [dateName] what’s on their home screen… and what app they secretly use the most.",
  "Tech & Gadgets 💻|Apps That Change the Game": "Ask [dateName] if they’d try a voice-note-only app — or if they need a face before a vibe.",
  "Tech & Gadgets 💻|Wearables & Wellness Tech": "Ask [dateName] if they’d use tech to chill out — or if that’s a little too Black Mirror.",

  "Travel ✈️|Dream Destinations": "Ask [dateName] which vibe wins: desert art, Southern charm, or seaside escape.",
  "Travel ✈️|Travel Horror Stories": "Ask [dateName] for their worst travel story — and how they survived it.",
  "Travel ✈️|Romantic Getaways": "Ask [dateName] where they’d sneak off to for a no-itinerary weekend.",

  "Trending Events 🎉|Big City Moments": "Ask [dateName] if they’d rather be at a giant festival — or chill with local vibes and no porta-potties.",
  "Trending Events 🎉|Small Town Magic": "Ask [dateName] what small-town event they’d secretly love — even if it’s corny and full of lemonade.",
  "Trending Events 🎉|What's Happening Near You?": "Ask [dateName] if they ever go out without planning — or need a spreadsheet and 3 backups.",

  "True Crime 🔪|Netflix Docs": "Ask [dateName] if they’re into crime docs for the mystery — or just the 'I could never' shock factor.",
  "True Crime 🔪|Wrongful Convictions": "Ask [dateName] if they believe justice always wins — or if we just get lucky sometimes.",
  "True Crime 🔪|High-Profile Trials": "Ask [dateName] if they’d want to sit on a real jury — or just judge from the couch.",

  "TV Shows 📺|Reality TV": "Ask [dateName] if they’d survive a dating show — or get voted off for 'emotional immaturity.'",
  "TV Shows 📺|Finale Controversies": "Ask [dateName] if the latest finale stuck the landing — or if the hype is starting to simmer down.",
  "TV Shows 📺|Guilty Pleasure Shows": "Ask [dateName] what show they’d secretly go on — or which one they pretend not to watch.",

  "Viral & Memes 📱|TikTok Trends": "Ask [dateName] if they’re feeling their flop era… or fighting to stay in main character mode.",
  "Viral & Memes 📱|Unhinged Memes": "Ask [dateName] what meme they’ve shared with five people this week.",
  "Viral & Memes 📱|What’s Blowing Up This Week": "Ask [dateName] if they’d give back the hoodie… or leave it on read forever.",

  "Wildcard 🃏|Unexpected News": "Ask [dateName] what headline lives in their head rent-free — bonus if it’s unhinged.",
  "Wildcard 🃏|Hot Takes": "Ask [dateName] what food hill they’ll die on — no judgment.",
  "Wildcard 🃏|Debates That Divide the Table": "Ask [dateName] what seemingly harmless thing they low-key judge people for."
};



export default subtopicAsks;
