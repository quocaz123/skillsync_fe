import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getEscrowSessions = async () => {
    try {
        const response = await httpClient.get(API_ENDPOINTS.ADMIN_ESCROW);
        return response?.result;
    } catch (error) {
        throw error;
    }
};

export const getEscrowReport = async (sessionId) => {
    try {
        const response = await httpClient.get(`${API_ENDPOINTS.ADMIN_ESCROW}/${sessionId}/report`);
        return response?.result;
    } catch (error) {
        throw error;
    }
};

export const refundLearner = async (sessionId, adminNotes) => {
    try {
        const response = await httpClient.post(`${API_ENDPOINTS.ADMIN_ESCROW}/${sessionId}/refund`, { adminNotes });
        return response?.result;
    } catch (error) {
        throw error;
    }
};

export const releaseToMentor = async (sessionId, adminNotes) => {
    try {
        const response = await httpClient.post(`${API_ENDPOINTS.ADMIN_ESCROW}/${sessionId}/release`, { adminNotes });
        return response?.result;
    } catch (error) {
        throw error;
    }
};
