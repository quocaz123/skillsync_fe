import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const unwrap = (res) => res?.result ?? (Array.isArray(res) ? res : res);

export const getMyNotifications = async (page = 0, size = 20) => {
    const res = await httpClient.get(API_ENDPOINTS.NOTIFICATIONS.MINE, {
        params: { page, size, sort: 'createdAt,desc' }
    });
    return unwrap(res);
};

export const getUnreadCount = async () => {
    const res = await httpClient.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return unwrap(res);
};

export const markAsRead = async (id) => {
    await httpClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
};

export const markAllAsRead = async () => {
    await httpClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
};
