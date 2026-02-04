import { ParanoiaActor } from "./documents/actor.mjs";
import { ParanoiaItem } from "./documents/item.mjs";
import { ParanoiaActorSheet } from "./sheets/actor-sheet.mjs";
import { ParanoiaItemSheet } from "./sheets/item-sheet.mjs";
import { PARANOIA_CONFIG } from "./helpers/config.mjs";
import { seedCompendiums } from "./helpers/seed-compendiums.mjs";

Hooks.once("init", async function() {
  console.log("Paranoia VTT | Initializing system");

  game.paranoia = {
    config: PARANOIA_CONFIG
  };

  CONFIG.PARANOIA = PARANOIA_CONFIG;

  CONFIG.Actor.documentClass = ParanoiaActor;
  CONFIG.Item.documentClass = ParanoiaItem;

  Actors.registerSheet("paranoia-vtt", ParanoiaActorSheet, {
    types: ["troubleshooter", "npc"],
    makeDefault: true,
    label: "PARANOIA.Sheets.Actor"
  });

  Items.registerSheet("paranoia-vtt", ParanoiaItemSheet, {
    types: ["equipment", "mutantPower", "secretSociety", "coretech"],
    makeDefault: true,
    label: "PARANOIA.Sheets.Item"
  });

  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("formatMod", (value) => {
    const num = Number(value || 0);
    return num >= 0 ? `+${num}` : `${num}`;
  });

  return preloadHandlebarsTemplates();
});

Hooks.once("ready", async function() {
  try {
    await seedCompendiums();
  } catch (error) {
    console.warn("Paranoia VTT | Compendium seeding failed", error);
  }
});

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/paranoia-vtt/templates/actor/actor-sheet.hbs",
    "systems/paranoia-vtt/templates/item/equipment-sheet.hbs",
    "systems/paranoia-vtt/templates/item/mutantPower-sheet.hbs",
    "systems/paranoia-vtt/templates/item/secretSociety-sheet.hbs",
    "systems/paranoia-vtt/templates/item/coretech-sheet.hbs",
    "systems/paranoia-vtt/templates/chat/roll.hbs"
  ];

  return loadTemplates(templatePaths);
}
