/**
 * Extended Item document class for Paranoia VTT.
 * Handles equipment, mutant powers, secret societies, and coretech items.
 * @extends {Item}
 */

import { PARANOIA_CONFIG } from "../helpers/config.mjs";

export class ParanoiaItem extends Item {
  /**
   * Get the equipment bonus for skill rolls.
   * Only applies to equipment and coretech items.
   * @returns {number} The item level as a bonus, or 0 for non-applicable items.
   */
  get equipmentBonus() {
    if (this.type === "equipment" || this.type === "coretech") {
      return this.system.level ?? 0;
    }
    return 0;
  }

  /**
   * Check if this item is a weapon.
   * @returns {boolean} True if this is a weapon.
   */
  get isWeapon() {
    return this.type === "equipment" && this.system.category === "weapon";
  }

  /**
   * Check if this item is armor.
   * @returns {boolean} True if this is armor.
   */
  get isArmor() {
    return this.type === "equipment" && this.system.category === "armor";
  }

  /**
   * Get the clearance level label for equipment items.
   * @returns {string|null} The clearance label or null if not applicable.
   */
  get clearanceLabel() {
    if (this.type !== "equipment") return null;
    return PARANOIA_CONFIG.clearanceLevels[this.system.clearance] ?? this.system.clearance;
  }

  /**
   * Get the category label for equipment items.
   * @returns {string|null} The category label or null if not applicable.
   */
  get categoryLabel() {
    if (this.type !== "equipment") return null;
    return PARANOIA_CONFIG.equipmentCategories[this.system.category] ?? this.system.category;
  }

  /**
   * Get a summary string for this item.
   * @returns {string} A short summary of the item.
   */
  get summary() {
    switch (this.type) {
      case "equipment":
        return `Lvl ${this.system.level ?? 0} ${this.categoryLabel ?? "Gear"}`;
      case "mutantPower":
        return this.system.purpose ?? "";
      case "secretSociety":
        return this.system.modifiers?.plus ? `+${this.system.modifiers.plus}` : "";
      case "coretech":
        return `Lvl ${this.system.level ?? 0}`;
      default:
        return "";
    }
  }

  /**
   * Post this item's details to the chat.
   * Creates a chat card with the item's information.
   * @param {Object} [options={}] - Chat message options.
   * @returns {Promise<ChatMessage>} The created chat message.
   */
  async toChat(options = {}) {
    const templateData = {
      item: this,
      system: this.system,
      name: this.name,
      type: this.type,
      img: this.img,
      isEquipment: this.type === "equipment",
      isMutantPower: this.type === "mutantPower",
      isSecretSociety: this.type === "secretSociety",
      isCoretech: this.type === "coretech",
      clearanceLabel: this.clearanceLabel,
      categoryLabel: this.categoryLabel,
      config: PARANOIA_CONFIG
    };

    const content = await renderTemplate(
      "systems/paranoia-vtt/templates/chat/item-card.hbs",
      templateData
    );

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content,
      ...options
    };

    return ChatMessage.create(chatData);
  }

  /**
   * Handle the item being dropped on a target.
   * Prepares the drag data for transfer.
   * @override
   */
  toDragData() {
    const dragData = super.toDragData();

    // Add additional metadata for the drop handler
    dragData.paranoiaType = this.type;
    if (this.actor) {
      dragData.actorId = this.actor.id;
    }

    return dragData;
  }

  /**
   * Prepare derived data for this item.
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    // Add any item-specific derived data here
    // For secret societies, we could validate skill modifiers
    if (this.type === "secretSociety") {
      const plus = this.system.modifiers?.plus?.toLowerCase();
      const minus = this.system.modifiers?.minus?.toLowerCase();

      this.system.derived = this.system.derived || {};
      this.system.derived.validPlusSkill = plus && PARANOIA_CONFIG.skills[plus];
      this.system.derived.validMinusSkill = minus && PARANOIA_CONFIG.skills[minus];
    }
  }

  /**
   * Get the chat template path for this item type.
   * @returns {string} The template path.
   */
  get chatTemplate() {
    return "systems/paranoia-vtt/templates/chat/item-card.hbs";
  }
}
