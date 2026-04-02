import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { SLOTS, SESSIONS } = API_ENDPOINTS;

/** axiosClient interceptor đã unwrap response.data rồi → res chính là body */
const unwrap = (res) => res?.result ?? (Array.isArray(res) ? res : res);

// ── Slots ────────────────────────────────────────────────

/** Teacher — all slots of a teaching skill */
export const getSlotsBySkill = async (skillId) => {
    const res = await httpClient.get(SLOTS.BY_SKILL(skillId));
    return unwrap(res);
};

/** Public/Learner — open (available) slots of a teaching skill */
export const getOpenSlotsBySkill = async (skillId) => {
    const res = await httpClient.get(SLOTS.OPEN_BY_SKILL(skillId));
    return unwrap(res);
};

/**
 * Teacher — batch create slots.
 * @param {string} skillId — teaching skill UUID
 * @param {string[]} dates  — ISO date strings e.g. "2025-04-10"
 * @param {string[]} times  — HH:mm strings e.g. "09:00"
 */
export const createSlotsBatch = async (skillId, dates, times, endTimes = []) => {
    const res = await httpClient.post(SLOTS.BATCH_CREATE(skillId), { dates, times, endTimes });
    return unwrap(res);
};

/** Teacher — delete a slot (only if not BOOKED) */
export const deleteSlot = async (skillId, slotId) => {
    await httpClient.delete(SLOTS.DELETE(skillId, slotId));
};

// ── Sessions ─────────────────────────────────────────────

/**
 * Learner — book a slot.
 * @param {string} slotId
 * @param {string} [learnerNotes]
 */
export const bookSession = async (slotId, learnerNotes = '') => {
    const res = await httpClient.post(SESSIONS.BOOK, { slotId, learnerNotes });
    return unwrap(res);
};

/**
 * Get my sessions.
 * @param {'learner'|'teacher'|'all'} role
 * @param {'SCHEDULED'|'COMPLETED'|'CANCELLED'|undefined} status
 */
export const getMySessions = async (role = 'all', status) => {
    const params = { role };
    if (status) params.status = status;
    const res = await httpClient.get(SESSIONS.MINE, { params });
    return unwrap(res);
};

/** Get ZEGO token for a session — backend validates time window */
export const getZegoToken = async (sessionId) => {
    const res = await httpClient.get(SESSIONS.ZEGO_TOKEN(sessionId));
    return unwrap(res);
};

/** Mark join (called after ZEGO UIKit mounts) */
export const markJoin = async (sessionId) => {
    await httpClient.post(SESSIONS.JOIN(sessionId));
};

/** Mark leave / end session */
export const markLeave = async (sessionId) => {
    await httpClient.post(SESSIONS.LEAVE(sessionId));
};

/**
 * Learner confirms session completion to release funds
 * @param {string} sessionId
 */
export const confirmSession = async (sessionId) => {
    const res = await httpClient.post(SESSIONS.CONFIRM(sessionId));
    return unwrap(res);
};
