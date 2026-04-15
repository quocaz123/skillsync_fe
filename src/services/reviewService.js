import httpClient from '../configuration/axiosClient';
import { API_ENDPOINTS } from '../configuration/apiEndpoints';

const { REVIEWS } = API_ENDPOINTS;

export const createSessionReview = async (sessionId, rating, comment) => {
    try {
        const response = await httpClient.post(REVIEWS.CREATE, {
            sessionId,
            rating,
            comment
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getReviewsByUserId = async (userId) => {
    try {
        const response = await httpClient.get(`${REVIEWS.CREATE}/user/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
};
