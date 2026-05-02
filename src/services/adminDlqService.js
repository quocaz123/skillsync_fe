import axios from 'axios';

// Kết nối trực tiếp đến Service Notification (cổng 8081)
const NOTIFICATION_URL = import.meta.env.VITE_NOTIFICATION_API_URL || 'http://localhost:8081/notification';

export const getDlqMessageCount = async () => {
    try {
        const response = await axios.get(`${NOTIFICATION_URL}/api/v1/notification/dlq/count`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const retryAllDlqMessages = async () => {
    try {
        const response = await axios.post(`${NOTIFICATION_URL}/api/v1/notification/dlq/retryAll`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
