import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAllUsers = async () => {
    try {
        const response = await httpClient.get(API_ENDPOINTS.ADMIN.USERS);
        return response;
    } catch (error) {
        throw error;
    }
};

export const toggleUserBanStatus = async (userId) => {
    try {
        const response = await httpClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/toggle-ban`);
        return response;
    } catch (error) {
        throw error;
    }
};
