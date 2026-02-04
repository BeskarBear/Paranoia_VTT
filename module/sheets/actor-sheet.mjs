import { PARANOIA_CONFIG } from "../helpers/config.mjs";

export class ParanoiaActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["paranoia-vtt", "sheet", "actor"],
      width: 880,
      height: 760,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  get template() {
    return "systems/paranoia-vtt/templates/actor/actor-sheet.hbs";
  }

  async getData(options) {
    const data = await super.getData(options);
    const system = data.system;
    data.isNPC = data.actor?.type === "npc";

    const stats = Object.entries(PARANOIA_CONFIG.stats).map(([key, label]) => ({
      key,
      label,
      value: Number(system.stats?.[key]?.value ?? 0)
    }));

    const skillsByStat = {};
    for (const [skillKey, skillData] of Object.entries(PARANOIA_CONFIG.skills)) {
      const statKey = skillData.stat;
      skillsByStat[statKey] = skillsByStat[statKey] || [];
      skillsByStat[statKey].push({
        key: skillKey,
        label: skillData.label,
        statKey,
        value: Number(system.skills?.[skillKey]?.value ?? 0),
        node: Number(system.derived?.skillNodes?.[skillKey] ?? 0)
      });
    }

    data.config = PARANOIA_CONFIG;
    data.stats = stats;
    data.skillsByStat = skillsByStat;
    data.clearanceLevels = PARANOIA_CONFIG.clearanceLevels;
    data.serviceGroups = PARANOIA_CONFIG.serviceGroups;
    data.woundLevels = PARANOIA_CONFIG.woundLevels;
    data.treasonFlags = PARANOIA_CONFIG.treasonFlags;

    data.itemsByType = {
      equipment: data.items.filter((item) => item.type === "equipment"),
      mutantPower: data.items.filter((item) => item.type === "mutantPower"),
      secretSociety: data.items.filter((item) => item.type === "secretSociety"),
      coretech: data.items.filter((item) => item.type === "coretech")
    };

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".roll-skill").on("click", (event) => {
      event.preventDefault();
      const button = event.currentTarget;
      const statKey = button.dataset.stat;
      const skillKey = button.dataset.skill;
      const difficulty = Number(button.dataset.difficulty ?? 2);
      this.actor.rollSkill({ statKey, skillKey, difficulty });
    });

    html.find(".roll-custom").on("click", (event) => {
      event.preventDefault();
      this._showCustomRollDialog();
    });

    html.find(".item-edit").on("click", (event) => {
      event.preventDefault();
      const itemId = event.currentTarget.closest("[data-item-id]")?.dataset?.itemId;
      const item = this.actor.items.get(itemId);
      if (item) item.sheet.render(true);
    });

    html.find(".item-delete").on("click", async (event) => {
      event.preventDefault();
      const itemId = event.currentTarget.closest("[data-item-id]")?.dataset?.itemId;
      if (!itemId) return;
      await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    });

    html.find(".item-create").on("click", async (event) => {
      event.preventDefault();
      const type = event.currentTarget.dataset.type || "equipment";
      const name = `New ${type}`;
      await this.actor.createEmbeddedDocuments("Item", [{ name, type }]);
    });
  }

  async _showCustomRollDialog() {
    const statOptions = Object.entries(PARANOIA_CONFIG.stats)
      .map(([key, label]) => `<option value="${key}">${label}</option>`)
      .join("");

    const skillOptions = Object.entries(PARANOIA_CONFIG.skills)
      .map(([key, data]) => `<option value="${key}">${data.label}</option>`)
      .join("");

    const content = `
      <form class="paranoia-roll-dialog">
        <div class="form-group">
          <label>Stat</label>
          <select name="stat">${statOptions}</select>
        </div>
        <div class="form-group">
          <label>Skill</label>
          <select name="skill">${skillOptions}</select>
        </div>
        <div class="form-group">
          <label>Difficulty</label>
          <input type="number" name="difficulty" value="2" min="1" max="5" />
        </div>
        <div class="form-group">
          <label>Equipment Bonus (Lvl)</label>
          <input type="number" name="equipmentBonus" value="0" />
        </div>
        <div class="form-group">
          <label>Situational Modifier</label>
          <input type="number" name="modifier" value="0" />
        </div>
      </form>
    `;

    return new Dialog({
      title: "Custom Roll",
      content,
      buttons: {
        roll: {
          label: "Roll",
          callback: (html) => {
            const form = html.find("form")[0];
            const formData = new FormData(form);
            const statKey = formData.get("stat");
            const skillKey = formData.get("skill");
            const difficulty = Number(formData.get("difficulty") || 2);
            const equipmentBonus = Number(formData.get("equipmentBonus") || 0);
            const modifier = Number(formData.get("modifier") || 0);
            this.actor.rollCustom({ statKey, skillKey, difficulty, equipmentBonus, modifier });
          }
        }
      },
      default: "roll"
    }).render(true);
  }
}
