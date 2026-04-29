import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { ADMIN } = API_ENDPOINTS;

/**
 * GET /api/admin/missions
 * Trả về danh sách missions kèm stats: totalCompletions, uniqueUsers, totalRewardsDistributed
 */
export const getAdminMissions = async () => {
    const res = await httpClient.get(ADMIN.MISSIONS);
    return Array.isArray(res) ? res : (res?.content ?? []);
};

/**
 * PATCH /api/admin/missions/{id}/toggle
 * Bật/tắt mission
 */
export const toggleAdminMission = async (missionId) => {
    return httpClient.patch(ADMIN.MISSIONS_TOGGLE(missionId));
};
