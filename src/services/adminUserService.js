import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAllUsers = async () => {
    try {
        const response = await httpClient.get(API_ENDPOINTS.ADMIN_USERS);
        return response?.result;
    } catch (error) {
        throw error;
    }
};

export const toggleUserBanStatus = async (userId) => {
    try {
        const response = await httpClient.patch(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/toggle-ban`);
        return response?.result;
    } catch (error) {
        throw error;
    }
};
