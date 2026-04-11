import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAdminStats = async () => {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN.STATS);
    return response ?? {};
};
