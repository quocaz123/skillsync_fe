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
    ME: "/api/users/me",
    UPDATE_AVATAR: "/api/users/me/avatar",
    UPDATE_BIO: "/api/users/me/bio",
    SET_PASSWORD: "/api/users/me/password",
    TRANSACTIONS: "/api/users/me/transactions",
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
    FORUM_POSTS: '/api/admin/forum-posts',
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
    POSTS: '/api/forum',
    TRENDING: '/api/forum/trending',
    POST_DETAIL: (postId) => `/api/forum/${postId}`,
    USER_POSTS: (userId) => `/api/forum/user/${userId}`,
    SAVED_POSTS: '/api/forum/saved',
    CREATE_POST: '/api/forum',
    UPDATE_POST: (postId) => `/api/forum/${postId}`,
    DELETE_POST: (postId) => `/api/forum/${postId}`,
    TOGGLE_VOTE: (postId) => `/api/forum/${postId}/vote`,
    VOTE_COUNTS: (postId) => `/api/forum/${postId}/votes`,
    TOGGLE_SAVE: (postId) => `/api/forum/${postId}/save`,
    ADD_COMMENT: (postId) => `/api/forum/${postId}/comments`,
    TOGGLE_COMMENT_VOTE: (commentId) => `/api/forum/comments/${commentId}/vote`,
    UPDATE_COMMENT: (commentId) => `/api/forum/comments/${commentId}`,
    DELETE_COMMENT: (commentId) => `/api/forum/comments/${commentId}`,
    EVENTS: '/api/forum/events',
  },
  ADMIN_ESCROW: '/api/admin/escrow',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_REPORTS: '/api/admin/reports',
  ADMIN_SESSIONS: '/api/admin/sessions',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_CREDITS_TRANSACTIONS: '/api/admin/credits/transactions',
  ADMIN_SYSTEM_LOGS: '/api/admin/logs',
    TOGGLE_COMMENT_VOTE: (commentId) => `/api/forum/comments/${commentId}/vote`,
  },
  TEACHING_SKILLS: {
    GET_MY: "/api/teaching-skills/me",
    GET_APPROVED: "/api/teaching-skills/approved",
    CREATE: "/api/teaching-skills",
    DELETE: (id) => `/api/teaching-skills/${id}`,
  },
  UPLOADS: {
    PRESIGNED_URL: "/api/uploads/presigned-url",
  },
  ADMIN: {
    SYSTEM_STATS: "/admin/stats",
    TEACHING_SKILLS: "/api/admin/teaching-skills",
    FORUM_POSTS: "/api/admin/forum-posts",
    TRANSACTIONS: "/api/admin/transactions",
    GRANT_CREDIT: "/api/admin/transactions/grant",
  },
  SLOTS: {
    BY_SKILL: (skillId) => `/api/teaching-skills/${skillId}/slots`,
    OPEN_BY_SKILL: (skillId) => `/api/teaching-skills/${skillId}/slots/open`,
    BATCH_CREATE: (skillId) => `/api/teaching-skills/${skillId}/slots/batch`,
    DELETE: (skillId, slotId) =>
      `/api/teaching-skills/${skillId}/slots/${slotId}`,
  },
  SESSIONS: {
    BOOK: "/api/sessions/book",
    MINE: "/api/sessions/mine",
    ZEGO_TOKEN: (id) => `/api/sessions/${id}/zego-token`,
    JOIN: (id) => `/api/sessions/${id}/join`,
    LEAVE: (id) => `/api/sessions/${id}/leave`,
  },
  LEARNING_PATHS: {
    BY_ID: (id) => `/api/learning-paths/${id}`,
    ENROLL: (id) => `/api/learning-paths/${id}/enroll`,
  },
  USER_LEARNING_PATHS: {
    BY_ID: (id) => `/api/user-learning-paths/${id}`,
  },
};

export default API_ENDPOINTS;