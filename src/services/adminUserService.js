import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAllUsers = async () => {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN.USERS);
    return response;
};

export const toggleUserBanStatus = async (userId) => {
    const response = await httpClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/toggle-ban`);
    return response;
};
