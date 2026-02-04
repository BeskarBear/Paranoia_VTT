import { PARANOIA_CONFIG } from "../helpers/config.mjs";

const fields = foundry.data.fields;

/**
 * Schema field for a single stat (Brains, Violence, etc.).
 * @returns {SchemaField}
 */
function statField() {
  return new fields.SchemaField({
    value: new fields.NumberField({ required: true, initial: 0, integer: true })
  });
}

/**
 * Schema field for a single skill.
 * @returns {SchemaField}
 */
function skillField(initial = 0) {
  return new fields.SchemaField({
    value: new fields.NumberField({ required: true, initial, integer: true })
  });
}

/**
 * Common schema fields shared between Troubleshooter and NPC actors.
 * @returns {Object}
 */
function commonActorFields() {
  const defaults = PARANOIA_CONFIG.defaults;

  return {
    stats: new fields.SchemaField({
      brains: statField(),
      chutzpah: statField(),
      mechanics: statField(),
      violence: statField()
    }),

    skills: new fields.SchemaField({
      alphaComplex: skillField(),
      bureaucracy: skillField(),
      psychology: skillField(),
      science: skillField(),
      bluff: skillField(),
      charm: skillField(),
      intimidate: skillField(),
      stealth: skillField(),
      demolition: skillField(),
      engineer: skillField(),
      operate: skillField(),
      program: skillField(),
      athletics: skillField(),
      guns: skillField(defaults.GUNS_SKILL_DEFAULT),
      melee: skillField(),
      throw: skillField()
    }),

    resources: new fields.SchemaField({
      moxie: new fields.SchemaField({
        value: new fields.NumberField({
          required: true,
          initial: defaults.MOXIE_DEFAULT,
          min: 0,
          max: defaults.MOXIE_MAX,
          integer: true
        }),
        max: new fields.NumberField({
          required: true,
          initial: defaults.MOXIE_MAX,
          min: 1,
          integer: true
        })
      }),
      xp: new fields.SchemaField({
        value: new fields.NumberField({
          required: true,
          initial: defaults.XP_DEFAULT,
          integer: true
        })
      }),
      treasonStars: new fields.SchemaField({
        value: new fields.NumberField({
          required: true,
          initial: 0,
          min: defaults.TREASON_STARS_MIN,
          max: defaults.TREASON_STARS_MAX,
          integer: true
        })
      })
    }),

    wounds: new fields.SchemaField({
      level: new fields.StringField({
        required: true,
        initial: "fine",
        choices: Object.keys(PARANOIA_CONFIG.woundLevels)
      })
    }),

    identity: new fields.SchemaField({
      clearance: new fields.StringField({
        required: true,
        initial: "R",
        choices: Object.keys(PARANOIA_CONFIG.clearanceLevels)
      }),
      cloneName: new fields.StringField({ initial: "" }),
      sector: new fields.StringField({ initial: "" }),
      cloneNumber: new fields.NumberField({
        required: true,
        initial: defaults.CLONE_NUMBER_DEFAULT,
        min: 0,
        integer: true
      }),
      teamName: new fields.StringField({ initial: "" }),
      mbd: new fields.StringField({ initial: "" }),
      serviceGroup: new fields.StringField({ initial: "" })
    }),

    buttons: new fields.SchemaField({
      violence: new fields.StringField({ initial: "" }),
      treason: new fields.StringField({ initial: "" })
    }),

    mission: new fields.SchemaField({
      objective: new fields.StringField({ initial: "" }),
      assignedGear: new fields.StringField({ initial: "" })
    }),

    notes: new fields.SchemaField({
      secretObjective: new fields.StringField({ initial: "" }),
      evidence: new fields.StringField({ initial: "" }),
      favours: new fields.StringField({ initial: "" }),
      other: new fields.StringField({ initial: "" })
    })
  };
}

/**
 * Data model for Troubleshooter (player character) actors.
 * @extends {foundry.abstract.TypeDataModel}
 */
export class TroubleshooterData extends foundry.abstract.TypeDataModel {
  /**
   * Define the schema for Troubleshooter actors.
   * @returns {Object}
   */
  static defineSchema() {
    return commonActorFields();
  }

