/**
 * Roll mechanics for the Paranoia VTT system.
 * Implements the NODE dice system with Computer Die and treason tracking.
 * @module helpers/rolls
 */

/**
 * Evaluate a dice roll formula.
 * @param {string} formula - The roll formula (e.g., "3d6").
 * @returns {Promise<Roll>} The evaluated Roll object.
 * @throws {Error} If the roll evaluation fails.
 */
async function rollDice(formula) {
  const roll = new Roll(formula);
  await roll.evaluate({ async: true });
  return roll;
}

/**
 * Count the number of successes in a set of die results.
 * A success is a result of 5 or 6.
 * @param {number[]} results - Array of die results.
 * @returns {number} The number of successes.
 */
function countSuccesses(results) {
  return results.filter((die) => die >= 5).length;
}

/**
 * Count the number of failures in a set of die results.
 * A failure is a result of 1-4.
 * @param {number[]} results - Array of die results.
 * @returns {number} The number of failures.
 */
function countFailures(results) {
  return results.filter((die) => die <= 4).length;
}

/**
 * Extract die results from a Roll object.
 * @param {Roll} roll - The Roll object.
 * @returns {number[]} Array of individual die results.
 */
function extractDieResults(roll) {
  if (!roll?.terms?.[0]?.results) return [];
  return roll.terms[0].results.map((r) => r.result);
}

/**
 * Perform a Paranoia skill test using the NODE dice system.
 *
 * The NODE system works as follows:
 * - Roll a number of d6 equal to the absolute value of the NODE value
 * - Always roll an additional Computer Die (1d6)
 * - Count successes (5-6) on all dice
 * - If NODE is negative, subtract failures from successes
 * - Compare net successes to difficulty
 * - Check if Computer Die triggers Computer Attention
 *
 * @param {Object} options - Roll configuration.
 * @param {Actor} options.actor - The actor performing the roll.
 * @param {string} options.title - The title/name of the roll.
 * @param {number} options.base - The base NODE value (can be negative).
 * @param {number} options.difficulty - The target number of successes.
 * @param {number} options.symbolThreshold - The threshold for Computer Attention.
 * @returns {Promise<ChatMessage|null>} The created chat message or null on error.
 */
export async function rollParanoiaTest({ actor, title, base, difficulty, symbolThreshold }) {
  try {
    // Validate inputs
    if (!actor) {
      console.error("Paranoia VTT | Roll failed: No actor provided");
      ui.notifications.error(game.i18n.localize("PARANOIA.Errors.NoActor"));
      return null;
    }

    if (typeof base !== "number" || isNaN(base)) {
      console.error("Paranoia VTT | Roll failed: Invalid base NODE value", base);
      ui.notifications.error(game.i18n.localize("PARANOIA.Errors.InvalidNode"));
      return null;
    }

    // Calculate number of NODE dice (absolute value, minimum 0)
    const nodeDice = Math.max(0, Math.abs(base));

    // Roll NODE dice (if any) and Computer Die
    const normalRoll = nodeDice > 0 ? await rollDice(`${nodeDice}d6`) : null;
    const computerRoll = await rollDice("1d6");

    // Extract results
    const normalResults = normalRoll ? extractDieResults(normalRoll) : [];
    const computerResult = extractDieResults(computerRoll)[0] ?? 1;

    // Calculate successes and failures
    const normalSuccesses = countSuccesses(normalResults);
    const computerSuccess = computerResult >= 5 ? 1 : 0;
    const successes = normalSuccesses + computerSuccess;

    const normalFailures = countFailures(normalResults);
    const computerFailure = computerResult <= 4 ? 1 : 0;
    const failures = normalFailures + computerFailure;

    // For negative NODE, subtract failures from successes
    const negativeNode = base < 0;
    const netSuccesses = negativeNode ? Math.max(0, successes - failures) : successes;

    // Determine pass/fail
    const passed = netSuccesses >= difficulty;

    // Check for Computer Attention
    const computerAttention = computerResult >= symbolThreshold;

    // Render the chat template
    const content = await renderTemplate("systems/paranoia-vtt/templates/chat/roll.hbs", {
      title,
      base,
      nodeDice,
      difficulty,
      negativeNode,
      successes,
      failures,
      netSuccesses,
      passed,
      normalResults,
      computerResult,
      computerAttention,
      symbolThreshold,
      actorName: actor.name
    });

    // Create the chat message
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content,
      rolls: [normalRoll, computerRoll].filter(Boolean),
      sound: CONFIG.sounds.dice
    });

  } catch (error) {
    console.error("Paranoia VTT | Roll failed:", error);
    ui.notifications.error(game.i18n.localize("PARANOIA.Errors.RollFailed"));
    return null;
  }
}

/**
 * Create a simple roll without the full NODE system.
 * Useful for quick checks or custom rolls.
 *
 * @param {Object} options - Roll configuration.
 * @param {string} options.formula - The roll formula.
 * @param {Actor} [options.actor] - The actor performing the roll.
 * @param {string} [options.title] - The title for the roll.
 * @returns {Promise<Roll|null>} The Roll object or null on error.
 */
export async function rollSimple({ formula, actor = null, title = "Roll" }) {
  try {
    const roll = await rollDice(formula);

    if (actor) {
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: title
      });
    }

    return roll;
  } catch (error) {
    console.error("Paranoia VTT | Simple roll failed:", error);
    return null;
  }
}
