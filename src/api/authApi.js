import { apiClient } from './apiClient';

export const authApi = {
  login: async (credentials) => {
    return await apiClient('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  getProfile: async () => {
    return await apiClient('/auth/me', {
      method: 'GET'
    });
  }
};
