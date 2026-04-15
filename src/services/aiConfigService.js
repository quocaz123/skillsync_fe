// src/services/aiConfigService.js
import axiosClient from '../configuration/axiosClient';

const BASE = '/api/ai/config';

export const aiConfigService = {
  getConfig: async () => {
    const res = await axiosClient.get(BASE);
    return res?.result ?? res;
  },

  updateConfig: async (patch) => {
    const res = await axiosClient.put(BASE, patch);
    return res?.result ?? res;
  },
};
