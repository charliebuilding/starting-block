// Starting Block — Question Bank
// Categories: running, football, music, cities, nightlife, culture
// Each question: { category, question, options[], answer (index), fact }

const QUESTIONS = [
  // ─── RUNNING ──────────────────────────────────────────
  {
    category: "Running",
    question: "Where did parkrun originate in 2004?",
    options: ["Hyde Park", "Bushy Park", "Richmond Park", "Battersea Park"],
    answer: 1,
    fact: "13 runners turned up to the first ever parkrun at Bushy Park in Teddington. It now has over 8 million registered runners worldwide."
  },
  {
    category: "Running",
    question: "What is the official distance of a marathon in miles?",
    options: ["26.0 miles", "26.2 miles", "26.4 miles", "27.0 miles"],
    answer: 1,
    fact: "The extra 0.2 miles was added at the 1908 London Olympics so the race could finish in front of the Royal Box at White City Stadium."
  },
  {
    category: "Running",
    question: "Who broke the 2-hour marathon barrier in Vienna in 2019?",
    options: ["Kenenisa Bekele", "Mo Farah", "Eliud Kipchoge", "Haile Gebrselassie"],
    answer: 2,
    fact: "Kipchoge ran 1:59:40 but it wasn't ratified as an official world record because of the pacemaker setup and controlled conditions."
  },
  {
    category: "Running",
    question: "What does a negative split mean in running?",
    options: ["Running the second half faster than the first", "Slowing down in the final mile", "Splitting a race into intervals", "Running below your target pace"],
    answer: 0,
    fact: "Most elite marathon world records have been set with negative splits. It's considered the smartest way to race."
  },
  {
    category: "Running",
    question: "What's the name of the famous running track in Eugene, Oregon?",
    options: ["Hayward Field", "Franklin Field", "Iffley Road", "Bislett Stadium"],
    answer: 0,
    fact: "Hayward Field is known as 'Tracktown USA' and has hosted more Olympic Trials than any other venue in the country."
  },
  {
    category: "Running",
    question: "How many runners take part in the London Marathon each year (approx)?",
    options: ["25,000", "40,000", "50,000", "65,000"],
    answer: 2,
    fact: "The London Marathon is the largest annual fundraising event in the world, raising over £1 billion for charity since it started in 1981."
  },
  {
    category: "Running",
    question: "What does 'fartlek' mean in Swedish?",
    options: ["Fast running", "Speed play", "Long distance", "Hill training"],
    answer: 1,
    fact: "Fartlek training was developed in the 1930s by Swedish coach Gösta Holmér. It mixes steady running with bursts of speed."
  },
  {
    category: "Running",
    question: "Roger Bannister broke the 4-minute mile at which university track?",
    options: ["Cambridge", "Oxford", "Loughborough", "Birmingham"],
    answer: 1,
    fact: "Bannister ran 3:59.4 at Oxford's Iffley Road track on 6 May 1954. He was also a full-time medical student at the time."
  },
  {
    category: "Running",
    question: "Which shoe brand created the Vaporfly, changing marathon racing forever?",
    options: ["Adidas", "ASICS", "Nike", "New Balance"],
    answer: 2,
    fact: "The Nike Vaporfly's carbon fibre plate technology was so effective it sparked a debate about whether the shoes should be banned."
  },
  {
    category: "Running",
    question: "What's a common term for the wall runners hit around mile 20 of a marathon?",
    options: ["The bonk", "The crash", "The fade", "The drop"],
    answer: 0,
    fact: "Bonking happens when your body runs out of glycogen. Your legs feel like concrete and your brain starts bargaining with you to stop."
  },
  {
    category: "Running",
    question: "Which country dominates long-distance running and has produced most marathon world record holders?",
    options: ["Ethiopia", "Kenya", "Jamaica", "USA"],
    answer: 1,
    fact: "Kenya's Rift Valley, at high altitude, has produced a disproportionate number of elite distance runners. Many train in Iten, known as the 'Home of Champions'."
  },
  {
    category: "Running",
    question: "What does 'Couch to 5K' (C25K) help people do?",
    options: ["Train for a triathlon", "Go from zero to running 5K in 9 weeks", "Improve marathon times", "Build sprint speed"],
    answer: 1,
    fact: "The NHS Couch to 5K app has been downloaded millions of times and is one of the most successful public health initiatives in UK history."
  },
  {
    category: "Running",
    question: "What's the traditional distance of a cross-country race for senior men?",
    options: ["8K", "10K", "12K", "15K"],
    answer: 2,
    fact: "Cross-country is one of the purest forms of distance running — no watches, no pacers, just mud and guts."
  },

  // ─── FOOTBALL ─────────────────────────────────────────
  {
    category: "Football",
    question: "Which club is known for their classic yellow and green kit inspired by Brazil?",
    options: ["Norwich City", "Wolverhampton Wanderers", "Watford", "Burton Albion"],
    answer: 0,
    fact: "Norwich adopted their yellow and green colours in 1907. The canary became their symbol after the city's historical connection to canary breeding."
  },
  {
    category: "Football",
    question: "What's the name of the iconic goalkeeper shirt Lev Yashin was famous for wearing?",
    options: ["Green number 1", "The all-black kit", "Soviet red", "The grey wall"],
    answer: 1,
    fact: "Yashin was known as 'The Black Spider' because of his all-black kit. He's still considered the greatest goalkeeper of all time."
  },
  {
    category: "Football",
    question: "Which brand made the iconic England 1990 World Cup third shirt?",
    options: ["Nike", "Adidas", "Umbro", "Admiral"],
    answer: 2,
    fact: "The blue and white diamond-patterned third shirt from Italia '90 is one of the most sought-after retro football shirts in the world."
  },
  {
    category: "Football",
    question: "Which SE London club plays at The Valley?",
    options: ["Millwall", "Charlton Athletic", "Crystal Palace", "Lewisham Borough"],
    answer: 1,
    fact: "Charlton fans famously marched through the streets in 1990 to campaign for their return to The Valley after being groundshared out."
  },
  {
    category: "Football",
    question: "What's the name of the famous terrace culture fanzine that started in the late 1980s?",
    options: ["When Saturday Comes", "The Football Pink", "Match of the Day", "Four Four Two"],
    answer: 0,
    fact: "When Saturday Comes launched in 1986 and became the voice of the fan. It helped create the independent football media scene."
  },
  {
    category: "Football",
    question: "Which Italian city is famous for the San Siro stadium shared by two clubs?",
    options: ["Rome", "Turin", "Milan", "Naples"],
    answer: 2,
    fact: "AC Milan and Inter Milan both play at the San Siro — officially the Stadio Giuseppe Meazza. It's one of the most atmospheric grounds in world football."
  },
  {
    category: "Football",
    question: "What colour shirt does Brazil traditionally wear at home?",
    options: ["Green", "Yellow", "White", "Blue"],
    answer: 1,
    fact: "Brazil switched from white to yellow after losing the 1950 World Cup final at home. A newspaper competition chose the new kit colours from the Brazilian flag."
  },
  {
    category: "Football",
    question: "Which country hosted the 1990 World Cup, famous for Nessun Dorma and Gazza's tears?",
    options: ["Spain", "Mexico", "Italy", "France"],
    answer: 2,
    fact: "Italia '90 changed English football culture forever. The BBC's use of Pavarotti's Nessun Dorma brought opera to the terraces."
  },
  {
    category: "Football",
    question: "What's a 'casuals' firm traditionally associated with in football culture?",
    options: ["Coaching staff", "Designer fashion on the terraces", "Ultra drumming groups", "Youth academies"],
    answer: 1,
    fact: "The casuals movement started in the late 1970s — fans wearing high-end European sportswear and fashion labels instead of club colours."
  },
  {
    category: "Football",
    question: "Which London club is nicknamed 'The Lions'?",
    options: ["Chelsea", "Millwall", "Leyton Orient", "QPR"],
    answer: 1,
    fact: "Millwall FC was founded in 1885 by workers at a jam factory on the Isle of Dogs. Their 'no one likes us, we don't care' chant is iconic."
  },
  {
    category: "Football",
    question: "Which classic Adidas boot was known as 'The King' of football boots?",
    options: ["Copa Mundial", "Predator", "World Cup", "Samba"],
    answer: 0,
    fact: "The Copa Mundial has been in production since 1979, making it one of the longest-running boot designs in football history."
  },
  {
    category: "Football",
    question: "What year did the Premier League officially start?",
    options: ["1990", "1991", "1992", "1993"],
    answer: 2,
    fact: "The First Division rebranded as the Premier League in 1992. The first ever goal was scored by Brian Deane for Sheffield United."
  },

  // ─── MUSIC ────────────────────────────────────────────
  {
    category: "Music",
    question: "Which London pirate radio station helped launch UK garage in the late 90s?",
    options: ["Rinse FM", "Kiss FM", "Capital Xtra", "NTS"],
    answer: 0,
    fact: "Rinse FM broadcast illegally from tower blocks across East London for over a decade before finally getting a licence in 2010."
  },
  {
    category: "Music",
    question: "What BPM range is classic UK garage typically played at?",
    options: ["110-120", "125-135", "138-145", "150-160"],
    answer: 1,
    fact: "UK garage sits in that sweet spot — faster than house but smoother than jungle. It's the tempo that makes you want to two-step, not headbang."
  },
  {
    category: "Music",
    question: "'Insomnia' by Faithless is considered an anthem of which era?",
    options: ["Early 80s synth", "Late 90s dance", "Mid 2000s indie", "2010s EDM"],
    answer: 1,
    fact: "Faithless never mimed on Top of the Pops. Maxi Jazz insisted on performing live every time. Insomnia still fills dance floors 25+ years later."
  },
  {
    category: "Music",
    question: "Which DJ is credited as the 'Godfather of House Music'?",
    options: ["Carl Cox", "Frankie Knuckles", "Larry Levan", "David Guetta"],
    answer: 1,
    fact: "Frankie Knuckles' residency at The Warehouse in Chicago literally gave house music its name. The club's playlist became 'warehouse music' — then just 'house'."
  },
  {
    category: "Music",
    question: "What genre did Goldie and LTJ Bukem pioneer in the 90s?",
    options: ["Garage", "Grime", "Drum and bass", "Dubstep"],
    answer: 2,
    fact: "Goldie's album 'Timeless' in 1995 is considered one of the most important electronic albums ever made. It brought drum and bass to the mainstream."
  },
  {
    category: "Music",
    question: "Which London venue on Brick Lane was the spiritual home of UK grime?",
    options: ["Fabric", "Plastic People", "Ministry of Sound", "XOYO"],
    answer: 1,
    fact: "Plastic People was a tiny basement club that punched way above its size. It closed in 2015 and the UK electronic scene lost a sacred space."
  },
  {
    category: "Music",
    question: "What does MC stand for in UK music culture?",
    options: ["Music Creator", "Master of Ceremonies", "Mic Controller", "Main Character"],
    answer: 1,
    fact: "The MC tradition runs from sound system culture through jungle, garage, grime and beyond. The MC's job is to hype the crowd and ride the beat."
  },
  {
    category: "Music",
    question: "Which festival, held on a Surrey airfield, became legendary for early UK rave culture?",
    options: ["Glastonbury", "Creamfields", "Tribal Gathering", "Sunrise"],
    answer: 3,
    fact: "The Sunrise raves of 1988-89 were the epicentre of the Second Summer of Love. Thousands descended on fields and warehouses for illegal parties."
  },
  {
    category: "Music",
    question: "Boiler Room started in which city?",
    options: ["Berlin", "London", "New York", "Amsterdam"],
    answer: 1,
    fact: "Boiler Room started in a flat in Hackney in 2010, streaming DJ sets on a webcam. It's now the world's biggest underground music platform."
  },
  {
    category: "Music",
    question: "Which Artful Dodger track featuring Craig David reached #1 in 1999?",
    options: ["Fill Me In", "Re-Rewind", "Born to Do It", "Walking Away"],
    answer: 1,
    fact: "Re-Rewind brought UK garage to the mainstream. Craig David was just 18 and it launched one of the biggest careers in British music."
  },
  {
    category: "Music",
    question: "What genre typically runs at around 140 BPM with heavy sub-bass?",
    options: ["House", "Techno", "Dubstep", "UK Garage"],
    answer: 2,
    fact: "Dubstep evolved from the South London club scene in the early 2000s. Before it went mainstream, it was all about the sub-bass pressure in clubs like FWD>>."
  },
  {
    category: "Music",
    question: "Which legendary Manchester club was known as 'The Haçienda'?",
    options: ["Sankeys", "The Warehouse Project", "FAC 51", "Cream"],
    answer: 2,
    fact: "The Haçienda, officially FAC 51, was opened by Factory Records and New Order in 1982. It became the birthplace of the Madchester scene and acid house in the UK."
  },

  // ─── CITIES & CULTURE ────────────────────────────────
  {
    category: "Cities",
    question: "Which London borough is Hackney Wick in?",
    options: ["Tower Hamlets", "Hackney", "Newham", "Waltham Forest"],
    answer: 1,
    fact: "Hackney Wick has transformed from industrial marshland to one of London's most creative neighbourhoods. It has the highest concentration of artists in Europe."
  },
  {
    category: "Cities",
    question: "What's the name of Liverpool's famous waterfront area?",
    options: ["The Docks", "Albert Dock", "Pier Head", "The Strand"],
    answer: 1,
    fact: "Albert Dock was the first non-combustible warehouse system in the world when built in 1846. Now it's home to Tate Liverpool and the Beatles Story."
  },
  {
    category: "Cities",
    question: "Which area of Manchester is known as the Northern Quarter?",
    options: ["The area north of Piccadilly Gardens", "Salford Quays", "Didsbury", "Ancoats"],
    answer: 0,
    fact: "The Northern Quarter is Manchester's creative and independent district — full of vintage shops, record stores, street art, and some of the city's best bars."
  },
  {
    category: "Cities",
    question: "Southsea is a neighbourhood in which English city?",
    options: ["Southampton", "Brighton", "Portsmouth", "Bournemouth"],
    answer: 2,
    fact: "Southsea sits on the seafront of Portsea Island. It's got a strong independent culture with a tight-knit creative and running community."
  },
  {
    category: "Cities",
    question: "Which London market is famous for street food, vintage fashion, and being by the canal?",
    options: ["Borough Market", "Portobello Road", "Camden Lock", "Broadway Market"],
    answer: 2,
    fact: "Camden Lock Market started in 1974 and became a magnet for alternative culture. The canal-side setting makes it one of London's most recognisable spots."
  },
  {
    category: "Cities",
    question: "What does the Welsh word 'Caerdydd' mean?",
    options: ["Castle town", "Cardiff", "River city", "Green valley"],
    answer: 1,
    fact: "Caerdydd is simply the Welsh name for Cardiff. The city's name likely comes from 'Caer' (fort) and 'Taf' (the River Taff that runs through it)."
  },
  {
    category: "Cities",
    question: "Which bridge connects Canary Wharf to Greenwich Peninsula?",
    options: ["Tower Bridge", "Millennium Bridge", "Blackwall Tunnel", "There isn't one — you take the cable car or tunnel"],
    answer: 3,
    fact: "The Emirates Air Line cable car connects Greenwich Peninsula to the Royal Docks. Or you can walk through the Victorian foot tunnel under the Thames."
  },
  {
    category: "Cities",
    question: "Peckham Rye is famous for its park, but what's the area also known for culturally?",
    options: ["Michelin star restaurants", "Rooftop bars and art scene", "The City's financial district", "Classic car dealerships"],
    answer: 1,
    fact: "Peckham has one of the most vibrant art and nightlife scenes in South London. Frank's Café on a multi-storey car park rooftop became iconic."
  },
  {
    category: "Cities",
    question: "Which city is home to the Toxteth neighbourhood?",
    options: ["Manchester", "Liverpool", "Birmingham", "Leeds"],
    answer: 1,
    fact: "Toxteth has deep multicultural roots and a rich history. It was home to the UK's oldest Black community, dating back to the 1730s."
  },

  // ─── NIGHTLIFE & CULTURE ──────────────────────────────
  {
    category: "Nightlife",
    question: "What does 'sober curious' mean?",
    options: ["Being allergic to alcohol", "Choosing to question your drinking habits without necessarily quitting completely", "Only drinking on weekdays", "A medical condition"],
    answer: 1,
    fact: "The sober-curious movement has grown massively in recent years, with more people choosing to socialise without alcohol — especially in the fitness community."
  },
  {
    category: "Nightlife",
    question: "Which iconic London club on Charterhouse Street is known for its marathon weekend sessions?",
    options: ["Printworks", "Fabric", "Corsica Studios", "Egg London"],
    answer: 1,
    fact: "Fabric opened in 1999 in a former cold store. Its bodysonic dancefloor literally vibrates bass through your feet. It nearly closed in 2016 but the community saved it."
  },
  {
    category: "Nightlife",
    question: "Morning Gloryville is famous for what?",
    options: ["Sunday roasts", "Sober morning raves", "Late-night karaoke", "Sunrise yoga"],
    answer: 1,
    fact: "Morning Gloryville pioneered the sober rave — people dancing before work with coffee, smoothies, and massive sound systems. No alcohol, just vibes."
  },
  {
    category: "Nightlife",
    question: "What time does a typical Sound System event traditionally start in UK culture?",
    options: ["6pm", "9pm", "Midnight or later", "It doesn't start — it arrives when it arrives"],
    answer: 2,
    fact: "Sound system culture has roots in Jamaica and came to the UK through Caribbean communities. Sessions are late-night, outdoor, and community-run."
  },
  {
    category: "Nightlife",
    question: "What's the name of the massive drink brand that's championed the 0% alcohol movement?",
    options: ["BrewDog AF", "Lucky Saint", "Heineken 0.0", "All of these"],
    answer: 3,
    fact: "The non-alcoholic drinks market in the UK has grown by over 500% in the last decade. What used to be 'just a lime and soda' is now a whole category."
  },
  {
    category: "Nightlife",
    question: "Notting Hill Carnival celebrates which cultural heritage?",
    options: ["African", "Caribbean", "South Asian", "Brazilian"],
    answer: 1,
    fact: "Notting Hill Carnival started in 1966 and is Europe's largest street festival. It was created by the Caribbean community in response to racial tensions in the area."
  },
  {
    category: "Nightlife",
    question: "What's a 'two-step' in the context of UK nightlife?",
    options: ["A cocktail recipe", "A UK garage dance style", "A DJ mixing technique", "A door entry policy"],
    answer: 1,
    fact: "The two-step is the signature dance of UK garage — a shuffling, rhythmic movement that matches the syncopated beat. If you know, you know."
  },
  {
    category: "Culture",
    question: "Strava's 'kudos' feature is the running equivalent of what?",
    options: ["A like", "A comment", "A follow", "A share"],
    answer: 0,
    fact: "Strava has become the social network for runners. Kudos are given freely but checking if someone gave you kudos back is a whole thing."
  },
  {
    category: "Culture",
    question: "What's the term for running the same route as someone on Strava to compare times?",
    options: ["Ghosting", "Segment hunting", "Shadow running", "Pace matching"],
    answer: 1,
    fact: "Strava segments turn any stretch of road into a competition. Some runners plan entire routes just to grab a CR (course record) on a local segment."
  },
  {
    category: "Culture",
    question: "What day of the week is parkrun held in the UK?",
    options: ["Sunday", "Saturday", "Friday", "Any day"],
    answer: 1,
    fact: "Saturday 9am, every week, rain or shine. Junior parkrun (2K, for kids) runs on Sundays. Volunteering counts as attendance too."
  },
  {
    category: "Culture",
    question: "What does 'PE nation' refer to in streetwear culture?",
    options: ["A school subject", "An Australian activewear brand blending sport and fashion", "A government fitness programme", "A Nike sub-brand"],
    answer: 1,
    fact: "PE Nation represents the crossover between athletic performance and street fashion — exactly where fitness culture and nightlife culture meet."
  },
  {
    category: "Culture",
    question: "What's 'plogging'?",
    options: ["Slow jogging", "Picking up litter while running", "Running through puddles", "Blogging about running"],
    answer: 1,
    fact: "Plogging started in Sweden — 'plocka upp' (pick up) + jogging. It combines fitness with environmental activism and has spread worldwide."
  }
];