  /**
   * Prepare derived data for this actor.
   * Calculates wound penalties, treason flags, and NODE values.
   */
  prepareDerivedData() {
    const woundKey = this.wounds?.level ?? "fine";
    const woundData = PARANOIA_CONFIG.woundLevels[woundKey] ?? PARANOIA_CONFIG.woundLevels.fine;
    const treasonStars = Number(this.resources?.treasonStars?.value ?? 0);
    const clampedStars = Math.min(Math.max(treasonStars, 0), PARANOIA_CONFIG.defaults.TREASON_STARS_MAX);
    const flagData = PARANOIA_CONFIG.treasonFlags[clampedStars] ?? PARANOIA_CONFIG.treasonFlags[0];

    this.derived = this.derived || {};
    this.derived.woundPenalty = woundData.penalty;
    this.derived.woundLabel = woundData.label;
    this.derived.flagLabel = flagData.label;
    this.derived.symbolThreshold = flagData.symbolThreshold;

    // Calculate NODE values for all skills
    const skillNodes = {};
    for (const [skillKey, skillData] of Object.entries(PARANOIA_CONFIG.skills)) {
      const statKey = skillData.stat;
      const statVal = Number(this.stats?.[statKey]?.value ?? 0);
      const skillVal = Number(this.skills?.[skillKey]?.value ?? 0);
      const base = statVal + skillVal + this.derived.woundPenalty;
      skillNodes[skillKey] = base;
    }
    this.derived.skillNodes = skillNodes;

    // Pre-organize skills by stat for template rendering optimization
    const skillsByStat = {};
    for (const [skillKey, skillData] of Object.entries(PARANOIA_CONFIG.skills)) {
      const statKey = skillData.stat;
      skillsByStat[statKey] = skillsByStat[statKey] || [];
      skillsByStat[statKey].push({
        key: skillKey,
        label: skillData.label,
        statKey,
        value: Number(this.skills?.[skillKey]?.value ?? 0),
        node: skillNodes[skillKey]
      });
    }
    this.derived.skillsByStat = skillsByStat;
  }
}

/**
 * Data model for NPC actors.
 * Extends Troubleshooter with additional NPC-specific fields.
 * @extends {foundry.abstract.TypeDataModel}
 */
export class NPCData extends foundry.abstract.TypeDataModel {
  /**
   * Define the schema for NPC actors.
   * Includes all Troubleshooter fields plus NPC-specific data.
   * @returns {Object}
   */
  static defineSchema() {
    const defaults = PARANOIA_CONFIG.defaults;

    return {
      ...commonActorFields(),

      // Override resources with NPC defaults (0 moxie, 0 xp)
      resources: new fields.SchemaField({
        moxie: new fields.SchemaField({
          value: new fields.NumberField({
            required: true,
            initial: 0,
            min: 0,
            max: defaults.MOXIE_MAX,
            integer: true
          }),
          max: new fields.NumberField({
            required: true,
            initial: defaults.MOXIE_MAX,
            min: 1,
            integer: true
          })
        }),
        xp: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        treasonStars: new fields.SchemaField({
          value: new fields.NumberField({
            required: true,
            initial: 0,
            min: defaults.TREASON_STARS_MIN,
            max: defaults.TREASON_STARS_MAX,
            integer: true
          })
        })
      }),

      // Override identity with NPC clone number default (0)
      identity: new fields.SchemaField({
        clearance: new fields.StringField({
          required: true,
          initial: "R",
          choices: Object.keys(PARANOIA_CONFIG.clearanceLevels)
        }),
        cloneName: new fields.StringField({ initial: "" }),
        sector: new fields.StringField({ initial: "" }),
        cloneNumber: new fields.NumberField({
          required: true,
          initial: 0,
          min: 0,
          integer: true
        }),
        teamName: new fields.StringField({ initial: "" }),
        mbd: new fields.StringField({ initial: "" }),
        serviceGroup: new fields.StringField({ initial: "" })
      }),

      // NPC-specific fields
      npc: new fields.SchemaField({
        quote: new fields.StringField({ initial: "" }),
        basics: new fields.SchemaField({
          serviceGroup: new fields.StringField({ initial: "" }),
          secretSociety: new fields.StringField({ initial: "" }),
          mutantPower: new fields.StringField({ initial: "" })
        }),
        looks: new fields.StringField({ initial: "" }),
        quirks: new fields.StringField({ initial: "" }),
        plans: new fields.StringField({ initial: "" }),
        gear: new fields.StringField({ initial: "" })
      })
    };
  }

  /**
   * Prepare derived data for this NPC.
   * Uses same calculations as Troubleshooter.
   */
  prepareDerivedData() {
    // Reuse the same derived data logic as Troubleshooter
    TroubleshooterData.prototype.prepareDerivedData.call(this);
  }
}
