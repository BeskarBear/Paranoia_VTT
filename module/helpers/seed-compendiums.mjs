const EQUIPMENT = [
  // Armour
  {
    name: "Double Armour",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Green",
      category: "armor",
      successEffect: "-2 successes from any attack roll using lasers lower than UV or physical attacks like bullets.",
      treasonEffect: "Protective but bulky; -1 NODE to all rolls while wearing it from now on.",
      notes: "Reflec + Kevlar combination."
    }
  },
  {
    name: "Kevlar Armour",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Orange",
      category: "armor",
      successEffect: "-3 successes from all attack rolls using physical damage like knives or truncheons. Energy attacks like lasers are unaffected.",
      treasonEffect: "Too bad this did not cover the groin; take damage normally and hope to avoid a Maimed result.",
      notes: "Helmet, vest, arm and leg armour."
    }
  },
  {
    name: "Reflec Armour",
    type: "equipment",
    system: {
      level: 1,
      clearance: "Red-Violet",
      category: "armor",
      successEffect: "Remove one success from a laser attack of the same clearance or lower.",
      treasonEffect: "This should have been worn over the face. Take damage normally.",
      notes: "Shiny jumpsuits that block same-color lasers or lower."
    }
  },
  {
    name: "Riot Shield",
    type: "equipment",
    system: {
      level: 1,
      clearance: "Red",
      category: "armor",
      successEffect: "-1 success from an attack roll's result before determining damage.",
      treasonEffect: "The shield worked but broke.",
      notes: "Clear rectangular shield with a smiley face."
    }
  },
  {
    name: "Total Safety Armour (The Safe)",
    type: "equipment",
    system: {
      level: 5,
      clearance: "Blue",
      category: "armor",
      successEffect: "Block all damage, even from lava, nukes, etc.",
      treasonEffect: "The Safe has fallen and anyone inside is stuck.",
      notes: "Coffin-shaped metal container. No mobility."
    }
  },

  // Intel and counterintel gear
  {
    name: "Data Bomb",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Green",
      category: "gear",
      successEffect: "All digitally stored data within 1 meter is permanently erased. Bots either go Frankenstein or power down.",
      treasonEffect: "Only the user's Coretech is affected; amnesia for the user.",
      notes: "Polymorphic worm device."
    }
  },
  {
    name: "Actor's Friend",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Yellow",
      category: "gear",
      successEffect: "+1 success on the next applicable roll.",
      treasonEffect: "-2 NODE for the next applicable roll because no one looks like that normally.",
      notes: "Makeup, wigs, fake moustaches and teeth."
    }
  },
  {
    name: "Light Emitter Disguise Kit",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Orange",
      category: "gear",
      successEffect: "+1 Treason Star to anyone saying you are not a lamp.",
      treasonEffect: "Cannot act until something hits you because lamps don't move.",
      notes: "Lampshade hat and fake power cord."
    }
  },
  {
    name: "Spybot",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Orange",
      category: "gear",
      successEffect: "+1 success for spying on a scene.",
      treasonEffect: "Drone gets chewed on by a petbot and destroyed.",
      notes: "Four-rotor drone controlled by Coretech."
    }
  },
  {
    name: "Torch",
    type: "equipment",
    system: {
      level: 0,
      clearance: "Red",
      category: "gear",
      successEffect: "You can see.",
      treasonEffect: "Torch goes out; -2 Moxie (-3 if in total darkness).",
      notes: "Standard flashlight."
    }
  },
  {
    name: "Sense Multiplier",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Yellow",
      category: "gear",
      successEffect: "+2 successes for using any of the five senses to gather intel.",
      treasonEffect: "Overstimulation; -2 Moxie.",
      notes: "Triples sensory range and sensitivity."
    }
  },

  // Malfeasance control devices (MCD)
  {
    name: "Ankle Monitor",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Red",
      category: "gear",
      successEffect: "Know the exact location of the monitor.",
      treasonEffect: "User fails to unlock; target escapes.",
      notes: "Can only be put on or removed by higher clearance."
    }
  },

  // Miscellaneous gear
  {
    name: "Elevator Safety Foam",
    type: "equipment",
    system: {
      level: 1,
      clearance: "Infrared",
      category: "gear",
      successEffect: "Remove all but one wound from a drop or fall.",
      treasonEffect: "Foam gets in lungs; user dies.",
      notes: "Foam fills an elevator-sized area."
    }
  },
  {
    name: "Medkit",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Orange",
      category: "gear",
      successEffect: "Heal 1 wound, +1 additional wound per success above the DIFF.",
      treasonEffect: "Increase the wound by one step (Injured to Maimed).",
      notes: "Simple first aid supplies."
    }
  },
  {
    name: "Repkit",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Orange",
      category: "gear",
      successEffect: "+2 successes to repair a bot or mechanical device.",
      treasonEffect: "Repaired device is permanently broken; +1 Treason Star.",
      notes: "Simple tools and spare parts."
    }
  },

  // Prescriptions and control gear
  {
    name: "Hyperspray",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Yellow",
      category: "gear",
      successEffect: "Target enjoys whatever drug was in the spray.",
      treasonEffect: "User sprayed their own eyes.",
      notes: "Single-use prescription drug spray."
    }
  },
  {
    name: "Pedestrian Cruise Control",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Orange",
      category: "gear",
      successEffect: "Force the wearer to walk a route for five minutes at a time.",
      treasonEffect: "Wearer walks into a wall for a Hurt; user gets +1 Treason Star.",
      notes: "Leg braces controlled by owner's Coretech."
    }
  },
  {
    name: "Gelgernine (Happy Pills)",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Red",
      category: "gear",
      successEffect: "+2 Moxie and reduce all current flags by one step.",
      treasonEffect: "User cannot complain about anything.",
      notes: "Happiness in a little blue pill."
    }
  },
  {
    name: "Focusol",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Red",
      category: "gear",
      successEffect: "+1 success to all Brains rolls.",
      treasonEffect: "-2 NODE to all Chutzpah rolls.",
      notes: "Laser-like focus."
    }
  },
  {
    name: "Traitor Leash",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Red",
      category: "gear",
      successEffect: "-2 NODE for trying to escape or go where the user does not want.",
      treasonEffect: "Accidentally free the target and get +2 Treason Stars.",
      notes: "Metal collar with elastic leash."
    }
  },
  {
    name: "Zip Ties",
    type: "equipment",
    system: {
      level: 1,
      clearance: "Red",
      category: "gear",
      successEffect: "-4 NODE for all rolls using hands or movement until removed.",
      treasonEffect: "Dropped the tie while putting it on; traitor gets one free attack.",
      notes: "Plastic cords for tying hands or feet."
    }
  },
  {
    name: "Oxyfenerin",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Orange",
      category: "gear",
      successEffect: "No NODE penalties due to wounds.",
      treasonEffect: "-3 NODE for anything involving touch (not triggers).",
      notes: "Painkiller."
    }
  },
  {
    name: "Flashbang Grenade",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Red",
      category: "weapon",
      successEffect: "All in the room are blind and deaf for three rounds.",
      treasonEffect: "Grenade bounces back; only the user is blind and deaf for three rounds.",
      notes: "Disorientation grenade."
    }
  },
  {
    name: "Thymoblandin",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Red",
      category: "gear",
      successEffect: "+1 success for rolls about staying calm; Moxie loss reduced by one.",
      treasonEffect: "Took thymoglandin instead; -3 NODE to avoid fighting when stressed.",
      notes: "Calming pill with cross imprint."
    }
  },
  {
    name: "Frag Grenade",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Orange",
      category: "weapon",
      successEffect: "Any wound level is doubled.",
      treasonEffect: "Threw the pin and tossed the grenade where the GM says.",
      notes: "Anti-personnel grenade."
    }
  },
  {
    name: "Thymoglandin",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Blue",
      category: "gear",
      successEffect: "+1 success to all Violence rolls.",
      treasonEffect: "Took thymoblandin instead; -3 NODE to attack anyone or defend.",
      notes: "Fight ferociously."
    }
  },

  // Weapons
  {
    name: "Cone Rifle (Big Blue)",
    type: "equipment",
    system: {
      level: 4,
      clearance: "Blue",
      category: "weapon",
      successEffect: "Hurts from this weapon become Maimed and all other wounds become Dead.",
      treasonEffect: "Missed target and hit something important; -100 XP Points and gain a C-of-I flag.",
      notes: "Unguided shoulder-fired RPG launcher."
    }
  },
  {
    name: "Gauss Rifle",
    type: "equipment",
    system: {
      level: 3,
      clearance: "Blue",
      category: "weapon",
      successEffect: "Bot stunned for 1d6 rounds; people are tickled.",
      treasonEffect: "Ungrounded wire shocks for an Injured wound and the user drops it.",
      notes: "Long rifle shooting electricity."
    }
  },
  {
    name: "Knife",
    type: "equipment",
    system: {
      level: 0,
      clearance: "Red",
      category: "weapon",
      successEffect: "Target is bleeding and gains one Hurt each round until treated.",
      treasonEffect: "Forgot which end was sharp; same bleeding effect on the user.",
      notes: "Sharp and shiny."
    }
  },
  {
    name: "Laser Pistol",
    type: "equipment",
    system: {
      level: 0,
      clearance: "Red-Violet",
      category: "weapon",
      successEffect: "",
      treasonEffect: "Battery ran out; find a charging station or battery fast.",
      notes: "Standard issue in Red through Violet."
    }
  },
  {
    name: "Laser Rifle",
    type: "equipment",
    system: {
      level: 1,
      clearance: "Orange-Violet",
      category: "weapon",
      successEffect: "Any Hurt wound caused by this is an Injured wound instead.",
      treasonEffect: "Battery ran out and will not hold a charge anymore.",
      notes: "Longer, more accurate laser gun."
    }
  },
  {
    name: "Neurowhip",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Green",
      category: "weapon",
      successEffect: "-2 Moxie and cannot act next round.",
      treasonEffect: "Hit something important or valuable instead of the target.",
      notes: "Triggers every pain receptor."
    }
  },
  {
    name: "Plasma Generator",
    type: "equipment",
    system: {
      level: 5,
      clearance: "Violet",
      category: "weapon",
      successEffect: "Vaporize the target and anything behind it.",
      treasonEffect: "Looked into the nozzle; the user's head goes missing along with the area behind it.",
      notes: "Superheated plasma blast."
    }
  },
  {
    name: "Skinnerstick (The Teacher)",
    type: "equipment",
    system: {
      level: 1,
      clearance: "Orange",
      category: "weapon",
      successEffect: "No wounds; -1 Moxie per wound that would have been applied normally.",
      treasonEffect: "Hit self by accident for -2 Moxie.",
      notes: "Glorified cattle prod."
    }
  },
  {
    name: "Sleep Grenade",
    type: "equipment",
    system: {
      level: 2,
      clearance: "Orange",
      category: "weapon",
      successEffect: "Targets within range fall asleep for 1 minute per success.",
      treasonEffect: "Looks like a frag grenade; did you need them alive?",
      notes: "Sleep gas grenade."
    }
  },
  {
    name: "Tacnuke Grenade",
    type: "equipment",
    system: {
      level: 18,
      clearance: "Violet",
      category: "weapon",
      successEffect: "You are dead. Lots of people are dead too.",
      treasonEffect: "You are still dead. They are still dead too.",
      notes: "Tactical nuclear weapon."
    }
  },
  {
    name: "Truncheon",
    type: "equipment",
    system: {
      level: 0,
      clearance: "Infrared",
      category: "weapon",
      successEffect: "Break a target's bone, turning Injured into Maimed (Hurt stays Hurt).",
      treasonEffect: "Sweaty hands; truncheon goes flying across the room.",
      notes: "IntSec baton or similar."
    }
  }
];

