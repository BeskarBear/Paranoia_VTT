/**
 * Socket event handlers for GM-player communication.
 * Allows the GM to remotely modify player actors (award XP, add treason stars, etc.)
 * @module helpers/socket
 */

const SOCKET_NAME = "system.paranoia-vtt";

/**
 * Socket message types for the Paranoia system.
 * @enum {string}
 */
export const SocketMessageType = {
  AWARD_XP: "awardXP",
  ADD_TREASON_STAR: "addTreasonStar",
  REMOVE_TREASON_STAR: "removeTreasonStar",
  MODIFY_MOXIE: "modifyMoxie",
  SET_WOUND: "setWound",
  REFRESH_SHEET: "refreshSheet"
};

/**
 * Register socket event listeners.
 * Should be called during the "ready" hook.
 */
export function registerSocketListeners() {
  game.socket.on(SOCKET_NAME, handleSocketMessage);
  console.log("Paranoia VTT | Socket listeners registered");
}

/**
 * Handle incoming socket messages.
 * @param {Object} data - The socket message data.
 * @param {string} data.type - The message type.
 * @param {string} data.actorId - The target actor ID.
 * @param {*} data.payload - Additional data for the operation.
 */
async function handleSocketMessage(data) {
  // Only the owner of the actor should process the update
  const actor = game.actors.get(data.actorId);
  if (!actor || !actor.isOwner) return;

  try {
    switch (data.type) {
      case SocketMessageType.AWARD_XP:
        await handleAwardXP(actor, data.payload);
        break;
      case SocketMessageType.ADD_TREASON_STAR:
        await handleAddTreasonStar(actor);
        break;
      case SocketMessageType.REMOVE_TREASON_STAR:
        await handleRemoveTreasonStar(actor);
        break;
      case SocketMessageType.MODIFY_MOXIE:
        await handleModifyMoxie(actor, data.payload);
        break;
      case SocketMessageType.SET_WOUND:
        await handleSetWound(actor, data.payload);
        break;
      case SocketMessageType.REFRESH_SHEET:
        actor.sheet?.render(false);
        break;
      default:
        console.warn(`Paranoia VTT | Unknown socket message type: ${data.type}`);
    }
  } catch (error) {
    console.error("Paranoia VTT | Socket handler error:", error);
  }
}

/**
 * Handle XP award from GM.
 * @param {Actor} actor - The target actor.
 * @param {Object} payload - The operation payload.
 * @param {number} payload.amount - The amount of XP to add (can be negative).
 */
async function handleAwardXP(actor, payload) {
  const currentXP = actor.system.resources?.xp?.value ?? 0;
  const newXP = currentXP + Number(payload.amount);
  await actor.update({ "system.resources.xp.value": newXP });

  if (payload.amount > 0) {
    ui.notifications.info(`${actor.name} received ${payload.amount} XP!`);
  } else if (payload.amount < 0) {
    ui.notifications.warn(`${actor.name} lost ${Math.abs(payload.amount)} XP!`);
  }
}

/**
 * Handle adding a treason star from GM.
 * @param {Actor} actor - The target actor.
 */
async function handleAddTreasonStar(actor) {
  const current = actor.system.resources?.treasonStars?.value ?? 0;
  const max = CONFIG.PARANOIA.defaults.TREASON_STARS_MAX;
  const newValue = Math.min(current + 1, max);

  if (newValue !== current) {
    await actor.update({ "system.resources.treasonStars.value": newValue });
    ui.notifications.warn(`${actor.name} gained a Treason Star! (${newValue}/${max})`);
  }
}

/**
 * Handle removing a treason star from GM.
 * @param {Actor} actor - The target actor.
 */
async function handleRemoveTreasonStar(actor) {
  const current = actor.system.resources?.treasonStars?.value ?? 0;
  const newValue = Math.max(current - 1, 0);

  if (newValue !== current) {
    await actor.update({ "system.resources.treasonStars.value": newValue });
    ui.notifications.info(`${actor.name} lost a Treason Star! (${newValue} remaining)`);
  }
}

