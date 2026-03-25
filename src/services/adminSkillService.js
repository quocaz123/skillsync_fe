import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { ADMIN } = API_ENDPOINTS;

/** Lấy danh sách teaching skills cần duyệt (hoặc tất cả) */
export const getAdminTeachingSkills = async (status = null) => {
    const params = status ? { status } : {};
    const res = await httpClient.get(ADMIN.TEACHING_SKILLS, { params });
    return res.data ?? res;
};

/** Duyệt hoặc từ chối teaching skill */
export const verifyTeachingSkill = async (id, action, rejectionReason = null) => {
    const res = await httpClient.patch(`${ADMIN.TEACHING_SKILLS}/${id}/verify`, {
        action,
        rejectionReason
    });
    return res.data ?? res;
};
