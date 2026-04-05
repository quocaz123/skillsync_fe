import httpClient from "../configuration/axiosClient";
import { API_ENDPOINTS } from "../configuration/apiEndpoints";

const { ADMIN } = API_ENDPOINTS;

export const getAdminForumPosts = async (status = null) => {
  const params = status ? { status } : {};
  const res = await httpClient.get(ADMIN.FORUM_POSTS, { params });
  return res ?? [];
};

export const verifyForumPost = async (id, action, rejectionReason = null) => {
  const res = await httpClient.patch(`${ADMIN.FORUM_POSTS}/${id}/verify`, {
    action,
    rejectionReason,
  });
  return res ?? null;
};