const MUTANT_POWERS = [
  { name: "Adrenalin Control", purpose: "Impressive bursts of strength and speed", warning: "Can lead to aggression and wounds" },
  { name: "Clone Empathy", purpose: "Win friends and influence people against their will", warning: "Can backfire and make people despise you" },
  { name: "Corrode", purpose: "Turn metal into a warm, ashy goo", warning: "Rarely affects your own hands, hardly ever" },
  { name: "Cryokinesis", purpose: "Create severe cold, even freeze things", warning: "Oww, brain freeze!" },
  { name: "Electroshock", purpose: "Shoot a bolt of electricity from your fingertips", warning: "Might short-out electric devices nearby" },
  { name: "Force Field", purpose: "Project a 1-metre circle of invisible protection", warning: "It can block air, so how long can you hold your breath?" },
  { name: "Hypersenses", purpose: "Turn the normal five senses up to 11", warning: "Overstimulation puts it mildly" },
  { name: "Invisibility", purpose: "Go invisible, including your clothes and gear", warning: "Ewww, only the skin went invisible" },
  { name: "Machine Empathy", purpose: "Bots and even The Computer can obey you", warning: "Can backfire and make bots and The Computer hate you" },
  { name: "Mental Blast", purpose: "Damage someone's brain from a distance", warning: "Can be reflected back at your own mind" },
  { name: "Pyrokinesis", purpose: "Create severe heat, even light things aflame", warning: "Oww, 2nd-degree burns!" },
  { name: "Telekinesis", purpose: "Move things with your mind", warning: "Move everything except the thing" },
  { name: "Telepathy", purpose: "Speak silently to others mind-to-mind", warning: "Did you just broadcast your own thoughts?" },
  { name: "Teleport", purpose: "Bamf yourself to a new location you can see", warning: "It is easy to forget to bring clothes and gear along for the ride" },
  { name: "X-ray Vision", purpose: "See through metal, flesh and similar materials", warning: "Well hello, ocular melanoma!" }
].map((power) => ({
  name: power.name,
  type: "mutantPower",
  system: {
    purpose: power.purpose,
    warning: power.warning,
    notes: ""
  }
}));

