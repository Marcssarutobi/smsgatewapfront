import { api } from './api';
import { AppNotification, PaginatedNotifications } from '../type/notification';

export const notificationService = {
  list: async () => {
    const { data } = await api.get<PaginatedNotifications>('/notifications');
    return data;
  },

  unreadCount: async () => {
    const { data } = await api.get<{ count: number }>('/notifications/unread-count');
    return data.count;
  },

  markRead: async (id: string) => {
    const { data } = await api.post(`/notifications/${id}/read`);
    return data;
  },

  markAllRead: async () => {
    const { data } = await api.post('/notifications/read-all');
    return data;
  },
};
