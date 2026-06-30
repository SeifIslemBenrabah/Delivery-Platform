import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Attach JWT ────────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auto-refresh on 401 ───────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const { data } = await api.post('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: Record<string, unknown>) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// ─── Users ─────────────────────────────────────────────────────────────────
export const userService = {
  me: () => api.get('/users/me'),
  update: (data: Record<string, unknown>) => api.put('/users/me', data),
  getLivreurs: () => api.get('/users/livreurs'),
  getCommerçants: () => api.get('/users/commercants'),
};

// ─── Boutiques / Produits ──────────────────────────────────────────────────
export const boutiqueService = {
  getAll: () => api.get('/boutiques'),
  getById: (id: string) => api.get(`/boutiques/${id}`),
  create: (data: FormData) =>
    api.post('/boutiques', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put(`/boutiques/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/boutiques/${id}`),
};

export const produitService = {
  getByBoutique: (idBoutique: string) =>
    api.get(`/products?boutique=${idBoutique}`),
  create: (data: FormData) =>
    api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ─── Orders ────────────────────────────────────────────────────────────────
export const orderService = {
  getMyOrders: () => api.get('/orders/mine'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: Record<string, unknown>) => api.post('/orders', data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
  getAvailableForLivreur: () => api.get('/orders/available'),
  assignToMe: (id: string) => api.patch(`/orders/${id}/assign`),
  getAll: () => api.get('/orders'), // admin
};

// ─── Optimization ──────────────────────────────────────────────────────────
export const optimizationService = {
  getOptimizedRoute: (livreurId: string) =>
    api.get(`/optimize/route/${livreurId}`),
  assignOrders: (livreurId: string, orderIds: string[]) =>
    api.post('/optimize/assign', { livreurId, orderIds }),
};

// ─── Tracking ──────────────────────────────────────────────────────────────
export const trackingService = {
  getOrderTracking: (orderId: string) =>
    api.get(`/tracking/order/${orderId}`),
  getLivreurPosition: (livreurId: string) =>
    api.get(`/tracking/livreur/${livreurId}`),
};

// ─── Payment ───────────────────────────────────────────────────────────────
export const paymentService = {
  initiatePayment: (orderId: string) =>
    api.post('/payment/initiate', { orderId }),
  getPaymentStatus: (paymentId: string) =>
    api.get(`/payment/${paymentId}`),
  getMyPayments: () => api.get('/payment/mine'),
};