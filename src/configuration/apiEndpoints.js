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
        UPDATE_BIO: '/api/users/me/bio',
        SET_PASSWORD: '/api/users/me/password',
    },
    SKILLS: {
        GET_ALL: '/api/skills',
    },
    TEACHING_SKILLS: {
        GET_MY: '/api/teaching-skills/me',
        GET_APPROVED: '/api/teaching-skills/approved',
        CREATE: '/api/teaching-skills',
        DELETE: (id) => `/api/teaching-skills/${id}`,
    },
    UPLOADS: {
        PRESIGNED_URL: '/api/uploads/presigned-url',
    },
    ADMIN: {
        SYSTEM_STATS: '/admin/stats',
        TEACHING_SKILLS: '/api/admin/teaching-skills',
    },
    SLOTS: {
        BY_SKILL: (skillId) => `/api/teaching-skills/${skillId}/slots`,
        OPEN_BY_SKILL: (skillId) => `/api/teaching-skills/${skillId}/slots/open`,
        BATCH_CREATE: (skillId) => `/api/teaching-skills/${skillId}/slots/batch`,
        DELETE: (skillId, slotId) => `/api/teaching-skills/${skillId}/slots/${slotId}`,
    },
    SESSIONS: {
        BOOK: '/api/sessions/book',
        MINE: '/api/sessions/mine',
        APPROVE: (id) => `/api/sessions/${id}/approve`,
        REJECT: (id) => `/api/sessions/${id}/reject`,
        ZEGO_TOKEN: (id) => `/api/sessions/${id}/zego-token`,
        JOIN: (id) => `/api/sessions/${id}/join`,
        LEAVE: (id) => `/api/sessions/${id}/leave`,
        CONFIRM: (id) => `/api/sessions/${id}/confirm`,
    },
    REPORTS: {
        CREATE_SESSION_REPORT: (sessionId) => `/api/reports/session/${sessionId}`,
        PENDING: '/api/reports/pending',
    },
    CREDITS: {
        HISTORY: '/api/credits/history',
    },
    REVIEWS: {
        CREATE: '/api/reviews',
    },
    NOTIFICATIONS: {
        MINE: '/api/notifications',
        UNREAD_COUNT: '/api/notifications/unread-count',
        MARK_READ: (id) => `/api/notifications/${id}/read`,
        MARK_ALL_READ: '/api/notifications/read-all',
    },
    FORUM: {
        CATEGORIES: '/api/forum/categories',
        POSTS: '/api/forum/posts',
        TRENDING: '/api/forum/trending',
        POST_DETAIL: (postId) => `/api/forum/posts/${postId}`,
        USER_POSTS: (userId) => `/api/forum/users/${userId}/posts`,
        SAVED_POSTS: '/api/forum/saved-posts',
        CREATE_POST: '/api/forum/posts',
        UPDATE_POST: (postId) => `/api/forum/posts/${postId}`,
        DELETE_POST: (postId) => `/api/forum/posts/${postId}`,
        TOGGLE_VOTE: (postId) => `/api/forum/posts/${postId}/vote`,
        VOTE_COUNTS: (postId) => `/api/forum/posts/${postId}/votes`,
        TOGGLE_SAVE: (postId) => `/api/forum/posts/${postId}/save`,
        ADD_COMMENT: (postId) => `/api/forum/posts/${postId}/comments`,
        TOGGLE_COMMENT_VOTE: (commentId) => `/api/forum/comments/${commentId}/vote`,
        UPDATE_COMMENT: (commentId) => `/api/forum/comments/${commentId}`,
        DELETE_COMMENT: (commentId) => `/api/forum/comments/${commentId}`,
        EVENTS: '/api/forum/events',
    },
    ADMIN_ESCROW: '/api/admin/escrow',
    ADMIN_USERS: '/api/admin/users',
    ADMIN_REPORTS: '/api/admin/reports',
};

export default API_ENDPOINTS;
