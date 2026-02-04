/**
 * Item sheet class for Paranoia VTT.
 * Handles the UI for Equipment, Mutant Powers, Secret Societies, and Coretech items.
 * @extends {ItemSheet}
 */

import { PARANOIA_CONFIG } from "../helpers/config.mjs";

export class ParanoiaItemSheet extends ItemSheet {
  /**
   * Default options for this sheet.
   * @returns {Object}
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["paranoia-vtt", "sheet", "item"],
      width: 520,
      height: 480
    });
  }

  /**
   * Get the template path based on item type.
   * Each item type has its own template.
   * @returns {string}
   */
  get template() {
    return `systems/paranoia-vtt/templates/item/${this.item.type}-sheet.hbs`;
  }

  /**
   * Prepare data for rendering the sheet.
   * @param {Object} options - Render options.
   * @returns {Promise<Object>} Data for the template.
   */
  async getData(options) {
    const data = await super.getData(options);

    // Add config for dropdowns
    data.config = PARANOIA_CONFIG;
    data.clearanceLevels = PARANOIA_CONFIG.clearanceLevels;
    data.equipmentCategories = PARANOIA_CONFIG.equipmentCategories;

    // Add item type flags
    data.isEquipment = this.item.type === "equipment";
    data.isMutantPower = this.item.type === "mutantPower";
    data.isSecretSociety = this.item.type === "secretSociety";
    data.isCoretech = this.item.type === "coretech";

    return data;
  }

  /**
   * Activate event listeners for the sheet.
   * @param {jQuery} html - The rendered HTML.
   */
  activateListeners(html) {
    super.activateListeners(html);

    // Post to chat button
    html.find(".item-post-chat").on("click", (event) => {
      event.preventDefault();
      if (this.item.toChat) this.item.toChat();
    });
  }
}