const SECRET_SOCIETIES = [
  { name: "Antimutant", purpose: "Kill mutants and stop chemicals in food and drink that cause mutations", plus: "Intimidate", minus: "Bluff" },
  { name: "Communists", purpose: "Turn Alpha Complex into a communist utopia for the people", plus: "Stealth", minus: "Charm" },
  { name: "Corpore Metal", purpose: "Humans are obsolete so track bot stats like footballers", plus: "Program", minus: "Psychology" },
  { name: "Death Leopard", purpose: "Rock out, get wasted and cause a lot of mayhem (and get away with it)", plus: "Throw", minus: "Engineer" },
  { name: "FCCCP", purpose: "Worship The Computer as God and punish heathens and heretics", plus: "Psychology", minus: "Science" },
  { name: "Frankenstein Destroyers", purpose: "Bots are evil and should be destroyed, but are you secretly an android?", plus: "Melee", minus: "Program" },
  { name: "Free Enterprise", purpose: "Gangs that sell anything to anyone for the right price", plus: "Bluff", minus: "Bureaucracy" },
  { name: "Haxxor", purpose: "Information and Friend Computer must be under human control", plus: "Operate", minus: "Melee" },
  { name: "Psion", purpose: "Humans are obsolete so blindly obey your mutant masters", plus: "Science", minus: "Athletics" },
  { name: "PURGE", purpose: "Weekend warriors set on destroying everything and starting over", plus: "Demolition", minus: "Stealth" },
  { name: "Romantics", purpose: "Pre-Whoops life was way better despite knowing nothing about it", plus: "Bureaucracy", minus: "Intimidate" },
  { name: "Sierra Club", purpose: "Lovers of nature who are eager to kill to protect it", plus: "Athletics", minus: "Alpha Complex" }
].map((society) => ({
  name: society.name,
  type: "secretSociety",
  system: {
    purpose: society.purpose,
    modifiers: {
      plus: society.plus,
      minus: society.minus
    },
    notes: ""
  }
}));

