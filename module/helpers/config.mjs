/**
 * Core configuration object for the Paranoia VTT system.
 * Contains all game constants, stat definitions, skill mappings, and system defaults.
 * @constant {Object}
 */
export const PARANOIA_CONFIG = {
  /**
   * System defaults and magic numbers centralized for easy modification.
   */
  defaults: {
    MOXIE_MAX: 8,
    MOXIE_DEFAULT: 8,
    XP_DEFAULT: 200,
    CLONE_NUMBER_DEFAULT: 1,
    TREASON_STARS_MIN: 0,
    TREASON_STARS_MAX: 4,
    WOUND_DEAD_PENALTY: -999,
    DEFAULT_DIFFICULTY: 2,
    GUNS_SKILL_DEFAULT: 2
  },

  /**
   * The four core stats in Paranoia.
   */
  stats: {
    brains: "Brains",
    chutzpah: "Chutzpah",
    mechanics: "Mechanics",
    violence: "Violence"
  },

  /**
   * All 16 skills, organized by their parent stat.
   */
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

  /**
   * Wound levels with their associated NODE penalties.
   */
  woundLevels: {
    fine: { label: "Fine", penalty: 0 },
    hurt: { label: "Hurt", penalty: -1 },
    injured: { label: "Injured", penalty: -2 },
    maimed: { label: "Maimed", penalty: -3 },
    dead: { label: "Dead", penalty: -999 }
  },

  /**
   * Treason flag levels with Computer attention thresholds.
   * Higher treason = lower threshold = more likely to trigger Computer attention.
   */
  treasonFlags: {
    0: { label: "Loyal", symbolThreshold: 6 },
    1: { label: "Greylisted", symbolThreshold: 5 },
    2: { label: "Restricted", symbolThreshold: 4 },
    3: { label: "Citizen-of-Interest", symbolThreshold: 3 },
    4: { label: "Wanted", symbolThreshold: 2 }
  },

  /**
   * Security clearance levels from lowest (IR) to highest (U).
   */
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

  /**
   * The eight service groups citizens can belong to.
   */
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

  /**
   * Equipment categories for organization.
   */
  equipmentCategories: {
    weapon: "Weapon",
    armor: "Armor",
    gear: "Gear",
    coretech: "Coretech"
  }
};
