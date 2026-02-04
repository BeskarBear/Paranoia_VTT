/**
 * Actor sheet class for Paranoia VTT.
 * Handles the character sheet UI for Troubleshooters and NPCs.
 * @extends {ActorSheet}
 */

import { PARANOIA_CONFIG } from "../helpers/config.mjs";

export class ParanoiaActorSheet extends ActorSheet {
  /**
   * Default options for this sheet.
   * @returns {Object}
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["paranoia-vtt", "sheet", "actor"],
      width: 880,
      height: 760,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }],
      dragDrop: [{ dragSelector: ".item-row", dropSelector: null }]
    });
  }

  /**
   * Get the template path for this sheet.
   * @returns {string}
   */
  get template() {
    return "systems/paranoia-vtt/templates/actor/actor-sheet.hbs";
  }

  /**
   * Prepare data for rendering the sheet.
   * Uses cached derived data when available for performance.
   * @param {Object} options - Render options.
   * @returns {Promise<Object>} Data for the template.
   */
  async getData(options) {
    const data = await super.getData(options);
    const system = data.system;
    data.isNPC = data.actor?.type === "npc";

    // Use cached stats data
    const stats = Object.entries(PARANOIA_CONFIG.stats).map(([key, label]) => ({
      key,
      label,
      value: Number(system.stats?.[key]?.value ?? 0)
    }));

    // Use pre-computed skillsByStat from derived data if available
    // This is computed in prepareDerivedData() for performance
    let skillsByStat = system.derived?.skillsByStat;
    if (!skillsByStat) {
      // Fallback: compute it here if not cached
      skillsByStat = {};
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
    }

    // Pass data to template
    data.config = PARANOIA_CONFIG;
    data.stats = stats;
    data.skillsByStat = skillsByStat;
    data.clearanceLevels = PARANOIA_CONFIG.clearanceLevels;
    data.serviceGroups = PARANOIA_CONFIG.serviceGroups;
    data.woundLevels = PARANOIA_CONFIG.woundLevels;
    data.treasonFlags = PARANOIA_CONFIG.treasonFlags;

    // Organize items by type
    data.itemsByType = {
      equipment: data.items.filter((item) => item.type === "equipment"),
      mutantPower: data.items.filter((item) => item.type === "mutantPower"),
      secretSociety: data.items.filter((item) => item.type === "secretSociety"),
      coretech: data.items.filter((item) => item.type === "coretech")
    };

    return data;
  }

  /**
   * Activate event listeners for the sheet.
   * @param {jQuery} html - The rendered HTML.
   */
  activateListeners(html) {
    super.activateListeners(html);

    // Skill roll buttons
    html.find(".roll-skill").on("click", this._onRollSkill.bind(this));

    // Custom roll button
    html.find(".roll-custom").on("click", this._onCustomRoll.bind(this));

    // Item management buttons
    html.find(".item-edit").on("click", this._onItemEdit.bind(this));
    html.find(".item-delete").on("click", this._onItemDelete.bind(this));
    html.find(".item-create").on("click", this._onItemCreate.bind(this));

    // Item chat button
    html.find(".item-chat").on("click", this._onItemChat.bind(this));

    // Item name click to open sheet
    html.find(".item-name").on("click", this._onItemEdit.bind(this));

    // Setup context menu for items
    this._setupContextMenu(html);
  }

  /**
   * Setup right-click context menu for item rows.
   * @param {jQuery} html - The rendered HTML.
   * @private
   */
  _setupContextMenu(html) {
    new ContextMenu(html, ".item-row", this._getItemContextOptions());
  }

  /**
   * Get context menu options for item rows.
   * @returns {Object[]} Array of context menu options.
   * @private
   */
  _getItemContextOptions() {
    return [
      {
        name: game.i18n.localize("PARANOIA.UI.Edit"),
        icon: '<i class="fas fa-edit"></i>',
        callback: (li) => {
          const itemId = li.data("item-id");
          const item = this.actor.items.get(itemId);
          if (item) item.sheet.render(true);
        }
      },
      {
        name: game.i18n.localize("PARANOIA.UI.PostToChat"),
        icon: '<i class="fas fa-comment"></i>',
        callback: (li) => {
          const itemId = li.data("item-id");
          const item = this.actor.items.get(itemId);
          if (item?.toChat) item.toChat();
        }
      },
      {
        name: game.i18n.localize("PARANOIA.UI.Delete"),
        icon: '<i class="fas fa-trash"></i>',
        callback: (li) => {
          const itemId = li.data("item-id");
          if (itemId) this.actor.deleteEmbeddedDocuments("Item", [itemId]);
        }
      }
    ];
  }