const CORETECH = [
  {
    name: "Action Cache",
    type: "coretech",
    system: {
      level: 2,
      app: "Copy nerve signals used in your last action so it can be repeated even if incapacitated.",
      notes: "S: Redo the user's last action on the turn after their death; make a roll if necessary. T: The last action never stops happening until the corpse falls apart; next clone starts with -50 XP Points."
    }
  },
  {
    name: "Happy Place",
    type: "coretech",
    system: {
      level: 1,
      app: "Fills the brain with sights, sounds and smells that reduce stress.",
      notes: "S: Cancel losing up to 3 Moxie from a stressful event. T: So happy that nothing aggressive can be done; will happily get beat up rather than fight."
    }
  },
  {
    name: "Pak-N-Sniff",
    type: "coretech",
    system: {
      level: 2,
      app: "Intercept data packets from a target's Coretech signal before they act.",
      notes: "S: Pick a human character and go one clearance before them this round. T: Overwhelmed by packets; go dead last this round."
    }
  },
  {
    name: "Vidiot Studio Pro",
    type: "coretech",
    system: {
      level: 2,
      app: "Idiot-proof video editing software for Coretech recordings.",
      notes: "S: +1 success when editing video evidence or using it to back accusations. T: Deleted the good parts; +1 Treason Star."
    }
  },
  {
    name: "Sense Multiplier",
    type: "coretech",
    system: {
      level: 3,
      app: "Triples range and sensitivity of sensory signals to Coretechs.",
      notes: "S: +2 successes for using any of the five senses to gather intel. T: Overstimulation; -2 Moxie."
    }
  }
];

