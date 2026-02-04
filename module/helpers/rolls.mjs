async function rollDice(formula) {
  const roll = await new Roll(formula).evaluate({ async: true });
  return roll;
}

function countSuccesses(results) {
  return results.filter((die) => die >= 5).length;
}

function countFailures(results) {
  return results.filter((die) => die <= 4).length;
}

export async function rollParanoiaTest({ actor, title, base, difficulty, symbolThreshold }) {
  const nodeDice = Math.max(0, Math.abs(base));
  const normalRoll = nodeDice > 0 ? await rollDice(`${nodeDice}d6`) : null;
  const computerRoll = await rollDice("1d6");

  const normalResults = normalRoll ? normalRoll.terms[0].results.map((r) => r.result) : [];
  const computerResult = computerRoll.terms[0].results[0].result;

  const successes = countSuccesses(normalResults) + (computerResult >= 5 ? 1 : 0);
  const failures = countFailures(normalResults) + (computerResult <= 4 ? 1 : 0);

  const negativeNode = base < 0;
  const netSuccesses = negativeNode ? Math.max(0, successes - failures) : successes;
  const passed = netSuccesses >= difficulty;

  const computerAttention = computerResult >= symbolThreshold;

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

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content
  });
}
