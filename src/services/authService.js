import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { AUTH } = API_ENDPOINTS;

/**
 * Chuẩn hóa user từ ApiResponse.data (UserAuthResponse) sang state FE (role: admin|user)
 */
export function mapAuthUser(apiPayload, displayName) {
    if (!apiPayload) return null;
    const email = apiPayload.email;
    const name =
        displayName ||
        apiPayload.fullName ||
        (email && email.includes('@') ? email.split('@')[0] : 'User');
    return {
        id: apiPayload.userId || apiPayload.id,
        name,
        fullName: apiPayload.fullName || name,
        email,
        role: apiPayload.role === 'ADMIN' ? 'admin' : 'user',
        avatarUrl: apiPayload.avatarUrl || null,
        creditsBalance: apiPayload.creditsBalance ?? null,
        hasPassword: apiPayload.hasPassword !== false, // default true if not provided
    };
}

/** Map UserResponse DTO (từ GET /users/me) — dùng field names khác với auth response */
export function mapUserResponse(payload) {
    if (!payload) return null;
    return {
        id: payload.id,
        name: payload.fullName || payload.email?.split('@')[0] || 'User',
        fullName: payload.fullName || null,
        email: payload.email,
        role: payload.role === 'ADMIN' ? 'admin' : 'user',
        avatarUrl: payload.avatarUrl || null,
        bio: payload.bio || null,
        hasPassword: payload.hasPassword !== false, // default true if not provided
        // Gamification
        creditsBalance: payload.creditsBalance ?? null,
        // Stats
        totalTeachingSessions: payload.totalTeachingSessions ?? 0,
        totalLearningSessions: payload.totalLearningSessions ?? 0,
        averageRating: payload.averageRating ?? null,
        totalReviews: payload.totalReviews ?? 0,
        totalTeachingSkills: payload.totalTeachingSkills ?? 0,
        // Learning interests
        learningInterests: Array.isArray(payload.learningInterests) ? payload.learningInterests : [],
        // Meta
        createdAt: payload.createdAt || null,
    };
}

function unwrapData(res) {
    if (res && typeof res === 'object' && 'data' in res && res.data !== undefined) {
        return res.data;
    }
    return res;
}

/** Lấy name/given_name từ id_token (JWT) Google — chỉ để hiển thị, backend vẫn xác thực token. */
function googleDisplayNameFromIdToken(idToken) {
    try {
        const part = idToken.split('.')[1];
        if (!part) return undefined;
        const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
        const p = JSON.parse(atob(padded));
        return p.name || p.given_name || undefined;
    } catch {
        return undefined;
    }
}

/**
 * Đăng nhập bằng email và mật khẩu
 */
export const login = async (email, password) => {
    const res = await httpClient.post(AUTH.LOGIN, { email, password });
    return mapAuthUser(unwrapData(res));
};

/**
 * Đăng ký — backend chỉ nhận email + password (AuthenticationRequest)
 */
export const register = async (email, password, displayName) => {
    const res = await httpClient.post(AUTH.REGISTER, { email, password, fullName: displayName || '' });
    return mapAuthUser(unwrapData(res), displayName);
};

/**
 * Đăng nhập Google: gửi id_token (JWT) từ Google Identity Services
 */
export const loginWithGoogleIdToken = async (idToken) => {
    const res = await httpClient.post(AUTH.GOOGLE, { idToken });
    const displayName = googleDisplayNameFromIdToken(idToken);
    return mapAuthUser(unwrapData(res), displayName);
};

function randomState() {
    if (window.crypto?.getRandomValues) {
        const arr = new Uint8Array(16);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
    }
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export const startGoogleLoginRedirect = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
        throw new Error('Thiếu VITE_GOOGLE_CLIENT_ID trong .env');
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const state = randomState();
    sessionStorage.setItem('google_oauth_state', state);
    sessionStorage.setItem('google_oauth_redirect_uri', redirectUri);

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account',
        include_granted_scopes: 'true',
        state,
    });

    window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

export const exchangeGoogleAuthCode = async (code, state) => {
    const expectedState = sessionStorage.getItem('google_oauth_state');
    const redirectUri =
        sessionStorage.getItem('google_oauth_redirect_uri') ||
        `${window.location.origin}/auth/google/callback`;

    if (!code) {
        throw new Error('Thiếu mã xác thực Google (code).');
    }
    if (!state || !expectedState || state !== expectedState) {
        throw new Error('State OAuth không hợp lệ. Vui lòng thử lại.');
    }

    const res = await httpClient.post(AUTH.GOOGLE_EXCHANGE, { code, redirectUri });
    sessionStorage.removeItem('google_oauth_state');
    sessionStorage.removeItem('google_oauth_redirect_uri');
    return mapAuthUser(unwrapData(res));
};

export const getCurrentUser = async () => {
    const res = await httpClient.get(AUTH.GET_ME);
    // /auth/me trả AuthPayload, còn /users/me trả UserResponse — dùng mapAuthUser đã support cả 2
    return mapAuthUser(unwrapData(res));
};

export const logout = async () => {
    await httpClient.post(AUTH.LOGOUT);
};

export const refreshSession = async () => {
    const res = await httpClient.post(AUTH.REFRESH);
    return mapAuthUser(unwrapData(res));
};

/** Xác minh email — không tạo phiên; người dùng đăng nhập sau tại trang đăng nhập */
export const verifyEmail = async (email, otpCode) => {
    await httpClient.post(AUTH.VERIFY_EMAIL, { email, otpCode });
};

export const resendVerificationOtp = async (email) => {
    await httpClient.post(AUTH.RESEND_VERIFICATION, { email });
};

/** Gửi mã OTP đặt lại / thiết lập mật khẩu (email tồn tại trong hệ thống) */
export const requestPasswordReset = async (email) => {
    await httpClient.post(AUTH.FORGOT_PASSWORD, { email });
};

/** OTP + mật khẩu mới — Google-only user cũng dùng để hasPassword = true */
export const resetPasswordWithOtp = async (email, otpCode, newPassword) => {
    await httpClient.post(AUTH.RESET_PASSWORD, { email, otpCode, newPassword });
};
