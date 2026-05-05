import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';
import { mapUserResponse } from './authService.js';

const { USERS } = API_ENDPOINTS;

/** Lấy thông tin profile đầy đủ của user hiện tại */
export const getMyProfile = async () => {
  const res = await httpClient.get(USERS.ME);
  return mapUserResponse(res.data ?? res);
};

/** Lấy public profile của bất kỳ mentor nào — dùng cho trang mentor profile */
export const getMentorProfile = async (userId) => {
  const res = await httpClient.get(USERS.PUBLIC_PROFILE(userId));
  return mapUserResponse(res.data ?? res);
};

/** Cập nhật avatar — chỉ cần fileKey, BE tự build URL */
export const updateAvatar = async (fileKey) => {
  const res = await httpClient.patch(USERS.UPDATE_AVATAR, { fileKey });
  return mapUserResponse(res.data ?? res);
};

/** Cập nhật bio */
export const updateBio = async (bio) => {
  const res = await httpClient.patch(USERS.UPDATE_BIO, { bio });
  return mapUserResponse(res.data ?? res);
};

export const getMyTransactions = async () => {
  const res = await httpClient.get(USERS.TRANSACTIONS);
  return res.data ?? res;
};

/**
 * Tìm user cho @mention dropdown.
 * Trả về: [{ id, fullName, email, avatarUrl }]
 * email đã được mask phía backend: a**@gmail.com
 */
export const searchUsersForMention = async (q, size = 8) => {
  if (!q || q.trim().length < 2) return [];
  try {
    const res = await httpClient.get(USERS.SEARCH(q.trim(), size));
    return Array.isArray(res.data) ? res.data : (res.data?.result ?? []);
  } catch {
    return [];
  }
};
