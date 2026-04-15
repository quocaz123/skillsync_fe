// src/services/aiService.js
import axiosClient from '../configuration/axiosClient';

const API_BASE = '/api/ai';

// sessionId per browser tab — persists until reset or page close
let currentSessionId = crypto.randomUUID();

export const aiService = {
  sendMessage: async (message) => {
    const res = await axiosClient.post(`${API_BASE}/chat`, {
      sessionId: currentSessionId,
      message,
    });
    // axiosClient unwraps .result — handle both shapes
    return res?.result ?? res;
  },

  resetSession: async () => {
    try {
      await axiosClient.delete(`${API_BASE}/chat/${currentSessionId}`);
    } finally {
      currentSessionId = crypto.randomUUID();
    }
  },

  getSessionId: () => currentSessionId,
};
