/**
 * Khai báo tập trung toàn bộ các Endpoint của ứng dụng.
 * Đồng bộ theo `skillsync/skill_be` controllers.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_EXCHANGE: "/auth/google/exchange",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },

  USERS: {
    GET_ALL: "/api/users",
    ME: "/api/users/me",
    TRANSACTIONS: "/api/users/me/transactions",
    UPDATE_AVATAR: "/api/users/me/avatar",
    UPDATE_BIO: "/api/users/me/bio",
    SET_PASSWORD: "/api/users/me/password",
  },

  SKILLS: {
    GET_ALL: "/api/skills",
  },

  TEACHING_SKILLS: {
    GET_MY: "/api/teaching-skills/me",
    GET_APPROVED: "/api/teaching-skills/approved",
    /** Tìm kiếm + lọc + phân trang (q, skillId, category, sort, page, size) */
    EXPLORE: "/api/teaching-skills/explore",
    CREATE: "/api/teaching-skills",
    DELETE: (id) => `/api/teaching-skills/${id}`,
    UPDATE_PRICE: (id) => `/api/teaching-skills/${id}/price`,
    TOGGLE_VISIBILITY: (id) => `/api/teaching-skills/${id}/toggle-visibility`,
  },

  SLOTS: {
    BY_SKILL: (teachingSkillId) => `/api/teaching-skills/${teachingSkillId}/slots`,
    OPEN_BY_SKILL: (teachingSkillId) => `/api/teaching-skills/${teachingSkillId}/slots/open`,
    BATCH_CREATE: (teachingSkillId) => `/api/teaching-skills/${teachingSkillId}/slots/batch`,
    DELETE: (teachingSkillId, slotId) => `/api/teaching-skills/${teachingSkillId}/slots/${slotId}`,
  },

  SESSIONS: {
    BOOK: "/api/sessions/book",
    PROPOSE: "/api/sessions/propose",
    MINE: "/api/sessions/mine",
    APPROVE: (id) => `/api/sessions/${id}/approve`,
    REJECT: (id) => `/api/sessions/${id}/reject`,
    ZEGO_TOKEN: (id) => `/api/sessions/${id}/zego-token`,
    JOIN: (id) => `/api/sessions/${id}/join`,
    LEAVE: (id) => `/api/sessions/${id}/leave`,
    CONFIRM: (id) => `/api/sessions/${id}/confirm`,
  },

  UPLOADS: {
    PRESIGNED_URL: "/api/uploads/presigned-url",
  },

  CREDITS: {
    HISTORY: "/api/credits/history",
  },

  REVIEWS: {
    CREATE: "/api/reviews",
    BY_USER: (userId) => `/api/reviews/user/${userId}`,
  },

  REPORTS: {
    CREATE_SESSION_REPORT: (sessionId) => `/api/reports/session/${sessionId}`,
    PENDING: "/api/reports/pending",
    RESOLVE: (reportId) => `/api/reports/${reportId}/resolve`,
  },

  NOTIFICATIONS: {
    MINE: "/api/notifications",
    UNREAD_COUNT: "/api/notifications/unread-count",
    MARK_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/read-all",
  },

  FORUM: {
    CATEGORIES: "/api/forum/categories",
    POSTS: "/api/forum",
    TRENDING: "/api/forum/trending",
    POST_DETAIL: (postId) => `/api/forum/${postId}`,
    USER_POSTS: (userId) => `/api/forum/user/${userId}`,
    SAVED_POSTS: "/api/forum/saved",
    CREATE_POST: "/api/forum",
    UPDATE_POST: (postId) => `/api/forum/${postId}`,
    DELETE_POST: (postId) => `/api/forum/${postId}`,
    TOGGLE_VOTE: (postId) => `/api/forum/${postId}/vote`,
    VOTE_COUNTS: (postId) => `/api/forum/${postId}/votes`,
    TOGGLE_SAVE: (postId) => `/api/forum/${postId}/save`,
    ADD_COMMENT: (postId) => `/api/forum/${postId}/comments`,
    TOGGLE_COMMENT_VOTE: (commentId) => `/api/forum/comments/${commentId}/vote`,
    UPDATE_COMMENT: (commentId) => `/api/forum/comments/${commentId}`,
    DELETE_COMMENT: (commentId) => `/api/forum/comments/${commentId}`,
    EVENTS: "/api/forum/events",
  },

  ADMIN: {
    USERS: "/api/admin/users",
    REPORTS: "/api/admin/reports",
    SESSIONS: "/api/admin/sessions",
    STATS: "/api/admin/stats",
    LOGS: "/api/admin/logs",
    ESCROW: "/api/admin/escrow",
    TEACHING_SKILLS: "/api/admin/teaching-skills",
    FORUM_POSTS: "/api/admin/forum-posts",

    CREDITS: "/api/admin/credits",
    CREDIT_TRANSACTIONS: "/api/admin/credits/transactions",
    GRANT_CREDIT: "/api/admin/credits/grant",
  },

  LEARNING_PATHS: {
    GET_ALL: "/api/learning-paths",             // Admin: tất cả
    GET_APPROVED: "/api/learning-paths/approved", // Public: Khám phá
    GET_MY: "/api/learning-paths/my",            // Mentor: lộ trình của mình
    GET_ENROLLED: "/api/learning-paths/enrolled", // User: lộ trình đã đăng ký
    GET_BY_ID: (id) => `/api/learning-paths/${id}`,
    ENROLL: (id) => `/api/learning-paths/${id}/enroll`,
    CREATE: "/api/learning-paths",               // POST ?mentorId=
    ADMIN_APPROVE: (id) => `/api/learning-paths/${id}/approve`,
    ADMIN_REJECT: (id) => `/api/learning-paths/${id}/reject`,
  },
};

export default API_ENDPOINTS;