import { PARANOIA_CONFIG } from "../helpers/config.mjs";
import { rollParanoiaTest } from "../helpers/rolls.mjs";

export class ParanoiaActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();

    const system = this.system;
    const woundKey = system.wounds?.level ?? "fine";
    const woundData = PARANOIA_CONFIG.woundLevels[woundKey] ?? PARANOIA_CONFIG.woundLevels.fine;
    const treasonStars = Number(system.resources?.treasonStars?.value ?? 0);
    const flagData = PARANOIA_CONFIG.treasonFlags[Math.min(Math.max(treasonStars, 0), 4)] ?? PARANOIA_CONFIG.treasonFlags[0];

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
  }

  async rollSkill({ statKey, skillKey, difficulty = 2, equipmentBonus = 0, modifier = 0, title = null }) {
    const system = this.system;
    const woundPenalty = system.derived?.woundPenalty ?? 0;
    if (woundPenalty <= -999) {
      ui.notifications.warn(`${this.name} is Dead and cannot roll.`);
      return null;
    }

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

  async rollCustom({ statKey, skillKey, difficulty = 2, equipmentBonus = 0, modifier = 0, title = null }) {
    return this.rollSkill({ statKey, skillKey, difficulty, equipmentBonus, modifier, title });
  }
}
