/**
 * Paranoia VTT - A Foundry VTT system for the Paranoia RPG.
 * @module paranoia-vtt
 */

// Document Classes
import { ParanoiaActor } from "./documents/actor.mjs";
import { ParanoiaItem } from "./documents/item.mjs";

// Sheet Classes
import { ParanoiaActorSheet } from "./sheets/actor-sheet.mjs";
import { ParanoiaItemSheet } from "./sheets/item-sheet.mjs";

// Data Models
import { TroubleshooterData, NPCData } from "./data/actor-data.mjs";
import { EquipmentData, MutantPowerData, SecretSocietyData, CoretechData } from "./data/item-data.mjs";

// Helpers
import { PARANOIA_CONFIG } from "./helpers/config.mjs";
import { seedCompendiums } from "./helpers/seed-compendiums.mjs";
import { registerSocketListeners } from "./helpers/socket.mjs";

/**
 * Initialize the Paranoia VTT system.
 * Registers document classes, sheets, data models, and helpers.
 */
Hooks.once("init", async function() {
  console.log("Paranoia VTT | Initializing system");

  // Store config globally
  game.paranoia = {
    config: PARANOIA_CONFIG,
    ParanoiaActor,
    ParanoiaItem
  };
  CONFIG.PARANOIA = PARANOIA_CONFIG;

  // Register Document Classes
  CONFIG.Actor.documentClass = ParanoiaActor;
  CONFIG.Item.documentClass = ParanoiaItem;

  // Register Data Models (Foundry V10+)
  CONFIG.Actor.dataModels = {
    troubleshooter: TroubleshooterData,
    npc: NPCData
  };
  CONFIG.Item.dataModels = {
    equipment: EquipmentData,
    mutantPower: MutantPowerData,
    secretSociety: SecretSocietyData,
    coretech: CoretechData
  };

  // Register Actor Sheets
  Actors.registerSheet("paranoia-vtt", ParanoiaActorSheet, {
    types: ["troubleshooter", "npc"],
    makeDefault: true,
    label: "PARANOIA.Sheets.Actor"
  });

  // Register Item Sheets
  Items.registerSheet("paranoia-vtt", ParanoiaItemSheet, {
    types: ["equipment", "mutantPower", "secretSociety", "coretech"],
    makeDefault: true,
    label: "PARANOIA.Sheets.Item"
  });

  // Register Handlebars Helpers
  registerHandlebarsHelpers();

  // Preload templates
  return preloadHandlebarsTemplates();
});

/**
 * System ready hook.
 * Seeds compendiums and registers socket listeners.
 */
Hooks.once("ready", async function() {
  // Register socket event listeners
  registerSocketListeners();

  // Seed compendiums with default data
  try {
    await seedCompendiums();
  } catch (error) {
    console.warn("Paranoia VTT | Compendium seeding failed", error);
  }

  console.log("Paranoia VTT | System ready");
});

/**
 * Register all custom Handlebars helpers.
 */
function registerHandlebarsHelpers() {
  // Comparison helpers
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("neq", (a, b) => a !== b);
  Handlebars.registerHelper("gt", (a, b) => a > b);
  Handlebars.registerHelper("gte", (a, b) => a >= b);
  Handlebars.registerHelper("lt", (a, b) => a < b);
  Handlebars.registerHelper("lte", (a, b) => a <= b);

  // Logical helpers
  Handlebars.registerHelper("and", (...args) => {
    args.pop(); // Remove Handlebars options object
    return args.every(Boolean);
  });
  Handlebars.registerHelper("or", (...args) => {
    args.pop(); // Remove Handlebars options object
    return args.some(Boolean);
  });
  Handlebars.registerHelper("not", (value) => !value);

  // Number formatting
  Handlebars.registerHelper("formatMod", (value) => {
    const num = Number(value || 0);
    return num >= 0 ? `+${num}` : `${num}`;
  });

  // String helpers
  Handlebars.registerHelper("concat", (...args) => {
    args.pop(); // Remove Handlebars options object
    return args.join("");
  });
  Handlebars.registerHelper("uppercase", (str) => String(str || "").toUpperCase());
  Handlebars.registerHelper("lowercase", (str) => String(str || "").toLowerCase());
  Handlebars.registerHelper("capitalize", (str) => {
    const s = String(str || "");
    return s.charAt(0).toUpperCase() + s.slice(1);
  });

  // Localization helper
  Handlebars.registerHelper("loc", (key) => game.i18n.localize(key));
  Handlebars.registerHelper("locFormat", (key, ...args) => {
    args.pop(); // Remove Handlebars options object
    const data = args.length === 1 && typeof args[0] === "object" ? args[0] : {};
    return game.i18n.format(key, data);
  });

  // Array/Object helpers
  Handlebars.registerHelper("includes", (array, value) => {
    if (!Array.isArray(array)) return false;
    return array.includes(value);
  });
  Handlebars.registerHelper("length", (arr) => (Array.isArray(arr) ? arr.length : 0));

  // Math helpers
  Handlebars.registerHelper("add", (a, b) => Number(a) + Number(b));
  Handlebars.registerHelper("subtract", (a, b) => Number(a) - Number(b));
  Handlebars.registerHelper("multiply", (a, b) => Number(a) * Number(b));
  Handlebars.registerHelper("abs", (value) => Math.abs(Number(value)));
}

/**
 * Preload all Handlebars templates used by the system.
 * @returns {Promise<Function[]>}
 */
async function preloadHandlebarsTemplates() {
  const templatePaths = [
    // Actor sheets
    "systems/paranoia-vtt/templates/actor/actor-sheet.hbs",
    // Item sheets
    "systems/paranoia-vtt/templates/item/equipment-sheet.hbs",
    "systems/paranoia-vtt/templates/item/mutantPower-sheet.hbs",
    "systems/paranoia-vtt/templates/item/secretSociety-sheet.hbs",
    "systems/paranoia-vtt/templates/item/coretech-sheet.hbs",
    // Chat cards
    "systems/paranoia-vtt/templates/chat/roll.hbs",
    "systems/paranoia-vtt/templates/chat/item-card.hbs"
  ];

  return loadTemplates(templatePaths);
}
