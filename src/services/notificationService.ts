import { api } from './api';
import { NotificationsResponse } from '../type/notification';

export const notificationService = {
  // Une seule requête renvoie à la fois la liste ET le compteur non-lu
  // (voir NotificationController::index côté backend) — pas d'endpoint
  // /unread-count séparé.
  list: async () => {
    const { data } = await api.get<NotificationsResponse>('/notifications');
    return data;
  },

  markRead: async (id: string) => {
    const { data } = await api.post(`/notifications/${id}/read`);
    return data;
  },

  markAllRead: async () => {
    const { data } = await api.post('/notifications/read-all');
    return data;
  },

  // Enregistre le token FCM de cet appareil (web ou mobile) pour recevoir
  // de vraies notifications push, en plus du centre de notifications en base.
  registerFcmToken: async (fcmToken: string) => {
    const { data } = await api.post('/notifications/fcm-token', { fcm_token: fcmToken });
    return data;
  },
};
