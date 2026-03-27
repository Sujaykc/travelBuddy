import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true, // Used for splash screen while checking async storage
  
  // Boot up auth state
  initAuth: async () => {
    try {
      const storedAuth = await AsyncStorage.getItem('@auth_data');
      if (storedAuth) {
        const { user, accessToken, refreshToken } = JSON.parse(storedAuth);
        set({ user, accessToken, refreshToken, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },

  // Fire on successful login/signup
  setAuth: async (user, accessToken, refreshToken) => {
    const data = { user, accessToken, refreshToken };
    await AsyncStorage.setItem('@auth_data', JSON.stringify(data));
    set(data);
  },

  // Fire automatically from Axios interceptor
  updateTokens: async (accessToken, refreshToken) => {
    const { user } = get();
    const data = { user, accessToken, refreshToken };
    await AsyncStorage.setItem('@auth_data', JSON.stringify(data));
    set({ accessToken, refreshToken });
  },

  // Fire on manual logout
  logout: async () => {
    await AsyncStorage.removeItem('@auth_data');
    set({ user: null, accessToken: null, refreshToken: null });
  }
}));
