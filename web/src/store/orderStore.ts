import { create } from 'zustand';
import type { Commande } from '../types';
import { orderService } from '../services/api';

interface OrderState {
  orders: Commande[];
  currentOrder: Commande | null;
  loading: boolean;
  fetchMyOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (data: Record<string, unknown>) => Promise<Commande>;
  updateStatus: (id: string, status: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,

  fetchMyOrders: async () => {
    set({ loading: true });
    const { data } = await orderService.getMyOrders();
    set({ orders: data, loading: false });
  },

  fetchOrder: async (id) => {
    const { data } = await orderService.getById(id);
    set({ currentOrder: data });
  },

  createOrder: async (orderData) => {
    const { data } = await orderService.create(orderData);
    set((s) => ({ orders: [data, ...s.orders] }));
    return data;
  },

  updateStatus: async (id, status) => {
    await orderService.updateStatus(id, status);
    set((s) => ({
      orders: s.orders.map((o) =>
        o.idCommande === id ? { ...o, statusCommande: status as Commande['statusCommande'] } : o
      ),
    }));
  },
}));