const NPC_QUIRKS = [
  "Angered by any delays.",
  "Constantly looking for more XP Points.",
  "Selling soylent-based candy bars.",
  "Keeps correcting people's grammar.",
  "Allergic to FunFoods. (Cold Fun, Hot Fun, more?)",
  "Talks so softly that it is hard to hear them.",
  "Takes stupid risks to show they are not living in fear.",
  "Constantly inventing acronyms.",
  "Speaks with hands more than words.",
  "Stands too close to others when talking.",
  "Never feels guilt or remorse.",
  "Easily distracted by noises.",
  "Gets hiccups at the drop of a hat.",
  "Instinctively bootlicks higher clearances.",
  "Always cold and wears a sweater.",
  "A hypochondriac about trash and recyclables.",
  "Addicted to gelgernine (Happy Pills).",
  "Refuses to admit they are wrong.",
  "Thinks literally everyone is out to get them.",
  "Total bully and strong enough to do that.",
  "Never touches anybody unless forced to.",
  "Continuously writing a legal Teela-O fanfic.",
  "Always chewing gum with an open mouth.",
  "Hums when thinking or working.",
  "Stays two metres away from others whenever possible.",
  "Does not walk so much as sashays.",
  "Has a limp that moves from left leg to right.",
  "Everything is a contest and they must win.",
  "Keeps calling people 'homeslice'.",
  "Absolutely zero sense of direction.",
  "Constantly counting steps for a vague exercise goal.",
  "Obsessed with Captain Alpha.",
  "Laughs when nervous or threatened.",
  "Constant sniffles and the occasional sneeze.",
  "Voice kind of sounds like Friend Computer. (Kind of.)",
  "Cries when upset. Also, frequently upset.",
  "Thinks bots are adorable and loves to pet them.",
  "Refuses to use contractions (AKA The Traitor's Grammar).",
  "Has a 'Kick me I'm a traitor' sign taped to their back.",
  "Terrified by blood or injuries.",
  "Gets winded by half a flight of stairs.",
  "Aspires to be a Vulture Squadron Warrior.",
  "Does not stop smiling, even when asleep.",
  "Talks about rare transbots even if no one cares.",
  "Never smiles and literally says, 'Ha ha' instead of laughing.",
  "Wow, their skin is sooooo clear and soft!",
  "Clothes smell like smoke from burning plastic.",
  "Jaws are wired shut and can only grunt, not speak.",
  "Always tired and looking for a place to lie down.",
  "Yeah, they have not showered all week."
];

