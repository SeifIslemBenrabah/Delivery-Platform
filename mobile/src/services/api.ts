import axios from 'axios';

const BASE_URL = 'http://10.0.2.2/api'; // Android emulator → localhost; change for real device

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

import * as SecureStore from 'expo-secure-store';

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        const { data } = await api.post('/auth/refresh', { refreshToken });
        await SecureStore.setItemAsync('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: Record<string, unknown>) =>
    api.post('/auth/register', data),
};

export const orderService = {
  getMyOrders: () => api.get('/orders/mine'),
  getById: (id: string) => api.get(`/orders/${id}`),
  getAvailableForLivreur: () => api.get('/orders/available'),
  assignToMe: (id: string) => api.patch(`/orders/${id}/assign`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

export const boutiqueService = {
  getAll: () => api.get('/boutiques'),
};

export const trackingService = {
  getOrderTracking: (orderId: string) =>
    api.get(`/tracking/order/${orderId}`),
};

export const optimizationService = {
  getOptimizedRoute: (livreurId: string) =>
    api.get(`/optimize/route/${livreurId}`),
};