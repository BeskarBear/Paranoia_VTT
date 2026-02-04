/**
 * Compendium seeding module for Paranoia VTT.
 * Loads seed data from JSON files and populates world compendiums on first load.
 * @module helpers/seed-compendiums
 */

const DATA_PATH = "systems/paranoia-vtt/packs/data";

/**
 * Load JSON data from a file path.
 * @param {string} filename - The filename to load from the data directory.
 * @returns {Promise<Array|Object>} The parsed JSON data.
 */
async function loadData(filename) {
  try {
    const response = await fetch(`${DATA_PATH}/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Paranoia VTT | Error loading ${filename}:`, error);
    return [];
  }
}

/**
 * Ensure a compendium pack exists, creating it if necessary.
 * @param {Object} options - Pack configuration.
 * @param {string} options.name - The pack name (without world prefix).
 * @param {string} options.label - The human-readable label.
 * @param {string} options.type - The document type (Item, Actor, RollTable).
 * @returns {Promise<CompendiumCollection>} The compendium pack.
 */
async function ensurePack({ name, label, type }) {
  const packId = `world.${name}`;
  const existing = game.packs.get(packId);
  if (existing) return existing;

  try {
    return await CompendiumCollection.createCompendium({
      name,
      label,
      type,
      package: "world"
    });
  } catch (error) {
    console.error(`Paranoia VTT | Failed to create pack ${name}:`, error);
    return null;
  }
}

/**
 * Seed a compendium pack with items if it's empty.
 * @param {CompendiumCollection} pack - The pack to seed.
 * @param {Array} items - The items to add.
 * @param {string} [documentClass="Item"] - The document class name.
 */
async function seedPack(pack, items, documentClass = "Item") {
  if (!pack || !items?.length) return;

  const index = await pack.getIndex();
  if (index.size > 0) {
    console.log(`Paranoia VTT | Pack ${pack.metadata.label} already seeded, skipping`);
    return;
  }

  console.log(`Paranoia VTT | Seeding ${pack.metadata.label} with ${items.length} entries`);

  const DocClass = documentClass === "Actor" ? Actor : Item;
  for (const item of items) {
    try {
      await DocClass.create(item, { pack: pack.collection });
    } catch (error) {
      console.error(`Paranoia VTT | Failed to create ${item.name}:`, error);
    }
  }
}

/**
 * Build roll table results from an array of text entries.
 * @param {string[]} entries - The text entries for the table.
 * @returns {Object[]} The formatted table results.
 */
function buildTableResults(entries) {
  const textType = (typeof CONST !== "undefined" && CONST.TABLE_RESULT_TYPES)
    ? CONST.TABLE_RESULT_TYPES.TEXT
    : 0;

  return entries.map((text, index) => ({
    type: textType,
    text,
    range: [index + 1, index + 1],
    weight: 1,
    drawn: false
  }));
}

/**
 * Seed a roll table compendium pack.
 * @param {CompendiumCollection} pack - The pack to seed.
 * @param {Array} tables - The table definitions.
 */
async function seedRollTablePack(pack, tables) {
  if (!pack || !tables?.length) return;

  const index = await pack.getIndex();
  if (index.size > 0) {
    console.log(`Paranoia VTT | Pack ${pack.metadata.label} already seeded, skipping`);
    return;
  }

  console.log(`Paranoia VTT | Seeding ${pack.metadata.label} with ${tables.length} tables`);

  for (const table of tables) {
    try {
      await RollTable.create(table, { pack: pack.collection });
    } catch (error) {
      console.error(`Paranoia VTT | Failed to create table ${table.name}:`, error);
    }
  }
}

/**
 * Main function to seed all compendiums with default data.
 * Called during the "ready" hook.
 * @returns {Promise<void>}
 */
export async function seedCompendiums() {
  console.log("Paranoia VTT | Checking compendiums for seeding...");

  // Load all data in parallel for efficiency
  const [equipment, mutantPowers, secretSocieties, coretech, npcs, quirks, looks, plans] = await Promise.all([
    loadData("equipment.json"),
    loadData("mutant-powers.json"),
    loadData("secret-societies.json"),
    loadData("coretech.json"),
    loadData("npcs.json"),
    loadData("npc-quirks.json"),
    loadData("npc-looks.json"),
    loadData("npc-plans.json")
  ]);

  // Create/get all packs
  const [equipmentPack, mutantPack, societyPack, coretechPack, npcPack, npcTablesPack] = await Promise.all([
    ensurePack({ name: "paranoia-equipment", label: "Paranoia Equipment", type: "Item" }),
    ensurePack({ name: "paranoia-mutant-powers", label: "Paranoia Mutant Powers", type: "Item" }),
    ensurePack({ name: "paranoia-secret-societies", label: "Paranoia Secret Societies", type: "Item" }),
    ensurePack({ name: "paranoia-coretech", label: "Paranoia Coretech & Apps", type: "Item" }),
    ensurePack({ name: "paranoia-npcs", label: "Paranoia NPCs", type: "Actor" }),
    ensurePack({ name: "paranoia-npc-tables", label: "Paranoia NPC Tables", type: "RollTable" })
  ]);

  // Seed item packs
  await seedPack(equipmentPack, equipment, "Item");
  await seedPack(mutantPack, mutantPowers, "Item");
  await seedPack(societyPack, secretSocieties, "Item");
  await seedPack(coretechPack, coretech, "Item");

  // Seed NPC pack
  await seedPack(npcPack, npcs, "Actor");

  // Seed roll tables
  const rollTables = [
    {
      name: "NPC Quirks",
      formula: `1d${quirks.length}`,
      results: buildTableResults(quirks)
    },
    {
      name: "NPC Looks",
      formula: `1d${looks.length}`,
      results: buildTableResults(looks)
    },
    {
      name: "NPC Plans",
      formula: `1d${plans.length}`,
      results: buildTableResults(plans)
    }
  ];
  await seedRollTablePack(npcTablesPack, rollTables);

  console.log("Paranoia VTT | Compendium seeding complete");
}
