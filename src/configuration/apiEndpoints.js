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
        // POST JSON { idToken } — Google Sign-In (JWT id_token), không phải redirect OAuth
        GOOGLE: '/auth/google',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    USERS: {
        GET_ALL: '/users',
        GET_BY_ID: (id) => `/users/${id}`,
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
    },
    ADMIN: {
        SYSTEM_STATS: '/admin/stats',
        // ... Thêm các endpoint admin khác nếu cần
    },
    COURSES: {
        GET_ALL: '/courses',
        GET_BY_ID: (id) => `/courses/${id}`,
    },
    // Thêm các entity khác (ví dụ: SESSIONS, CREDITS, MISSIONS...)
};

export default API_ENDPOINTS;
