import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getEscrowSessions = async () => {
    try {
        const response = await httpClient.get(API_ENDPOINTS.ADMIN.ESCROW);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getEscrowReport = async (sessionId) => {
    try {
        const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.ESCROW}/${sessionId}/report`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const refundLearner = async (sessionId, adminNotes) => {
    try {
        const response = await httpClient.post(`${API_ENDPOINTS.ADMIN.ESCROW}/${sessionId}/refund`, { adminNotes });
        return response;
    } catch (error) {
        throw error;
    }
};

export const releaseToMentor = async (sessionId, adminNotes) => {
    try {
        const response = await httpClient.post(`${API_ENDPOINTS.ADMIN.ESCROW}/${sessionId}/release`, { adminNotes });
        return response;
    } catch (error) {
        throw error;
    }
};