/**
 * Handle moxie modification from GM.
 * @param {Actor} actor - The target actor.
 * @param {Object} payload - The operation payload.
 * @param {number} payload.amount - The amount to modify (can be negative).
 */
async function handleModifyMoxie(actor, payload) {
  const current = actor.system.resources?.moxie?.value ?? 0;
  const max = actor.system.resources?.moxie?.max ?? CONFIG.PARANOIA.defaults.MOXIE_MAX;
  const newValue = Math.max(0, Math.min(current + Number(payload.amount), max));

  await actor.update({ "system.resources.moxie.value": newValue });

  if (payload.amount > 0) {
    ui.notifications.info(`${actor.name} recovered ${payload.amount} Moxie!`);
  } else if (payload.amount < 0) {
    ui.notifications.warn(`${actor.name} lost ${Math.abs(payload.amount)} Moxie!`);
  }
}

/**
 * Handle wound level change from GM.
 * @param {Actor} actor - The target actor.
 * @param {Object} payload - The operation payload.
 * @param {string} payload.level - The new wound level.
 */
async function handleSetWound(actor, payload) {
  const validLevels = Object.keys(CONFIG.PARANOIA.woundLevels);
  if (!validLevels.includes(payload.level)) {
    console.warn(`Paranoia VTT | Invalid wound level: ${payload.level}`);
    return;
  }

  await actor.update({ "system.wounds.level": payload.level });
  const label = CONFIG.PARANOIA.woundLevels[payload.level].label;
  ui.notifications.info(`${actor.name} is now ${label}!`);
}

// ============================================================================
// Emit Functions - Call these to send socket messages to other clients
// ============================================================================

/**
 * Emit an XP award to a specific actor.
 * @param {string} actorId - The target actor ID.
 * @param {number} amount - The amount of XP to award.
 */
export function emitAwardXP(actorId, amount) {
  game.socket.emit(SOCKET_NAME, {
    type: SocketMessageType.AWARD_XP,
    actorId,
    payload: { amount }
  });
  // Also handle locally for the emitter
  handleSocketMessage({
    type: SocketMessageType.AWARD_XP,
    actorId,
    payload: { amount }
  });
}

/**
 * Emit a treason star addition to a specific actor.
 * @param {string} actorId - The target actor ID.
 */
export function emitAddTreasonStar(actorId) {
  game.socket.emit(SOCKET_NAME, {
    type: SocketMessageType.ADD_TREASON_STAR,
    actorId,
    payload: {}
  });
  handleSocketMessage({
    type: SocketMessageType.ADD_TREASON_STAR,
    actorId,
    payload: {}
  });
}

/**
 * Emit a treason star removal to a specific actor.
 * @param {string} actorId - The target actor ID.
 */
export function emitRemoveTreasonStar(actorId) {
  game.socket.emit(SOCKET_NAME, {
    type: SocketMessageType.REMOVE_TREASON_STAR,
    actorId,
    payload: {}
  });
  handleSocketMessage({
    type: SocketMessageType.REMOVE_TREASON_STAR,
    actorId,
    payload: {}
  });
}

/**
 * Emit a moxie modification to a specific actor.
 * @param {string} actorId - The target actor ID.
 * @param {number} amount - The amount to modify (can be negative).
 */
export function emitModifyMoxie(actorId, amount) {
  game.socket.emit(SOCKET_NAME, {
    type: SocketMessageType.MODIFY_MOXIE,
    actorId,
    payload: { amount }
  });
  handleSocketMessage({
    type: SocketMessageType.MODIFY_MOXIE,
    actorId,
    payload: { amount }
  });
}

/**
 * Emit a wound level change to a specific actor.
 * @param {string} actorId - The target actor ID.
 * @param {string} level - The new wound level.
 */
export function emitSetWound(actorId, level) {
  game.socket.emit(SOCKET_NAME, {
    type: SocketMessageType.SET_WOUND,
    actorId,
    payload: { level }
  });
  handleSocketMessage({
    type: SocketMessageType.SET_WOUND,
    actorId,
    payload: { level }
  });
}