  /**
   * Handle skill roll button click.
   * @param {Event} event - The click event.
   * @private
   */
  _onRollSkill(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const statKey = button.dataset.stat;
    const skillKey = button.dataset.skill;
    const difficulty = Number(button.dataset.difficulty ?? PARANOIA_CONFIG.defaults.DEFAULT_DIFFICULTY);
    this.actor.rollSkill({ statKey, skillKey, difficulty });
  }

  /**
   * Handle custom roll button click.
   * @param {Event} event - The click event.
   * @private
   */
  _onCustomRoll(event) {
    event.preventDefault();
    this._showCustomRollDialog();
  }

  /**
   * Handle item edit button click.
   * @param {Event} event - The click event.
   * @private
   */
  _onItemEdit(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset?.itemId;
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  /**
   * Handle item delete button click.
   * @param {Event} event - The click event.
   * @private
   */
  async _onItemDelete(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset?.itemId;
    if (!itemId) return;

    // Confirm deletion
    const item = this.actor.items.get(itemId);
    if (!item) return;

    const confirmed = await Dialog.confirm({
      title: game.i18n.localize("PARANOIA.UI.DeleteItem"),
      content: `<p>${game.i18n.format("PARANOIA.UI.DeleteConfirm", { name: item.name })}</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false
    });

    if (confirmed) {
      await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    }
  }

  /**
   * Handle item create button click.
   * @param {Event} event - The click event.
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type || "equipment";
    const name = game.i18n.format("PARANOIA.UI.NewItem", { type: type });
    await this.actor.createEmbeddedDocuments("Item", [{ name, type }]);
  }

  /**
   * Handle item chat button click.
   * @param {Event} event - The click event.
   * @private
   */
  _onItemChat(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset?.itemId;
    const item = this.actor.items.get(itemId);
    if (item?.toChat) item.toChat();
  }

  /**
   * Handle dropping an item onto the sheet.
   * @param {DragEvent} event - The drop event.
   * @param {Object} data - The drop data.
   * @returns {Promise<Item[]|boolean>}
   * @override
   */
  async _onDropItem(event, data) {
    if (!this.isEditable) return false;

    const item = await Item.implementation.fromDropData(data);
    if (!item) return false;

    // Check if the item type is valid for this actor
    const validTypes = ["equipment", "mutantPower", "secretSociety", "coretech"];
    if (!validTypes.includes(item.type)) {
      ui.notifications.warn(game.i18n.localize("PARANOIA.Errors.InvalidItemType"));
      return false;
    }

    // If dropping from a compendium, create a copy
    if (data.pack) {
      return this.actor.createEmbeddedDocuments("Item", [item.toObject()]);
    }

    // If dropping from the same actor, do nothing
    if (item.parent?.id === this.actor.id) {
      return false;
    }

    // If dropping from another actor, create a copy
    if (item.parent) {
      return this.actor.createEmbeddedDocuments("Item", [item.toObject()]);
    }

    // Default behavior
    return super._onDropItem(event, data);
  }

  /**
   * Show the custom roll dialog.
   * @private
   */
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
          <label>${game.i18n.localize("PARANOIA.UI.Stat")}</label>
          <select name="stat">${statOptions}</select>
        </div>
        <div class="form-group">
          <label>${game.i18n.localize("PARANOIA.UI.Skill")}</label>
          <select name="skill">${skillOptions}</select>
        </div>
        <div class="form-group">
          <label>${game.i18n.localize("PARANOIA.UI.Difficulty")}</label>
          <input type="number" name="difficulty" value="${PARANOIA_CONFIG.defaults.DEFAULT_DIFFICULTY}" min="1" max="10" />
        </div>
        <div class="form-group">
          <label>${game.i18n.localize("PARANOIA.UI.EquipmentBonus")}</label>
          <input type="number" name="equipmentBonus" value="0" />
        </div>
        <div class="form-group">
          <label>${game.i18n.localize("PARANOIA.UI.Modifier")}</label>
          <input type="number" name="modifier" value="0" />
        </div>
      </form>
    `;

    return new Dialog({
      title: game.i18n.localize("PARANOIA.UI.CustomRoll"),
      content,
      buttons: {
        roll: {
          icon: '<i class="fas fa-dice"></i>',
          label: game.i18n.localize("PARANOIA.UI.Roll"),
          callback: (html) => {
            const form = html.find("form")[0];
            const formData = new FormData(form);
            const statKey = formData.get("stat");
            const skillKey = formData.get("skill");
            const difficulty = Number(formData.get("difficulty") || PARANOIA_CONFIG.defaults.DEFAULT_DIFFICULTY);
            const equipmentBonus = Number(formData.get("equipmentBonus") || 0);
            const modifier = Number(formData.get("modifier") || 0);
            this.actor.rollCustom({ statKey, skillKey, difficulty, equipmentBonus, modifier });
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("PARANOIA.UI.Cancel")
        }
      },
      default: "roll"
    }).render(true);
  }
}
