import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// REPLACE THIS WITH YOUR PC'S LOCAL IPV4 ADDRESS (e.g. 192.168.1.15)
export const BASE_URL = 'http://192.168.1.100:5000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
});

// 1. INJECT TOKEN INTO REQUEST
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 2. AUTO CATCH EXPIRES & REFRESH 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If backend screams 401 Unauthorized, and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token present');

        // Ping the backend for new tokens!
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          token: refreshToken
        });
        
        // Save new safely
        useAuthStore.getState().updateTokens(data.accessToken, data.refreshToken);
        
        // Swap token and instantly replay the failed original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh token is totally dead/logged out elsewhere, hard exit
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
