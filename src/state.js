export const NS = "pl.attentionhorse1.doomsong-acts";
export const STATE_KEY = `${NS}/combat`;
export const MODAL_ID = `${NS}/announcement`;
export const PHASE_NAMES = ["PRZYGOTOWANIE", "AKT I", "AKT II", "AKT III", "AKT IV", "AKT V", "AKT VI"];
export const INITIAL_STATE = Object.freeze({ active: false, phase: 0, round: 1, revision: 0, updatedAt: 0 });

export function readState(value) {
  if (!value || typeof value !== "object") return { ...INITIAL_STATE };
  const phase = Number.isInteger(value.phase) && value.phase >= 0 && value.phase <= 6 ? value.phase : 0;
  const round = Number.isSafeInteger(value.round) && value.round > 0 ? value.round : 1;
  const revision = Number.isSafeInteger(value.revision) && value.revision >= 0 ? value.revision : 0;
  const updatedAt = typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt) ? value.updatedAt : 0;
  return { active: value.active === true, phase, round, revision, updatedAt };
}
export function nextState(current, operation, now = Date.now()) {
  const s = readState(current);
  const result = { ...s, revision: s.revision + 1, updatedAt: now };
  if (operation === "start") return { ...result, active: true, phase: 0, round: 1 };
  if (operation === "stop") return { ...result, active: false, phase: 0, round: 1 };
  if (!s.active) return s;
  if (operation === "next") {
    result.phase = (s.phase + 1) % 7;
    if (result.phase === 0) result.round = s.round + 1;
    return result;
  }
  if (operation === "previous") {
    result.phase = (s.phase + 6) % 7;
    if (s.phase === 0) result.round = Math.max(1, s.round - 1);
    return result;
  }
  return s;
}
export function phaseBadge(state) {
  if (!state.active) return undefined;
  return state.phase === 0 ? "P" : String(state.phase);
}
