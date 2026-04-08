import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAdminSessions = async (status = null) => {
    const params = {};
    if (status && status !== 'ALL') params.status = status;
    const response = await httpClient.get(API_ENDPOINTS.ADMIN_SESSIONS, { params });
    return response ?? [];
};
