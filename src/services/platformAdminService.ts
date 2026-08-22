import { api } from './api';
import { useQuery } from '@tanstack/react-query';
import { tokenStorage } from '../lib/tokenStorage';
import type { PlatformDashboardStats, PlatformUsersPage, AnalyticsOverview } from '../type/platformAdmin';

export const platformAdminService = {
  dashboard: async (): Promise<PlatformDashboardStats> => {
    const { data } = await api.get<PlatformDashboardStats>('/admin/dashboard');
    return data;
  },
  users: async (search: string): Promise<PlatformUsersPage> => {
    const { data } = await api.get<PlatformUsersPage>('/admin/users', { params: { search } });
    return data;
  },
  analytics: async (days: number): Promise<AnalyticsOverview> => {
    const { data } = await api.get<AnalyticsOverview>('/admin/analytics', { params: { days } });
    return data;
  },
};

export function usePlatformDashboard() {
  return useQuery({
    queryKey: ['platform-admin', 'dashboard'],
    queryFn: () => platformAdminService.dashboard(),
    enabled: !!tokenStorage.get(),
  });
}

export function usePlatformUsers(search: string) {
  return useQuery({
    queryKey: ['platform-admin', 'users', search],
    queryFn: () => platformAdminService.users(search),
    enabled: !!tokenStorage.get(),
  });
}

export function usePlatformAnalytics(days: number) {
  return useQuery({
    queryKey: ['platform-admin', 'analytics', days],
    queryFn: () => platformAdminService.analytics(days),
    enabled: !!tokenStorage.get(),
    // L'API GA4 peut être lente/en quota — pas besoin de re-fetch agressif,
    // le backend met déjà en cache 15 min de son côté.
    staleTime: 5 * 60 * 1000,
  });
}
