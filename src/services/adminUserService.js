import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAllUsers = async (page = 0, size = 100, search = '') => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    // axiosClient interceptor đã bóc tách apiRes.data → nhận được PageResponse { data: [...], totalElements, ... }
    // Lưu ý: PageResponse backend dùng field tên "data" (không phải "content")
    const pageRes = await httpClient.get(`${API_ENDPOINTS.ADMIN.USERS}?${params.toString()}`);
    if (pageRes && Array.isArray(pageRes.data)) {
        return pageRes.data;
    }
    return Array.isArray(pageRes) ? pageRes : [];
};

export const toggleUserBanStatus = async (userId) => {
    const response = await httpClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/toggle-ban`);
    return response;
};
