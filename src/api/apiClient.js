const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = async (endpoint, options = {}) => {
  const { body, headers = {}, method = 'GET', isFormData = false, ...customConfig } = options;

  const token = localStorage.getItem('gajanan_admin_token');

  const defaultHeaders = {};

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers
    },
    ...customConfig
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  try {
    const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || `HTTP error! Status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const offlineErr = new Error('Backend server is offline or unreachable on port 5000.');
      offlineErr.isOffline = true;
      throw offlineErr;
    }
    throw error;
  }
};
