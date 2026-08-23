import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';

// Une seule requête (liste + compteur non-lu regroupés par le backend,
// voir NotificationController::index), polling 30s — suffisant pour un
// centre de notifications, pas besoin de websocket ici.
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.list,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useRegisterFcmToken() {
  return useMutation({ mutationFn: notificationService.registerFcmToken });
}
