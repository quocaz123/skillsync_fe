import axios from 'axios';
import { useStore } from '../store/index';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/skillsync',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Quan trọng: Cho phép gửi cookie (HttpOnly/Session) kèm theo mỗi request
});

// Interceptor cho request (để xử lý thêm nếu cần, ví dụ: CSRF token)
axiosClient.interceptors.request.use(
    (config) => {
        // Vì token đã được set qua cookie nên không cần gắn thủ công vào header Authorization nữa
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho response (ví dụ: xử lý lỗi chung, refresh token)
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, please login again');
            useStore.getState().logout();
            // Automatically redirecting to login can also be handled here
            // window.location.href = '/login';
        }

        // Không có response: thường là backend tắt, sai URL, hoặc CORS (trình duyệt vẫn báo network)
        if (!error.response) {
            const code = error.code;
            const msg = String(error.message || '');
            const refused =
                code === 'ECONNREFUSED' ||
                code === 'ERR_NETWORK' ||
                msg === 'Network Error' ||
                /ECONNREFUSED|Failed to fetch|Network Error/i.test(msg);
            if (refused) {
                error.message =
                    'Không kết nối được API. Hãy chạy backend (Spring Boot trên cổng 8080) và kiểm tra VITE_API_BASE_URL trỏ tới đúng địa chỉ /skillsync.';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
