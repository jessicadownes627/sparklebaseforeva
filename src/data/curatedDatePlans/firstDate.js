const firstDate = {
    evening: {
      flexible: {
        romantic: {
          casual: "Pick up takeout from a cozy local spot and eat it somewhere unexpected — the hood of your car, a park bench, or a rooftop with a view. Let the vibe feel effortlessly cinematic.",
          fancy: "Choose a place with candlelight, music that matches the mood, and dessert worth sharing. Let conversation linger — you’re not rushing anywhere.",
          drinks: "Find a bar with soft lighting and interesting cocktails. Sit close, share sips, and let your chemistry do the talking.",
          mix: "Start at a spot that feels intimate — maybe a speakeasy or wine bar — then wander nearby and find a second surprise location together."
        },
        fun: {
          casual: "Hit a food truck or diner and make up fake Yelp reviews for what you order. Then challenge each other to a mini scavenger hunt nearby.",
          fancy: "Get dressed up and pretend you’re celebrating something ridiculous — like ‘National Fun Night.’ Bonus points for making the waiter play along.",
          drinks: "Go to a spot with themed drinks or games. Compete over cocktails, loser picks the next date idea.",
          mix: "Do a progressive date — one place for apps, one for drinks, and one for dessert. No plans, just see where it takes you."
        },
        chill: {
          casual: "Grab comfort food and find somewhere to sit and talk — your couch, the beach, even just in the car with good music playing.",
          fancy: "Pick a relaxed restaurant that isn’t too loud, where you can talk without yelling. Don’t rush — let it feel like the opposite of your week.",
          drinks: "Go for mocktails or mellow cocktails at a quiet spot with booths. Low lighting, lo-fi music, and no pressure.",
          mix: "Start slow — maybe coffee or a slow walk — then follow wherever the conversation leads. The plan is *not* having a strict plan."
        },
        adventurous: {
          casual: "Try something totally new to both of you — a cuisine, a boardwalk snack, even late-night diner roulette. Let spontaneity lead.",
          fancy: "Pick a restaurant you’ve both never tried, with a menu you can barely pronounce. Order something brave — together.",
          drinks: "Go to a place that has fire pits, rooftop seating, or something wild on the menu. Bonus if it comes with a flaming garnish.",
          mix: "Start somewhere you wouldn’t normally go — like an arcade bar, themed lounge, or karaoke dive. Let the night be weird in the best way."
        }
      },
      indoors: {
        romantic: {
          casual: "Order from a local spot you both love, light some candles, and sit on the floor picnic-style. Let it feel cozy and cinematic, even if it’s just takeout.",
          fancy: "Dress up for no reason and make a reservation somewhere with moody lighting and slow jazz. Let it feel like you’re in your own private rom-com.",
          drinks: "Make your own cocktail tasting — 2-3 recipes max. Dim the lights, queue a slow playlist, and see what flavors spark conversation.",
          mix: "Start with dinner in, then make a spontaneous dessert together — sundaes, cookies, whatever’s in the pantry. Keep it warm and playful."
        },
        fun: {
          casual: "Make a game out of everything: who orders the better meal, who wins at charades, who tells the funniest story. No pressure, just fun energy.",
          fancy: "Put on your best outfits and pretend you’re judging a fake cooking competition on TV. Give everything dramatic scores. Laugh too hard.",
          drinks: "Do a cocktail roulette — each person makes a mystery drink and the other has to name what’s in it. Bonus points for creative names.",
          mix: "Start with silly trivia or a TikTok challenge, then settle in with snacks and a nostalgic movie neither of you have seen since middle school."
        },
        chill: {
          casual: "Keep it ultra simple: sweatpants, your go-to comfort meal, and a show you’ve both been meaning to start. Let the vibe be zero pressure.",
          fancy: "Order in from somewhere a little nicer than usual, light a few candles, and talk about anything *but* work. Let yourselves exhale.",
          drinks: "Make one drink each and curl up on the couch with an old playlist. Take turns telling each other the story behind one song.",
          mix: "Build a snack board together, then pull up random YouTube rabbit holes — anything from nature cams to conspiracy theories. Follow the mood."
        },
        adventurous: {
          casual: "Try cooking something neither of you has ever made — like homemade dumplings or upside-down cake. Doesn’t have to be good. Just try.",
          fancy: "Recreate a dish from a place you’ve never been — pick a country, look up a recipe, and go for it. Pretend you're traveling together.",
          drinks: "Do an at-home speakeasy — low lights, jazz playing, and a mix of fancy cocktails you’ve never tried. Give each one a silly backstory.",
          mix: "Make it a roulette night — spin a wheel (or a coin) to decide dinner, drinks, and a random activity. It’s all part of the adventure."
        }
      }
    },
    afternoon: {
      flexible: {
        romantic: {
          casual: "Grab iced coffees and take a walk somewhere new. Talk about your favorite summer memories and don’t rush the route.",
          fancy: "Find a quiet place with outdoor seating, maybe string lights or flowers. Order something small and linger like you’ve got nowhere else to be.",
          drinks: "Sip something light — spritzers, mocktails, iced cocktails — while sitting somewhere with a breeze. Let the afternoon feel slow and golden.",
          mix: "Start with a shared dessert at a cozy cafe, then explore a nearby bookstore, vintage shop, or place you’ve never noticed before."
        },
        fun: {
          casual: "Hit up a food truck or grab snacks to-go, then play a game like ‘Would You Rather’ while wandering aimlessly.",
          fancy: "Do a fancy mid-afternoon ice cream date. Dress up slightly, order the weirdest flavor, and pretend you’re food critics.",
          drinks: "Find a brewery, rooftop, or cider bar and do a mini tasting. Make up fake names for each flavor and rank them.",
          mix: "Try a themed escape room or arcade, then get milkshakes and compare high scores or most ridiculous moments."
        },
        chill: {
          casual: "Grab cold drinks and find a shaded bench, a pier, or even just a wide sidewalk to sit and people-watch together.",
          fancy: "Go somewhere with AC, comfy seating, and snacks — like an old-school theater or retro cafe. Keep it low-effort and lovely.",
          drinks: "Split a cold drink and sit somewhere quiet — a library lawn, a quiet courtyard, a scenic bench. Say little, enjoy lots.",
          mix: "Pack light snacks, go find a nice patch of grass or water, and just be still together for a while. No plans needed."
        },
        adventurous: {
          casual: "Find a street fair, pop-up market, or random local event and explore like tourists. Try something you wouldn’t pick alone.",
          fancy: "Make a random reservation for an off-hour tasting or afternoon tea — something neither of you has done before.",
          drinks: "Find a place with bold drinks and an even bolder vibe — rooftop, neon signs, fire pits — and follow wherever it leads.",
          mix: "Go on a spontaneous local adventure — flip a coin at every intersection and see where you end up. End it with something cold and tasty."
        }
      },
      indoors: {
        romantic: {
          casual: "Make sandwiches or snacks together and have an indoor picnic by the window. Bonus points for music and a shared blanket.",
          fancy: "Dress up for a mid-day reservation somewhere with charm — think plants, sunlight, and real tablecloths. Let it feel like a movie scene.",
          drinks: "Have a lazy cocktail or mocktail session at home with music and low lighting — then write each other a silly poem or list.",
          mix: "Make a dessert together just for fun — brownies, cupcakes, anything messy. Taste-test while watching a nostalgic rom-com."
        },
        fun: {
          casual: "Pick a random DIY craft, TikTok challenge, or trivia quiz and go all in. Messiness and laughing encouraged.",
          fancy: "Do a mini cooking class at home — follow a YouTube recipe and pretend you’re on a competition show. Accents optional.",
          drinks: "Set up a fake tasting: sodas, juices, mystery beverages — blindfold optional. Rate them like dramatic sommeliers.",
          mix: "Have a 'try something new' hour — new snack, new playlist, new game. Swap roles: one leads, one follows."
        },
        chill: {
          casual: "Sit on the floor with snacks and put on an old TV show you both used to love. No pressure to impress, just vibe.",
          fancy: "Order something comforting and sit by a window or candlelight. Watch a slow film or documentary and just be still together.",
          drinks: "Make tea or cold brew and take turns reading each other funny or weird things from your phones. Zero pressure.",
          mix: "Build a fort, pile in pillows, and let the afternoon drift by with music, munchies, and conversation that goes nowhere in particular."
        },
        adventurous: {
          casual: "Try a ‘cook whatever’s in the fridge’ challenge — no rules, just creativity. Share your weirdest food combo stories.",
          fancy: "Pick a global cuisine you’ve never tried and recreate it together. Look up a playlist from that country and lean into it.",
          drinks: "Do a homemade happy hour with themed drinks (color, ingredient, era). Judge each other’s creations with fake scoring paddles.",
          mix: "Spin a wheel or pick a random card that decides what you eat, drink, and do next. No cheating — follow it wherever it leads!"
        }
      }
    },
    morning: {
      flexible: {
        romantic: {
          casual: "Pick up pastries from somewhere new and take a slow walk. Share bites, stories, and the kind of quiet that feels easy.",
          fancy: "Dress up just a little and find a sunny brunch spot with flowers on the table and real silverware. Let it feel special — even if it’s just eggs.",
          drinks: "Meet for coffee at a café with good lighting and quiet corners. Talk about anything except work.",
          mix: "Start with a shared plate at a spot you both like, then wander a local bookstore, park, or quiet block with no real destination."
        },
        fun: {
          casual: "Find a bagel spot or donut place and create your own rating system. Make it a mini mission to find ‘the best’ in town.",
          fancy: "Try a themed brunch pop-up or trendy breakfast place. Dress to match the menu and take a ridiculous photo together.",
          drinks: "Do a coffee crawl — two or three local shops, one small drink at each. Rate them on vibe, foam art, and people-watching potential.",
          mix: "Try something active and funny — mini golf, paddle boats, or a silly walking tour — then refuel with a breakfast burrito or smoothie."
        },
        chill: {
          casual: "Pick up breakfast to-go and find a bench or car spot with a view. Play a playlist neither of you has heard before.",
          fancy: "Go to a calm, scenic spot — rooftop, garden, waterfront — and just sip, snack, and sit. Let the morning be quiet and cozy.",
          drinks: "Split a giant iced coffee and wander slowly. Talk about your weekend dreams or what you’d name your future dog.",
          mix: "Bring your own snacks and find an open, peaceful spot to people-watch. Let the date unfold without pressure."
        },
        adventurous: {
          casual: "Start with something you’ve never tried for breakfast — a new bakery, international food, or just dessert for breakfast. Why not?",
          fancy: "Try an early tasting experience — think coffee flight, global pastry sampler, or even a hotel brunch buffet with no context.",
          drinks: "Go to a place known for wild drinks — ube lattes, rainbow smoothies, nitro cold brew. Order the weirdest thing on the menu.",
          mix: "Find something you’d never expect to do before noon — a quirky museum, an open-air market, or a random road trip — and go with it."
        }
      },
      indoors: {
        romantic: {
          casual: "Make cinnamon toast or waffles together and eat by the window with soft music playing. Let the slow start feel sweet and easy.",
          fancy: "Wake up a little early, get dressed up, and make a sit-down breakfast with real plates, real coffee, and zero distractions.",
          drinks: "Try building a DIY latte or matcha bar with toppings and fancy cups. Sip slowly while trading childhood breakfast memories.",
          mix: "Split a pastry box and sit across from each other at the kitchen table. Pull up a ‘deep questions’ list just for fun."
        },
        fun: {
          casual: "Do a cereal taste test — buy a few, rate them on crunch, nostalgia, and cartoon mascot. Winner gets to choose the next cartoon.",
          fancy: "Put on fancy robes or outfits and pretend you’re at a five-star brunch. Rate your own cooking like over-the-top food critics.",
          drinks: "Make brunch cocktails with wild garnishes — fruit slices, umbrellas, whatever you can find. Then try to guess each other’s go-to drink.",
          mix: "Have a mini morning party: pancakes, loud music, and a made-up awards show for silliest dance, best bedhead, and most creative toast topping."
        },
        chill: {
          casual: "Order bagels or breakfast sandwiches and stay in pajamas. Watch the news or a nature doc and just *be*.",
          fancy: "Make a slow breakfast together with soft jazz, pour-over coffee, and nowhere to be. Let quiet moments be the best part.",
          drinks: "Make tea, smoothies, or flavored coffee and sit on the couch trading sleepy stories. Don’t clean up right away — just relax.",
          mix: "Grab whatever’s in the fridge and make an indoor breakfast picnic. Sit on pillows, read horoscopes, and start the day with no rush."
        },
        adventurous: {
          casual: "Try to recreate a brunch dish from memory — like your favorite from a restaurant. Be creative, not perfect.",
          fancy: "Host a two-person ‘Chopped’ challenge: each of you picks one surprise ingredient. Then make breakfast around it.",
          drinks: "Make a drink tasting flight — juices, coffee variations, or teas from different countries. Guess the origin of each.",
          mix: "Flip a coin for who picks the playlist, the drink, and the breakfast idea. Let fate (and fun) build your morning."
        }
      }
    }
  };
  
  export default firstDate;
  