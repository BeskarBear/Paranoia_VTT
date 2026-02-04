export const PARANOIA_CONFIG = {
  stats: {
    brains: "Brains",
    chutzpah: "Chutzpah",
    mechanics: "Mechanics",
    violence: "Violence"
  },
  skills: {
    alphaComplex: { label: "Alpha Complex", stat: "brains" },
    bureaucracy: { label: "Bureaucracy", stat: "brains" },
    psychology: { label: "Psychology", stat: "brains" },
    science: { label: "Science", stat: "brains" },

    bluff: { label: "Bluff", stat: "chutzpah" },
    charm: { label: "Charm", stat: "chutzpah" },
    intimidate: { label: "Intimidate", stat: "chutzpah" },
    stealth: { label: "Stealth", stat: "chutzpah" },

    demolition: { label: "Demolition", stat: "mechanics" },
    engineer: { label: "Engineer", stat: "mechanics" },
    operate: { label: "Operate", stat: "mechanics" },
    program: { label: "Program", stat: "mechanics" },

    athletics: { label: "Athletics", stat: "violence" },
    guns: { label: "Guns", stat: "violence" },
    melee: { label: "Melee", stat: "violence" },
    throw: { label: "Throw", stat: "violence" }
  },
  woundLevels: {
    fine: { label: "Fine", penalty: 0 },
    hurt: { label: "Hurt", penalty: -1 },
    injured: { label: "Injured", penalty: -2 },
    maimed: { label: "Maimed", penalty: -3 },
    dead: { label: "Dead", penalty: -999 }
  },
  treasonFlags: {
    0: { label: "Loyal", symbolThreshold: 6 },
    1: { label: "Greylisted", symbolThreshold: 5 },
    2: { label: "Restricted", symbolThreshold: 4 },
    3: { label: "Citizen-of-Interest", symbolThreshold: 3 },
    4: { label: "Wanted", symbolThreshold: 2 }
  },
  clearanceLevels: {
    IR: "Infrared",
    R: "Red",
    O: "Orange",
    Y: "Yellow",
    G: "Green",
    B: "Blue",
    I: "Indigo",
    V: "Violet",
    U: "Ultraviolet"
  },
  serviceGroups: {
    armedForces: "Armed Forces",
    cpu: "CPU",
    hpdmc: "HPD&MC",
    intsec: "IntSec",
    plc: "PLC",
    power: "Power Services",
    rnd: "R&D",
    tech: "Technical Services"
  },
  equipmentCategories: {
    weapon: "Weapon",
    armor: "Armor",
    gear: "Gear",
    coretech: "Coretech"
  }
};
