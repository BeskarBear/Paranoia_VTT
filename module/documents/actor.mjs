/**
 * Extended Actor document class for Paranoia VTT.
 * Handles Troubleshooter and NPC actors with skill calculations
 * and the NODE dice rolling system.
 * @extends {Actor}
 */

import { PARANOIA_CONFIG } from "../helpers/config.mjs";
import { rollParanoiaTest } from "../helpers/rolls.mjs";

export class ParanoiaActor extends Actor {
  /**
   * Prepare derived data for this actor.
   * Calculates wound penalties, treason flags, and NODE values for all skills.
   * Note: When using DataModels (Foundry V10+), this is handled by the model's prepareDerivedData.
   * This method provides fallback support for older versions or non-dataModel scenarios.
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    // If using DataModels, derived data is already prepared
    // This is a fallback for backwards compatibility
    if (this.system.derived?.skillNodes) return;

    const system = this.system;
    const woundKey = system.wounds?.level ?? "fine";
    const woundData = PARANOIA_CONFIG.woundLevels[woundKey] ?? PARANOIA_CONFIG.woundLevels.fine;
    const treasonStars = Number(system.resources?.treasonStars?.value ?? 0);
    const maxStars = PARANOIA_CONFIG.defaults?.TREASON_STARS_MAX ?? 4;
    const flagData = PARANOIA_CONFIG.treasonFlags[Math.min(Math.max(treasonStars, 0), maxStars)] ?? PARANOIA_CONFIG.treasonFlags[0];

    system.derived = system.derived || {};
    system.derived.woundPenalty = woundData.penalty;
    system.derived.woundLabel = woundData.label;
    system.derived.flagLabel = flagData.label;
    system.derived.symbolThreshold = flagData.symbolThreshold;

    const skillNodes = {};
    for (const [skillKey, skillData] of Object.entries(PARANOIA_CONFIG.skills)) {
      const statKey = skillData.stat;
      const statVal = Number(system.stats?.[statKey]?.value ?? 0);
      const skillVal = Number(system.skills?.[skillKey]?.value ?? 0);
      const base = statVal + skillVal + system.derived.woundPenalty;
      skillNodes[skillKey] = base;
    }
    system.derived.skillNodes = skillNodes;

    // Pre-organize skills by stat for template rendering optimization
    const skillsByStat = {};
    for (const [skillKey, skillData] of Object.entries(PARANOIA_CONFIG.skills)) {
      const statKey = skillData.stat;
      skillsByStat[statKey] = skillsByStat[statKey] || [];
      skillsByStat[statKey].push({
        key: skillKey,
        label: skillData.label,
        statKey,
        value: Number(system.skills?.[skillKey]?.value ?? 0),
        node: skillNodes[skillKey]
      });
    }
    system.derived.skillsByStat = skillsByStat;
  }

  /**
   * Check if this actor is dead (cannot perform actions).
   * @returns {boolean} True if the actor is dead.
   */
  get isDead() {
    const deadPenalty = PARANOIA_CONFIG.defaults?.WOUND_DEAD_PENALTY ?? -999;
    return (this.system.derived?.woundPenalty ?? 0) <= deadPenalty;
  }

  /**
   * Get the current wound level label.
   * @returns {string} The wound level label.
   */
  get woundLabel() {
    return this.system.derived?.woundLabel ?? "Fine";
  }

  /**
   * Get the current treason flag label.
   * @returns {string} The treason flag label.
   */
  get treasonLabel() {
    return this.system.derived?.flagLabel ?? "Loyal";
  }

  /**
   * Roll a skill test using the Paranoia NODE system.
   * @param {Object} options - Roll configuration.
   * @param {string} options.statKey - The stat key (brains, violence, etc.).
   * @param {string} options.skillKey - The skill key (guns, stealth, etc.).
   * @param {number} [options.difficulty=2] - Target number of successes.
   * @param {number} [options.equipmentBonus=0] - Equipment level bonus.
   * @param {number} [options.modifier=0] - Situational modifier.
   * @param {string} [options.title] - Custom roll title.
   * @returns {Promise<ChatMessage|null>} The created chat message or null if the actor is dead.
   */
  async rollSkill({ statKey, skillKey, difficulty = 2, equipmentBonus = 0, modifier = 0, title = null }) {
    // Check if actor is dead
    if (this.isDead) {
      ui.notifications.warn(game.i18n.format("PARANOIA.Errors.ActorDead", { name: this.name }));
      return null;
    }

    // Validate inputs
    if (!PARANOIA_CONFIG.stats[statKey]) {
      console.warn(`Paranoia VTT | Invalid stat key: ${statKey}`);
      return null;
    }
    if (!PARANOIA_CONFIG.skills[skillKey]) {
      console.warn(`Paranoia VTT | Invalid skill key: ${skillKey}`);
      return null;
    }

    const system = this.system;
    const woundPenalty = system.derived?.woundPenalty ?? 0;
    const statVal = Number(system.stats?.[statKey]?.value ?? 0);
    const skillVal = Number(system.skills?.[skillKey]?.value ?? 0);
    const base = statVal + skillVal + woundPenalty + Number(equipmentBonus) + Number(modifier);

    const labelStat = PARANOIA_CONFIG.stats[statKey] ?? statKey;
    const labelSkill = PARANOIA_CONFIG.skills[skillKey]?.label ?? skillKey;
    const rollTitle = title ?? `${labelStat} + ${labelSkill}`;

    return rollParanoiaTest({
      actor: this,
      title: rollTitle,
      base,
      difficulty: Number(difficulty),
      symbolThreshold: system.derived?.symbolThreshold ?? 6
    });
  }

  /**
   * Roll a custom skill test with configurable parameters.
   * Wrapper around rollSkill for dialog-based rolls.
   * @param {Object} options - Roll configuration (same as rollSkill).
   * @returns {Promise<ChatMessage|null>} The created chat message.
   */
  async rollCustom(options) {
    return this.rollSkill(options);
  }

  /**
   * Get the NODE value for a specific skill.
   * @param {string} skillKey - The skill key.
   * @returns {number} The calculated NODE value.
   */
  getSkillNode(skillKey) {
    return this.system.derived?.skillNodes?.[skillKey] ?? 0;
  }

  /**
   * Get all items of a specific type owned by this actor.
   * @param {string} type - The item type (equipment, mutantPower, etc.).
   * @returns {Item[]} Array of items of the specified type.
   */
  getItemsByType(type) {
    return this.items.filter(item => item.type === type);
  }

  /**
   * Get total equipment bonus from all equipped items.
   * @returns {number} The total equipment bonus.
   */
  getTotalEquipmentBonus() {
    return this.getItemsByType("equipment")
      .reduce((total, item) => total + (item.system.level ?? 0), 0);
  }
}
