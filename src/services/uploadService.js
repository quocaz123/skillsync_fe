import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { UPLOADS, USERS } = API_ENDPOINTS;

/**
 * Upload một file lên Cloudflare R2 qua presigned URL (S3-compatible API).
 * Dùng chung cho avatar và teaching evidence.
 *
 * @param {File} file - File object từ input
 * @param {'AVATAR'|'TEACHING_EVIDENCE'|'SESSION_ATTACHMENT'|'REPORT_EVIDENCE'} uploadType
 * @returns {{ fileKey: string, fileUrl: string }}
 */
export const uploadFile = async (file, uploadType) => {
  // Bước 1: Xin presigned URL từ BE
  const presigned = await httpClient.post(UPLOADS.PRESIGNED_URL, {
    fileName: file.name,
    contentType: file.type,
    uploadType,
  });

  const { uploadUrl, fileKey, fileUrl } = presigned.data ?? presigned;

  // uploadUrl → chỉ dùng cho PUT. fileUrl → hiển thị / lưu (pub-*.r2.dev hoặc custom domain).
  // Bước 2: PUT file trực tiếp lên R2 (không qua BE, không cần token)
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  return { fileKey, fileUrl };
};

/**
 * Upload avatar: gọi uploadFile rồi PATCH /users/me/avatar
 * @param {File} file
 * @returns {Object} UserResponse từ BE
 */
export const uploadAvatar = async (file) => {
  const { fileKey } = await uploadFile(file, 'AVATAR');
  const res = await httpClient.patch(USERS.UPDATE_AVATAR, { fileKey });
  return res.data ?? res;
};
