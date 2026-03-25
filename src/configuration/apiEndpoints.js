/**
 * Khai báo tập trung toàn bộ các Endpoint của ứng dụng.
 */
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GET_ME: '/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        GOOGLE_EXCHANGE: '/auth/google/exchange',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    USERS: {
        GET_ALL: '/api/users',
        GET_BY_ID: (id) => `/api/users/${id}`,
        UPDATE: (id) => `/api/users/${id}`,
        DELETE: (id) => `/api/users/${id}`,
        ME: '/api/users/me',
        UPDATE_AVATAR: '/api/users/me/avatar',
    },
    SKILLS: {
        GET_ALL: '/api/skills',
    },
    TEACHING_SKILLS: {
        GET_MY: '/api/teaching-skills/me',
        CREATE: '/api/teaching-skills',
        DELETE: (id) => `/api/teaching-skills/${id}`,
    },
    UPLOADS: {
        PRESIGNED_URL: '/api/uploads/presigned-url',
    },
    ADMIN: {
        SYSTEM_STATS: '/admin/stats',
    },
    COURSES: {
        GET_ALL: '/courses',
        GET_BY_ID: (id) => `/courses/${id}`,
    },
};

export default API_ENDPOINTS;

