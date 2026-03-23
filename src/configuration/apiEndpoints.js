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
        GET_ALL: '/users',
        GET_BY_ID: (id) => `/users/${id}`,
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
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
