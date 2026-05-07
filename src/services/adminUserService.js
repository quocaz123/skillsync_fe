import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAllUsers = async (page = 0, size = 10, search = '') => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.USERS}?${params.toString()}`);
    return response;
};

export const toggleUserBanStatus = async (userId) => {
    const response = await httpClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/toggle-ban`);
    return response;
};
