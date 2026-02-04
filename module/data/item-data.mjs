import { PARANOIA_CONFIG } from "../helpers/config.mjs";

const fields = foundry.data.fields;

/**
 * Data model for Equipment items (weapons, armor, gear).
 * @extends {foundry.abstract.TypeDataModel}
 */
export class EquipmentData extends foundry.abstract.TypeDataModel {
  /**
   * Define the schema for Equipment items.
   * @returns {Object}
   */
  static defineSchema() {
    return {
      level: new fields.NumberField({
        required: true,
        initial: 0,
        min: 0,
        integer: true
      }),
      clearance: new fields.StringField({
        required: true,
        initial: "R"
      }),
      category: new fields.StringField({
        required: true,
        initial: "gear",
        choices: Object.keys(PARANOIA_CONFIG.equipmentCategories)
      }),
      successEffect: new fields.StringField({ initial: "" }),
      treasonEffect: new fields.StringField({ initial: "" }),
      notes: new fields.StringField({ initial: "" })
    };
  }

  /**
   * Get the equipment bonus for skill rolls.
   * @returns {number} The equipment level as a bonus.
   */
  get equipmentBonus() {
    return this.level ?? 0;
  }

  /**
   * Check if this equipment is a weapon.
   * @returns {boolean}
   */
  get isWeapon() {
    return this.category === "weapon";
  }

  /**
   * Check if this equipment is armor.
   * @returns {boolean}
   */
  get isArmor() {
    return this.category === "armor";
  }

  /**
   * Get the clearance level label.
   * @returns {string}
   */
  get clearanceLabel() {
    return PARANOIA_CONFIG.clearanceLevels[this.clearance] ?? this.clearance;
  }

  /**
   * Get the category label.
   * @returns {string}
   */
  get categoryLabel() {
    return PARANOIA_CONFIG.equipmentCategories[this.category] ?? this.category;
  }
}

/**
 * Data model for Mutant Power items.
 * @extends {foundry.abstract.TypeDataModel}
 */
export class MutantPowerData extends foundry.abstract.TypeDataModel {
  /**
   * Define the schema for Mutant Power items.
   * @returns {Object}
   */
  static defineSchema() {
    return {
      purpose: new fields.StringField({ initial: "" }),
      warning: new fields.StringField({ initial: "" }),
      notes: new fields.StringField({ initial: "" })
    };
  }

  /**
   * Check if this power has a warning.
   * @returns {boolean}
   */
  get hasWarning() {
    return Boolean(this.warning?.trim());
  }
}

/**
 * Data model for Secret Society items.
 * @extends {foundry.abstract.TypeDataModel}
 */
export class SecretSocietyData extends foundry.abstract.TypeDataModel {
  /**
   * Define the schema for Secret Society items.
   * @returns {Object}
   */
  static defineSchema() {
    return {
      purpose: new fields.StringField({ initial: "" }),
      modifiers: new fields.SchemaField({
        plus: new fields.StringField({ initial: "" }),
        minus: new fields.StringField({ initial: "" })
      }),
      notes: new fields.StringField({ initial: "" })
    };
  }

  /**
   * Get the skill that receives a bonus from this society.
   * @returns {string|null}
   */
  get bonusSkill() {
    const skillKey = this.modifiers?.plus?.toLowerCase();
    return PARANOIA_CONFIG.skills[skillKey] ? skillKey : null;
  }

  /**
   * Get the skill that receives a penalty from this society.
   * @returns {string|null}
   */
  get penaltySkill() {
    const skillKey = this.modifiers?.minus?.toLowerCase();
    return PARANOIA_CONFIG.skills[skillKey] ? skillKey : null;
  }

  /**
   * Get a formatted modifier string for display.
   * @returns {string}
   */
  get modifierSummary() {
    const parts = [];
    if (this.modifiers?.plus) parts.push(`+${this.modifiers.plus}`);
    if (this.modifiers?.minus) parts.push(`-${this.modifiers.minus}`);
    return parts.join(", ");
  }
}

/**
 * Data model for Coretech & Apps items.
 * @extends {foundry.abstract.TypeDataModel}
 */
export class CoretechData extends foundry.abstract.TypeDataModel {
  /**
   * Define the schema for Coretech items.
   * @returns {Object}
   */
  static defineSchema() {
    return {
      level: new fields.NumberField({
        required: true,
        initial: 0,
        min: 0,
        integer: true
      }),
      app: new fields.StringField({ initial: "" }),
      notes: new fields.StringField({ initial: "" })
    };
  }

  /**
   * Get the equipment bonus for skill rolls.
   * @returns {number} The coretech level as a bonus.
   */
  get equipmentBonus() {
    return this.level ?? 0;
  }
}
