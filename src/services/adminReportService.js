import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAllReports = async () => {
    try {
        const response = await httpClient.get(API_ENDPOINTS.ADMIN.REPORTS);
        return response;
    } catch (error) {
        throw error;
    }
};

export const resolveReport = async (reportId, resolutionData) => {
    try {
        const response = await httpClient.patch(`${API_ENDPOINTS.ADMIN.REPORTS}/${reportId}/resolve`, resolutionData);
        return response;
    } catch (error) {
        throw error;
    }
};
