import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { CREDITS } = API_ENDPOINTS;

const unwrap = (res) => res?.result ?? (Array.isArray(res) ? res : res);

export const getMyCreditHistory = async () => {
    const res = await httpClient.get(CREDITS.HISTORY);
    return unwrap(res);
};
