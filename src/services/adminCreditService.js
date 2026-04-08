import httpClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';

export const getAdminCreditTransactions = async (type = null) => {
    const params = {};
    if (type && type !== 'ALL') params.type = type;
    const response = await httpClient.get(API_ENDPOINTS.ADMIN_CREDITS_TRANSACTIONS, { params });
    return response ?? [];
};