const NPC_LOOKS = [
  "Freckles and suspicious moles everywhere.",
  "Armour so clean it dazzles in the light.",
  "Small with an ill-fitting jumpsuit.",
  "Wow, that's a lot of muscles.",
  "So tall that they are always stooping down a bit.",
  "Beady little eyes that always look tear-filled.",
  "Immaculate and brilliantly fashionable.",
  "Bow-legged and walks with a limp.",
  "Flat affect no matter what they hear or see.",
  "Hair down to their waist in a giant braid.",
  "Trying hard to look like Teela-O.",
  "Captain Alpha-like great posture.",
  "Look that could turn Hot Fun cold.",
  "Filthy, long fingernails.",
  "Clothes have a bunch of old food stains.",
  "Nuthin' but skin and bones (figuratively).",
  "Bob cut, too much makeup and dark pantsuit.",
  "Has 'Angry' tattooed across the forehead.",
  "Barrel-chested and muscular but skipped leg day.",
  "Pale and sickly with a cough that will not go away.",
  "Wears a hardhat with an expensive suit.",
  "Oh, they are high on something all right.",
  "Glorious red hair in a stylish updo.",
  "Neckbeard, oily hair, lots of zits.",
  "Damn, those are some chapped lips.",
  "Too-white teeth but one is missing.",
  "Unibrow that seems to grow as you watch.",
  "One lazy eye and always sweating.",
  "No legs, uses a motorised wheelchair.",
  "Jagged scar across their forehead.",
  "No way that smile isn't insanity-based.",
  "Shiny bald head. Like, polished shiny.",
  "Broke their collarbone so one arm is in a sling.",
  "Basically, it is a clearance-specific ball gown.",
  "Looks very young but has a shock of white hair.",
  "Long sleeves rolled up and collar popped.",
  "Always blushing and breathing loudly.",
  "Wears a clearance-appropriate tracksuit and trainers.",
  "Pigtails are legal, even that many.",
  "Wears a laser pistol on each hip.",
  "Has a Vulture Squadron Warrior-grade buzz cut.",
  "Utility belt is overflowing with simple accessories.",
  "Wears a scarf even though it is not cold.",
  "Has perpetual bed head.",
  "Slight hunchback but incredibly beautiful.",
  "Carries a digital clipboard and a pocket full of styluses.",
  "Hair is combed with ruler-like precision.",
  "Black choker at the neck and shoes with thick, high heels.",
  "Clothes are dishevelled and wrinkled but smell fresh.",
  "Wears 17 different pins spouting loyalty slogans."
];

const NPC_PLANS = [
  "Confirm identities of nearby citizens just in case.",
  "Harass others to feel happier for a moment.",
  "Give out four more fines to meet a quota or else.",
  "Improve team efficiency by at least 17%.",
  "Keep being overlooked to avoid being volunteered.",
  "Find a patsy for treason they committed a few minutes ago.",
  "No one gets through this checkpoint. No one.",
  "Get that damn promotion already.",
  "Break people from their chains and establish a worker's paradise.",
  "Mess with those [Insert Service Group] bastards.",
  "Kill those [Insert Service Group] bastards.",
  "Just wants to go to bed already.",
  "Find that explosive wherever it went.",
  "See what the Outdoors or Underplex is really like.",
  "Feel smarter by making others feel dumb.",
  "Try every flavour of B3 ever made.",
  "Do not let anyone walk faster than you, seriously, no one.",
  "Convince others that the band Twin Clones is the best ever.",
  "Discover who sent them that weird message.",
  "Take revenge on those who laughed at them.",
  "Teach those fools at the university that you are not mad!",
  "Make [Insert Any Name] pay for their insolence.",
  "Do as little work as possible without dying.",
  "Hunt down and kill the real Lenny-R-JRK.",
  "Find their way to a black market.",
  "Needs to die to get rid of flags but cannot do it themselves.",
  "Find where that foul odour is coming from.",
  "Wait for someone to screw up so you can report them immediately.",
  "Destroy The Computer and usher in a new age of freedom and happiness.",
  "Protect The Computer and keep the current age of freedom and happiness.",
  "Pretend to be deaf to catch others committing treason.",
  "Sell counterfeit Funbot memorabilia.",
  "Make it onto the show Songs in Praise of The Computer.",
  "Find and kill the most loyal clone here.",
  "Join a secret society to finally have some friends.",
  "Upload a Trojan horse they coded into someone's Coretech.",
  "Keep interrogation skills sharp by practising daily.",
  "Track down an old roommate to murder him.",
  "These boots are not going to spit-shine themselves, maggot!",
  "Discreetly buy and sell [Insert Prescription] illegally.",
  "Find the next Teela-O-MLY.",
  "Follow and try to join a Troubleshooter team.",
  "Pretend to be everyone's best friend and then betray them.",
  "Make up a nickname for every clone they meet.",
  "Has a lot of trouble keeping their temper under control.",
  "Collect autographs from celebrity citizens.",
  "Keep down today's suspicious lunch.",
  "Do not let anyone know about their extreme fear of scrubots.",
  "Disguise ignorance by answering questions with other questions.",
  "Do not let them realise all this is being recorded for a reality show."
];

