import httpClient from '../configuration/axiosClient';

function unwrapData(res) {
    if (res && typeof res === 'object' && 'data' in res && res.data !== undefined) {
        return res.data;
    }
    return res;
}

export const getMyMissions = async () => {
    const res = await httpClient.get('/api/user-missions/me');
    return unwrapData(res);
};

export const completeMission = async (missionId) => {
    const res = await httpClient.post(`/api/user-missions/${missionId}/complete`);
    return unwrapData(res);
};

export const trackAction = async (action) => {
    const res = await httpClient.post(`/api/user-missions/action/${action}`);
    return unwrapData(res);
};
