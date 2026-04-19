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
 * Teacher — create slots (mỗi slot có date, time, endTime, creditCost riêng).
 * @param {string} skillId
 * @param {Array<{date: string, time: string, endTime?: string, creditCost: number}>} slots
 */
export const createSlotsBatch = async (skillId, slots) => {
    const res = await httpClient.post(SLOTS.BATCH_CREATE(skillId), { slots });
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
 * Learner — propose a session when no slots are available.
 * @param {string} teachingSkillId
 * @param {string} slotDate
 * @param {string} slotTime
 * @param {string} slotEndTime 
 * @param {string} [learnerNotes]
 */
export const proposeSession = async (teachingSkillId, slotDate, slotTime, slotEndTime, learnerNotes = '') => {
    const res = await httpClient.post(SESSIONS.PROPOSE, {
        teachingSkillId,
        slotDate,
        slotTime,
        slotEndTime,
        learnerNotes
    });
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

/**
 * Teacher — approve a pending session.
 * @param {string} sessionId
 */
export const approveSession = async (sessionId) => {
    const res = await httpClient.post(SESSIONS.APPROVE(sessionId));
    return unwrap(res);
};

/**
 * Teacher — reject a pending session.
 * @param {string} sessionId
 */
export const rejectSession = async (sessionId) => {
    const res = await httpClient.post(SESSIONS.REJECT(sessionId));
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