const NPCS = [
  {
    name: "NPC Somebody Template",
    type: "npc",
    system: {
      identity: {
        cloneName: "",
        clearance: "R",
        sector: "",
        cloneNumber: 0,
        teamName: "",
        mbd: "",
        serviceGroup: ""
      },
      resources: {
        moxie: { value: 0, max: 8 },
        xp: { value: 0 },
        treasonStars: { value: 0 }
      },
      wounds: { level: "fine" },
      npc: {
        quote: "",
        basics: {
          serviceGroup: "",
          secretSociety: "",
          mutantPower: ""
        },
        looks: "",
        quirks: "",
        plans: "",
        gear: ""
      }
    }
  },
  {
    name: "NPC Nobody Template",
    type: "npc",
    system: {
      identity: {
        cloneName: "",
        clearance: "R",
        sector: "",
        cloneNumber: 0,
        teamName: "",
        mbd: "",
        serviceGroup: ""
      },
      resources: {
        moxie: { value: 0, max: 8 },
        xp: { value: 0 },
        treasonStars: { value: 0 }
      },
      wounds: { level: "fine" },
      npc: {
        quote: "",
        basics: {
          serviceGroup: "",
          secretSociety: "",
          mutantPower: ""
        },
        looks: "",
        quirks: "",
        plans: "",
        gear: ""
      }
    }
  }
];

async function ensurePack({ name, label, type }) {
  const packId = `world.${name}`;
  const existing = game.packs.get(packId);
  if (existing) return existing;

  return CompendiumCollection.createCompendium({
    name,
    label,
    type,
    package: "world"
  });
}

async function seedPack(pack, items) {
  if (!pack) return;
  const index = await pack.getIndex();
  if (index.size > 0) return;
  for (const item of items) {
    await Item.create(item, { pack: pack.collection });
  }
}

function buildTableResults(entries) {
  const textType = (typeof CONST !== "undefined" && CONST.TABLE_RESULT_TYPES)
    ? CONST.TABLE_RESULT_TYPES.TEXT
    : 0;

  return entries.map((text, index) => ({
    type: textType,
    text,
    range: [index + 1, index + 1],
    weight: 1,
    drawn: false
  }));
}

async function seedRollTablePack(pack, tables) {
  if (!pack) return;
  const index = await pack.getIndex();
  if (index.size > 0) return;
  for (const table of tables) {
    await RollTable.create(table, { pack: pack.collection });
  }
}

export async function seedCompendiums() {
  const equipmentPack = await ensurePack({
    name: "paranoia-equipment",
    label: "Paranoia Equipment",
    type: "Item"
  });
  const mutantPack = await ensurePack({
    name: "paranoia-mutant-powers",
    label: "Paranoia Mutant Powers",
    type: "Item"
  });
  const societyPack = await ensurePack({
    name: "paranoia-secret-societies",
    label: "Paranoia Secret Societies",
    type: "Item"
  });
  const coretechPack = await ensurePack({
    name: "paranoia-coretech",
    label: "Paranoia Coretech & Apps",
    type: "Item"
  });
  const npcPack = await ensurePack({
    name: "paranoia-npcs",
    label: "Paranoia NPCs",
    type: "Actor"
  });
  const npcTablesPack = await ensurePack({
    name: "paranoia-npc-tables",
    label: "Paranoia NPC Tables",
    type: "RollTable"
  });

  await seedPack(equipmentPack, EQUIPMENT);
  await seedPack(mutantPack, MUTANT_POWERS);
  await seedPack(societyPack, SECRET_SOCIETIES);
  await seedPack(coretechPack, CORETECH);
  if (npcPack) {
    const npcIndex = await npcPack.getIndex();
    if (npcIndex.size === 0) {
      for (const npc of NPCS) {
        await Actor.create(npc, { pack: npcPack.collection });
      }
    }
  }

  await seedRollTablePack(npcTablesPack, [
    {
      name: "NPC Quirks",
      formula: `1d${NPC_QUIRKS.length}`,
      results: buildTableResults(NPC_QUIRKS)
    },
    {
      name: "NPC Looks",
      formula: `1d${NPC_LOOKS.length}`,
      results: buildTableResults(NPC_LOOKS)
    },
    {
      name: "NPC Plans",
      formula: `1d${NPC_PLANS.length}`,
      results: buildTableResults(NPC_PLANS)
    }
  ]);
}
