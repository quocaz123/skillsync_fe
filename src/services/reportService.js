import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { REPORTS } = API_ENDPOINTS;

const unwrap = (res) => res?.result ?? (Array.isArray(res) ? res : res);

/**
 * Create a new report for a session
 * @param {string} sessionId 
 * @param {string} reason 
 * @param {string} description 
 * @param {string} evidenceUrl 
 */
export const createSessionReport = async (sessionId, reason, description, evidenceUrl) => {
    const res = await httpClient.post(REPORTS.CREATE_SESSION_REPORT(sessionId), {
        reason,
        description,
        evidenceUrl
    });
    return unwrap(res);
};

/**
 * Admin: Get all pending reports
 */
export const getPendingReports = async () => {
    const res = await httpClient.get(REPORTS.PENDING);
    return unwrap(res);
};

/**
 * Admin: Resolve a report
 * @param {string} reportId 
 * @param {'RESOLVED'|'REJECTED'} resolution 
 * @param {string} adminNotes 
 */
export const resolveReport = async (reportId, resolution, adminNotes) => {
    const res = await httpClient.post(REPORTS.RESOLVE(reportId), {
        resolution,
        adminNotes
    });
    return unwrap(res);
};

/**
 * Submit counter-evidence for a reported user
 * @param {string} sessionId 
 * @param {string} description 
 * @param {string} evidenceUrl 
 */
export const submitCounterEvidence = async (sessionId, description, evidenceUrl) => {
    const res = await httpClient.post(`/api/reports/session/${sessionId}/counter-evidence`, {
        description,
        evidenceUrl
    });
    return unwrap(res);
};
