import { googleLogout } from '@react-oauth/google';
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
        (email && email.includes('@') ? email.split('@')[0] : 'User');
    return {
        id: apiPayload.userId,
        name,
        email,
        role: apiPayload.role === 'ADMIN' ? 'admin' : 'user',
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
    const res = await httpClient.post(AUTH.REGISTER, { email, password });
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

export const getCurrentUser = async () => {
    const res = await httpClient.get(AUTH.GET_ME);
    return mapAuthUser(unwrapData(res));
};

export const logout = async () => {
    try {
        await httpClient.post(AUTH.LOGOUT);
    } finally {
        try {
            googleLogout();
        } catch {
            /* GSI chưa load hoặc không dùng Google */
        }
    }
};

export const refreshSession = async () => {
    const res = await httpClient.post(AUTH.REFRESH);
    return mapAuthUser(unwrapData(res));
};
