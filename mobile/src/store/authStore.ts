import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/api';

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CLIENT' | 'LIVREUR' | 'COMMERCANT' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,

  hydrate: async () => {
    const token = await SecureStore.getItemAsync('accessToken');
    const userStr = await SecureStore.getItemAsync('user');
    if (token && userStr) {
      set({ user: JSON.parse(userStr), isAuthenticated: true });
    }
    set({ hydrated: true });
  },

  login: async (email, password) => {
    const { data } = await authService.login(email, password);
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');
    set({ user: null, isAuthenticated: false });
  },
}));