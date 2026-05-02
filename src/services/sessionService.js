import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { SLOTS, SESSIONS } = API_ENDPOINTS;

/**
 * axiosClient interceptor đã tự động unwrap { code, message, data } → data.
 * Hàm này chỉ đảm bảo trả về array khi BE trả array (tránh undefined).
 */
const safeArray = (res) => (Array.isArray(res) ? res : res ?? []);

// ── Slots ────────────────────────────────────────────────

/** Teacher — all slots of a teaching skill */
export const getSlotsBySkill = async (skillId) => {
    return httpClient.get(SLOTS.BY_SKILL(skillId));
};

/** Public/Learner — open (available) slots of a teaching skill */
export const getOpenSlotsBySkill = async (skillId) => {
    return httpClient.get(SLOTS.OPEN_BY_SKILL(skillId));
};

/**
 * Teacher — create slots (mỗi slot có date, time, endTime, creditCost riêng).
 * @param {string} skillId
 * @param {Array<{date: string, time: string, endTime?: string, creditCost: number}>} slots
 */
export const createSlotsBatch = async (skillId, slots) => {
    return httpClient.post(SLOTS.BATCH_CREATE(skillId), { slots });
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
    return httpClient.post(SESSIONS.BOOK, { slotId, learnerNotes });
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
    return httpClient.post(SESSIONS.PROPOSE, {
        teachingSkillId,
        slotDate,
        slotTime,
        slotEndTime,
        learnerNotes,
    });
};

/**
 * Get my sessions — axiosClient trả thẳng array sau unwrap.
 * @param {'learner'|'teacher'|'all'} role
 * @param {'SCHEDULED'|'COMPLETED'|'CANCELLED'|undefined} status
 */
export const getMySessions = async (role = 'all', status) => {
    const params = { role };
    if (status) params.status = status;
    const res = await httpClient.get(SESSIONS.MINE, { params });
    return safeArray(res);
};

/**
 * Teacher — approve a pending session.
 * @param {string} sessionId
 */
export const approveSession = async (sessionId) => {
    return httpClient.post(SESSIONS.APPROVE(sessionId));
};

/**
 * Teacher — reject a pending session.
 * @param {string} sessionId
 */
export const rejectSession = async (sessionId) => {
    await httpClient.post(SESSIONS.REJECT(sessionId));
};

/** Get ZEGO token for a session — backend validates time window */
export const getZegoToken = async (sessionId) => {
    return httpClient.get(SESSIONS.ZEGO_TOKEN(sessionId));
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
 * Learner confirms session completion to release funds.
 * @param {string} sessionId
 */
export const confirmSession = async (sessionId) => {
    return httpClient.post(SESSIONS.CONFIRM(sessionId));
};

/**
 * Learner hủy session khi còn PENDING_APPROVAL (trước khi Mentor duyệt).
 * Credits chưa bị trừ nên không cần refund.
 * @param {string} sessionId
 */
export const cancelSession = async (sessionId) => {
    return httpClient.patch(SESSIONS.CANCEL(sessionId));
};
