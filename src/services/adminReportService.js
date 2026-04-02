import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAllReports = async () => {
    try {
        const response = await httpClient.get(API_ENDPOINTS.ADMIN_REPORTS);
        return response?.result;
    } catch (error) {
        throw error;
    }
};

export const resolveReport = async (reportId, resolutionData) => {
    try {
        const response = await httpClient.patch(`${API_ENDPOINTS.ADMIN_REPORTS}/${reportId}/resolve`, resolutionData);
        return response?.result;
    } catch (error) {
        throw error;
    }
};
