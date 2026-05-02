import axios from 'axios';
import { useStore } from '../store/index';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/skillsync';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Flag để tránh vòng lặp vô hạn khi refresh cũng thất bại
let isRefreshing = false;
let failedQueue = []; // Hàng đợi các request bị 401 trong lúc đang refresh

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            const apiRes = response.data;
            // Tự động bóc tách dữ liệu nếu backend trả về cấu trúc ApiResponse { code, message, data }
            if (apiRes.code !== undefined && apiRes.message !== undefined && Object.prototype.hasOwnProperty.call(apiRes, 'data')) {
                return apiRes.data;
            }
            return response.data;
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Network error — không có response
        if (!error.response) {
            const code = error.code;
            const msg = String(error.message || '');
            const refused =
                code === 'ECONNREFUSED' ||
                code === 'ERR_NETWORK' ||
                msg === 'Network Error' ||
                /ECONNREFUSED|Failed to fetch|Network Error/i.test(msg);
            if (refused) {
                error.message = 'Không kết nối được API. Hãy chạy backend (Spring Boot trên cổng 8080) và kiểm tra VITE_API_BASE_URL.';
            }
            return Promise.reject(error);
        }

        // Token hết hạn / thiếu quyền thường có thể trả 401 hoặc 403 → thử refresh một lần
        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            // Tránh retry loop cho chính request /auth/refresh, và KHÔNG refresh nếu đang login/register bị sai pass
            if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')) {
                useStore.getState().logout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Đang refresh rồi — các request khác đợi vào hàng
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => axiosClient(originalRequest))
                  .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Cookie HttpOnly (refresh token) tự gửi kèm nhờ withCredentials
                // Backend route là: /auth/refresh (không có /api prefix)
                await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                processQueue(null);
                return axiosClient(originalRequest); // Retry request gốc
            } catch (refreshError) {
                processQueue(refreshError);
                useStore.getState().logout();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login?session_expired=true';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
