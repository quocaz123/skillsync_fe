import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAllReports = async () => {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN.REPORTS);
    return response;
};

export const resolveReport = async (reportId, resolutionData) => {
    const response = await httpClient.patch(`${API_ENDPOINTS.ADMIN.REPORTS}/${reportId}/resolve`, resolutionData);
    return response;
};
