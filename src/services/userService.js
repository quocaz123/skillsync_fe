import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';
import { mapUserResponse } from './authService.js';

const { USERS } = API_ENDPOINTS;

/** Lấy thông tin profile đầy đủ của user hiện tại (bao gồm avatarUrl) */
export const getMyProfile = async () => {
  const res = await httpClient.get(USERS.ME);
  return mapUserResponse(res.data ?? res);
};

/** Cập nhật avatar — chỉ cần fileKey, BE tự build URL */
export const updateAvatar = async (fileKey) => {
  const res = await httpClient.patch(USERS.UPDATE_AVATAR, { fileKey });
  return mapUserResponse(res.data ?? res);
};
