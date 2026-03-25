import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { SKILLS, TEACHING_SKILLS } = API_ENDPOINTS;

/** Lấy tất cả skills, có thể filter theo category */
export const getAllSkills = async (category = null) => {
  const params = category ? { category } : {};
  const res = await httpClient.get(SKILLS.GET_ALL, { params });
  return res.data ?? res;
};

/** Danh sách teaching skills của user hiện tại */
export const getMyTeachingSkills = async () => {
  const res = await httpClient.get(TEACHING_SKILLS.GET_MY);
  return res.data ?? res;
};

/**
 * Đăng ký teaching skill mới
 * @param {{ skillId, level, experienceDesc, outcomeDesc, creditsPerHour }} payload
 */
export const createTeachingSkill = async (payload) => {
  const res = await httpClient.post(TEACHING_SKILLS.CREATE, payload);
  return res.data ?? res;
};

/** Upload evidence cho một teaching skill */
export const createEvidence = async (teachingSkillId, payload) => {
  const res = await httpClient.post(
    `/api/teaching-skill-evidences/${teachingSkillId}`,
    payload
  );
  return res.data ?? res;
};

/** Xóa teaching skill */
export const deleteTeachingSkill = async (id) => {
  await httpClient.delete(TEACHING_SKILLS.DELETE(id));
};
