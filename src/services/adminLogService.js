import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getSystemLogs = async (page = 0, size = 50) => {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN.LOGS, {
        params: { page, size }
    });
    return response; // Tự động unwrapped bởi axiosClient
};
